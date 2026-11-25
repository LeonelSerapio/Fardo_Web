import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { MOCK_FARDOS, CATEGORIES } from '@/data/mock-data';
import { getDb } from '@/db';
import { categories, fardos, orderItems, orders, stockMovements } from '@/db/schema';
import { isDatabaseConfigured } from '@/lib/env';
import {
  FardoProduct,
  CategoryItem,
  FardoQueryParams,
  CreateOrderDto,
  OrderQuoteResponse,
} from '@/types';

export interface IFardoRepository {
  findMany(params?: FardoQueryParams): Promise<{ items: FardoProduct[]; total: number }>;
  findById(id: string): Promise<FardoProduct | null>;
  findCategories(): Promise<CategoryItem[]>;
  createQuote(dto: CreateOrderDto): Promise<OrderQuoteResponse>;
}

function mapFardoRow(row: typeof fardos.$inferSelect): FardoProduct {
  return {
    id: row.id,
    title: row.title,
    category: row.categoryId as FardoProduct['category'],
    quality: row.quality,
    weightKg: row.weightKg,
    estimatedUnitsMin: row.estimatedUnitsMin,
    estimatedUnitsMax: row.estimatedUnitsMax,
    priceArs: row.priceArs,
    availableStock: row.availableStock,
    reservedStock: row.reservedStock,
    dropId: row.dropId,
    isPopular: row.isPopular,
    isNewDrop: row.isNewDrop,
    isActive: row.isActive,
    image: row.image,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
  };
}

export class NeonFardoRepository implements IFardoRepository {
  async findMany(params: FardoQueryParams = {}): Promise<{ items: FardoProduct[]; total: number }> {
    const db = getDb();
    const conditions = [eq(fardos.isActive, true)];

    if (params.category && params.category !== 'all') {
      conditions.push(eq(fardos.categoryId, params.category));
    }

    if (params.quality && params.quality !== 'all') {
      conditions.push(eq(fardos.quality, params.quality as FardoProduct['quality']));
    }

    if (params.dropId) {
      conditions.push(eq(fardos.dropId, params.dropId));
    }

    if (params.search && params.search.trim()) {
      const pattern = `%${params.search.trim()}%`;
      const searchCond = or(
        ilike(fardos.title, pattern),
        ilike(fardos.categoryId, pattern),
        sql`${fardos.highlights}::text ILIKE ${pattern}`
      );
      if (searchCond) conditions.push(searchCond);
    }

    const whereClause = and(...conditions);

    const sort = params.sortBy || 'popular';
    const orderByClause =
      sort === 'price-asc'
        ? [asc(fardos.priceArs)]
        : sort === 'price-desc'
          ? [desc(fardos.priceArs)]
          : sort === 'weight'
            ? [asc(fardos.weightKg)]
            : [desc(fardos.isPopular), desc(fardos.createdAt)];

    const offset = params.offset || 0;
    const limit = params.limit ? Math.min(params.limit, 50) : 50;

    const [rows, countRows] = await Promise.all([
      db
        .select()
        .from(fardos)
        .where(whereClause)
        .orderBy(...orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(fardos)
        .where(whereClause),
    ]);

    return {
      items: rows.map(mapFardoRow),
      total: countRows[0]?.count ?? 0,
    };
  }

  async findById(id: string): Promise<FardoProduct | null> {
    const db = getDb();
    const [row] = await db.select().from(fardos).where(eq(fardos.id, id)).limit(1);
    return row ? mapFardoRow(row) : null;
  }

  async findCategories(): Promise<CategoryItem[]> {
    const db = getDb();
    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        iconName: categories.iconName,
        count: sql<number>`count(${fardos.id})::int`,
      })
      .from(categories)
      .leftJoin(fardos, and(eq(fardos.categoryId, categories.id), eq(fardos.isActive, true)))
      .groupBy(categories.id)
      .orderBy(asc(categories.name));

    return rows;
  }

  async createQuote(dto: CreateOrderDto): Promise<OrderQuoteResponse> {
    if (!dto.items || dto.items.length === 0) {
      throw new Error('El pedido debe incluir al menos un fardo.');
    }

    const db = getDb();

    return db.transaction(async (tx) => {
      const quoteItems: OrderQuoteResponse['items'] = [];
      let totalArs = 0;
      let totalWeightKg = 0;
      let totalEstimatedUnitsMin = 0;
      let totalEstimatedUnitsMax = 0;

      const stockSnapshots: Array<{
        fardoId: string;
        quantity: number;
        stockBefore: number;
        stockAfter: number;
        title: string;
        unitPriceArs: number;
        subtotalArs: number;
      }> = [];

      // Lock each fardo row with FOR UPDATE to prevent concurrent overselling
      for (const item of dto.items) {
        if (item.quantity <= 0) {
          throw new Error(`Cantidad inválida para el fardo "${item.productId}".`);
        }

        const [row] = await tx
          .select()
          .from(fardos)
          .where(and(eq(fardos.id, item.productId), eq(fardos.isActive, true)))
          .for('update')
          .limit(1);

        if (!row) {
          throw new Error(`Fardo con ID "${item.productId}" no encontrado o inactivo.`);
        }

        if (item.quantity > row.availableStock) {
          throw new Error(
            `Stock insuficiente para "${row.title}". Solicitado: ${item.quantity}, disponible: ${row.availableStock}.`
          );
        }

        const stockBefore = row.availableStock;
        const stockAfter = stockBefore - item.quantity;

        await tx
          .update(fardos)
          .set({
            availableStock: stockAfter,
            reservedStock: row.reservedStock + item.quantity,
            updatedAt: new Date(),
          })
          .where(eq(fardos.id, row.id));

        const subtotalArs = row.priceArs * item.quantity;
        totalArs += subtotalArs;
        totalWeightKg += row.weightKg * item.quantity;
        totalEstimatedUnitsMin += row.estimatedUnitsMin * item.quantity;
        totalEstimatedUnitsMax += row.estimatedUnitsMax * item.quantity;

        stockSnapshots.push({
          fardoId: row.id,
          quantity: item.quantity,
          stockBefore,
          stockAfter,
          title: row.title,
          unitPriceArs: row.priceArs,
          subtotalArs,
        });

        quoteItems.push({
          product: mapFardoRow({
            ...row,
            availableStock: stockAfter,
            reservedStock: row.reservedStock + item.quantity,
          }),
          quantity: item.quantity,
          subtotalArs,
        });
      }

      const orderCode = `FC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

      const [createdOrder] = await tx
        .insert(orders)
        .values({
          orderCode,
          customerName: dto.customerName?.trim() || null,
          customerPhone: dto.customerPhone?.trim() || null,
          shippingCity: dto.shippingCity?.trim() || null,
          status: 'pending_confirmation',
          totalArs,
          totalWeightKg,
          totalEstimatedUnitsMin,
          totalEstimatedUnitsMax,
        })
        .returning();

      await tx.insert(orderItems).values(
        stockSnapshots.map((snap) => ({
          orderId: createdOrder.id,
          fardoId: snap.fardoId,
          fardoTitleSnapshot: snap.title,
          quantity: snap.quantity,
          unitPriceArs: snap.unitPriceArs,
          subtotalArs: snap.subtotalArs,
        }))
      );

      await tx.insert(stockMovements).values(
        stockSnapshots.map((snap) => ({
          fardoId: snap.fardoId,
          orderId: createdOrder.id,
          type: 'reserve' as const,
          quantityDelta: -snap.quantity,
          stockBefore: snap.stockBefore,
          stockAfter: snap.stockAfter,
          note: `Reserva automática por pedido ${orderCode}`,
        }))
      );

      return {
        orderId: createdOrder.orderCode,
        items: quoteItems,
        totalArs,
        totalWeightKg,
        totalEstimatedUnitsMin,
        totalEstimatedUnitsMax,
        status: createdOrder.status,
        createdAt: createdOrder.createdAt.toISOString(),
      };
    });
  }
}

export class InMemoryFardoRepository implements IFardoRepository {
  private products: FardoProduct[] = [...MOCK_FARDOS];
  private categories: CategoryItem[] = [...CATEGORIES];

  async findMany(params: FardoQueryParams = {}): Promise<{ items: FardoProduct[]; total: number }> {
    let result = [...this.products];

    if (params.category && params.category !== 'all') {
      result = result.filter((p) => p.category === params.category);
    }

    if (params.quality && params.quality !== 'all') {
      result = result.filter((p) => p.quality === params.quality);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter((p) => {
        const inTitle = p.title.toLowerCase().includes(q);
        const inHighlights = p.highlights.some((h) => h.toLowerCase().includes(q));
        const inCategory = p.category.toLowerCase().includes(q);
        return inTitle || inHighlights || inCategory;
      });
    }

    const sort = params.sortBy || 'popular';
    result.sort((a, b) => {
      if (sort === 'price-asc') return a.priceArs - b.priceArs;
      if (sort === 'price-desc') return b.priceArs - a.priceArs;
      if (sort === 'weight') return a.weightKg - b.weightKg;
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });

    const total = result.length;
    const offset = params.offset || 0;
    const limit = params.limit ? Math.min(params.limit, 50) : 50;

    return { items: result.slice(offset, offset + limit), total };
  }

  async findById(id: string): Promise<FardoProduct | null> {
    return this.products.find((p) => p.id === id) || null;
  }

  async findCategories(): Promise<CategoryItem[]> {
    return this.categories;
  }

  async createQuote(dto: CreateOrderDto): Promise<OrderQuoteResponse> {
    if (!dto.items || dto.items.length === 0) {
      throw new Error('El pedido debe incluir al menos un fardo.');
    }

    const quoteItems: OrderQuoteResponse['items'] = [];
    let totalArs = 0;
    let totalWeightKg = 0;
    let totalEstimatedUnitsMin = 0;
    let totalEstimatedUnitsMax = 0;

    for (const item of dto.items) {
      const product = await this.findById(item.productId);
      if (!product) {
        throw new Error(`Fardo con ID "${item.productId}" no encontrado.`);
      }
      if (item.quantity <= 0) {
        throw new Error(`Cantidad inválida para el fardo ${product.title}.`);
      }
      if (item.quantity > product.availableStock) {
        throw new Error(
          `Stock insuficiente para "${product.title}". Solicitado: ${item.quantity}, disponible: ${product.availableStock}.`
        );
      }

      const subtotalArs = product.priceArs * item.quantity;
      totalArs += subtotalArs;
      totalWeightKg += product.weightKg * item.quantity;
      totalEstimatedUnitsMin += product.estimatedUnitsMin * item.quantity;
      totalEstimatedUnitsMax += product.estimatedUnitsMax * item.quantity;

      quoteItems.push({ product, quantity: item.quantity, subtotalArs });
    }

    const orderId = `FC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

    return {
      orderId,
      items: quoteItems,
      totalArs,
      totalWeightKg,
      totalEstimatedUnitsMin,
      totalEstimatedUnitsMax,
      status: 'pending_confirmation',
      createdAt: new Date().toISOString(),
    };
  }
}

const neonRepo = new NeonFardoRepository();
const memoryRepo = new InMemoryFardoRepository();

function getActiveRepository(): IFardoRepository {
  return isDatabaseConfigured() ? neonRepo : memoryRepo;
}

export const fardoRepository: IFardoRepository = {
  findMany: (params) => getActiveRepository().findMany(params),
  findById: (id) => getActiveRepository().findById(id),
  findCategories: () => getActiveRepository().findCategories(),
  createQuote: (dto) => getActiveRepository().createQuote(dto),
};
