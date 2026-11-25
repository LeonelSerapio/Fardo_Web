import { desc, eq, inArray, sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { drops, dropSubscribers, fardos, orderItems, orders, stockMovements } from '@/db/schema';
import {
  AdjustStockDto,
  AdminOrderRecord,
  CreateDropDto,
  CreateFardoDto,
  DropItem,
  FardoProduct,
  OrderStatus,
  StockMovementItem,
  UpdateDropDto,
  UpdateFardoDto,
} from '@/types';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

export class AdminRepository {
  // ---- FARDOS ----
  async listAllFardos(): Promise<FardoProduct[]> {
    const db = getDb();
    const rows = await db.select().from(fardos).orderBy(desc(fardos.createdAt));
    return rows.map((row) => ({
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
    }));
  }

  async createFardo(dto: CreateFardoDto): Promise<FardoProduct> {
    const db = getDb();
    const id = dto.id?.trim() ? slugify(dto.id) : `${slugify(dto.title)}-${dto.weightKg}kg`;

    return db.transaction(async (tx) => {
      const [created] = await tx
        .insert(fardos)
        .values({
          id,
          title: dto.title.trim(),
          categoryId: dto.category,
          dropId: dto.dropId || null,
          quality: dto.quality,
          weightKg: dto.weightKg,
          estimatedUnitsMin: dto.estimatedUnitsMin,
          estimatedUnitsMax: dto.estimatedUnitsMax,
          priceArs: dto.priceArs,
          availableStock: Math.max(0, dto.availableStock),
          reservedStock: 0,
          isPopular: Boolean(dto.isPopular),
          isNewDrop: Boolean(dto.isNewDrop || dto.dropId),
          isActive: dto.isActive ?? true,
          image: dto.image.trim(),
          highlights: dto.highlights.filter((h) => h.trim().length > 0),
        })
        .returning();

      if (created.availableStock > 0) {
        await tx.insert(stockMovements).values({
          fardoId: created.id,
          type: 'restock',
          quantityDelta: created.availableStock,
          stockBefore: 0,
          stockAfter: created.availableStock,
          note: 'Alta inicial desde panel admin',
        });
      }

      return {
        id: created.id,
        title: created.title,
        category: created.categoryId as FardoProduct['category'],
        quality: created.quality,
        weightKg: created.weightKg,
        estimatedUnitsMin: created.estimatedUnitsMin,
        estimatedUnitsMax: created.estimatedUnitsMax,
        priceArs: created.priceArs,
        availableStock: created.availableStock,
        reservedStock: created.reservedStock,
        dropId: created.dropId,
        isPopular: created.isPopular,
        isNewDrop: created.isNewDrop,
        isActive: created.isActive,
        image: created.image,
        highlights: created.highlights,
      };
    });
  }

  async updateFardo(id: string, dto: UpdateFardoDto): Promise<FardoProduct> {
    const db = getDb();
    const patch: Partial<typeof fardos.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (dto.title !== undefined) patch.title = dto.title.trim();
    if (dto.category !== undefined) patch.categoryId = dto.category;
    if (dto.dropId !== undefined) patch.dropId = dto.dropId || null;
    if (dto.quality !== undefined) patch.quality = dto.quality;
    if (dto.weightKg !== undefined) patch.weightKg = dto.weightKg;
    if (dto.estimatedUnitsMin !== undefined) patch.estimatedUnitsMin = dto.estimatedUnitsMin;
    if (dto.estimatedUnitsMax !== undefined) patch.estimatedUnitsMax = dto.estimatedUnitsMax;
    if (dto.priceArs !== undefined) patch.priceArs = dto.priceArs;
    if (dto.isPopular !== undefined) patch.isPopular = dto.isPopular;
    if (dto.isNewDrop !== undefined) patch.isNewDrop = dto.isNewDrop;
    if (dto.isActive !== undefined) patch.isActive = dto.isActive;
    if (dto.image !== undefined) patch.image = dto.image.trim();
    if (dto.highlights !== undefined) patch.highlights = dto.highlights;

    const [updated] = await db.update(fardos).set(patch).where(eq(fardos.id, id)).returning();
    if (!updated) {
      throw new Error(`Fardo "${id}" no encontrado.`);
    }

    return {
      id: updated.id,
      title: updated.title,
      category: updated.categoryId as FardoProduct['category'],
      quality: updated.quality,
      weightKg: updated.weightKg,
      estimatedUnitsMin: updated.estimatedUnitsMin,
      estimatedUnitsMax: updated.estimatedUnitsMax,
      priceArs: updated.priceArs,
      availableStock: updated.availableStock,
      reservedStock: updated.reservedStock,
      dropId: updated.dropId,
      isPopular: updated.isPopular,
      isNewDrop: updated.isNewDrop,
      isActive: updated.isActive,
      image: updated.image,
      highlights: updated.highlights,
    };
  }

  // ---- STOCK (ATOMIC + AUDITABLE) ----
  async adjustStock(dto: AdjustStockDto): Promise<StockMovementItem> {
    if (!dto.fardoId) throw new Error('fardoId es requerido.');
    if (!Number.isInteger(dto.quantityDelta) || dto.quantityDelta === 0) {
      throw new Error('quantityDelta debe ser un entero distinto de 0.');
    }

    const db = getDb();

    return db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(fardos)
        .where(eq(fardos.id, dto.fardoId))
        .for('update')
        .limit(1);

      if (!row) {
        throw new Error(`Fardo "${dto.fardoId}" no encontrado.`);
      }

      const stockBefore = row.availableStock;
      const stockAfter = stockBefore + dto.quantityDelta;

      if (stockAfter < 0) {
        throw new Error(
          `El ajuste dejaría stock negativo (${stockAfter}). Stock actual: ${stockBefore}.`
        );
      }

      await tx
        .update(fardos)
        .set({
          availableStock: stockAfter,
          updatedAt: new Date(),
        })
        .where(eq(fardos.id, row.id));

      const [movement] = await tx
        .insert(stockMovements)
        .values({
          fardoId: row.id,
          type: dto.type,
          quantityDelta: dto.quantityDelta,
          stockBefore,
          stockAfter,
          note: dto.note?.trim() || null,
        })
        .returning();

      return {
        id: movement.id,
        fardoId: movement.fardoId,
        fardoTitle: row.title,
        orderId: movement.orderId,
        type: movement.type,
        quantityDelta: movement.quantityDelta,
        stockBefore: movement.stockBefore,
        stockAfter: movement.stockAfter,
        note: movement.note,
        createdAt: movement.createdAt.toISOString(),
      };
    });
  }

  async listStockMovements(fardoId?: string, limit = 50): Promise<StockMovementItem[]> {
    const db = getDb();
    const baseQuery = db
      .select({
        id: stockMovements.id,
        fardoId: stockMovements.fardoId,
        fardoTitle: fardos.title,
        orderId: stockMovements.orderId,
        type: stockMovements.type,
        quantityDelta: stockMovements.quantityDelta,
        stockBefore: stockMovements.stockBefore,
        stockAfter: stockMovements.stockAfter,
        note: stockMovements.note,
        createdAt: stockMovements.createdAt,
      })
      .from(stockMovements)
      .leftJoin(fardos, eq(fardos.id, stockMovements.fardoId));

    const rows = fardoId
      ? await baseQuery
          .where(eq(stockMovements.fardoId, fardoId))
          .orderBy(desc(stockMovements.createdAt))
          .limit(limit)
      : await baseQuery.orderBy(desc(stockMovements.createdAt)).limit(limit);

    return rows.map((r) => ({
      id: r.id,
      fardoId: r.fardoId,
      fardoTitle: r.fardoTitle ?? r.fardoId,
      orderId: r.orderId,
      type: r.type,
      quantityDelta: r.quantityDelta,
      stockBefore: r.stockBefore,
      stockAfter: r.stockAfter,
      note: r.note,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  // ---- DROPS ----
  async listDrops(onlyPublic = false): Promise<DropItem[]> {
    const db = getDb();
    const dropRows = onlyPublic
      ? await db
          .select()
          .from(drops)
          .where(inArray(drops.status, ['live', 'scheduled']))
          .orderBy(desc(drops.isFeatured), desc(drops.createdAt))
      : await db.select().from(drops).orderBy(desc(drops.createdAt));

    const [fardoCounts, subCounts] = await Promise.all([
      db
        .select({
          dropId: fardos.dropId,
          count: sql<number>`count(*)::int`,
        })
        .from(fardos)
        .groupBy(fardos.dropId),
      db
        .select({
          dropId: dropSubscribers.dropId,
          count: sql<number>`count(*)::int`,
        })
        .from(dropSubscribers)
        .groupBy(dropSubscribers.dropId),
    ]);

    const fardoCountMap = new Map(fardoCounts.map((c) => [c.dropId, c.count]));
    const subCountMap = new Map(subCounts.map((c) => [c.dropId, c.count]));

    return dropRows.map((d) => ({
      id: d.id,
      slug: d.slug,
      title: d.title,
      description: d.description,
      status: d.status,
      startsAt: d.startsAt ? d.startsAt.toISOString() : null,
      endsAt: d.endsAt ? d.endsAt.toISOString() : null,
      isFeatured: d.isFeatured,
      fardoCount: fardoCountMap.get(d.id) ?? 0,
      subscriberCount: subCountMap.get(d.id) ?? 0,
      createdAt: d.createdAt.toISOString(),
    }));
  }

  async createDrop(dto: CreateDropDto): Promise<DropItem> {
    if (!dto.title?.trim()) throw new Error('El título del drop es requerido.');
    const db = getDb();
    const slug = dto.slug?.trim() ? slugify(dto.slug) : `${slugify(dto.title)}-${Date.now().toString(36)}`;

    const [created] = await db
      .insert(drops)
      .values({
        slug,
        title: dto.title.trim(),
        description: dto.description?.trim() || '',
        status: dto.status ?? 'draft',
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        isFeatured: Boolean(dto.isFeatured),
      })
      .returning();

    return {
      id: created.id,
      slug: created.slug,
      title: created.title,
      description: created.description,
      status: created.status,
      startsAt: created.startsAt ? created.startsAt.toISOString() : null,
      endsAt: created.endsAt ? created.endsAt.toISOString() : null,
      isFeatured: created.isFeatured,
      fardoCount: 0,
      subscriberCount: 0,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async updateDrop(id: string, dto: UpdateDropDto): Promise<DropItem> {
    const db = getDb();
    const patch: Partial<typeof drops.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (dto.title !== undefined) patch.title = dto.title.trim();
    if (dto.description !== undefined) patch.description = dto.description.trim();
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.startsAt !== undefined) patch.startsAt = dto.startsAt ? new Date(dto.startsAt) : null;
    if (dto.endsAt !== undefined) patch.endsAt = dto.endsAt ? new Date(dto.endsAt) : null;
    if (dto.isFeatured !== undefined) patch.isFeatured = dto.isFeatured;

    const [updated] = await db.update(drops).set(patch).where(eq(drops.id, id)).returning();
    if (!updated) throw new Error('Drop no encontrado.');

    return {
      id: updated.id,
      slug: updated.slug,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      startsAt: updated.startsAt ? updated.startsAt.toISOString() : null,
      endsAt: updated.endsAt ? updated.endsAt.toISOString() : null,
      isFeatured: updated.isFeatured,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async deleteDrop(id: string): Promise<void> {
    const db = getDb();
    await db.delete(drops).where(eq(drops.id, id));
  }

  async subscribeToDrop(phone: string, dropId?: string | null): Promise<{ id: string }> {
    const cleanPhone = phone.trim();
    if (!cleanPhone) throw new Error('Número de WhatsApp requerido.');
    const db = getDb();
    const [created] = await db
      .insert(dropSubscribers)
      .values({
        phone: cleanPhone,
        dropId: dropId || null,
      })
      .returning({ id: dropSubscribers.id });
    return created;
  }

  // ---- ORDERS LIFECYCLE ----
  async listOrders(limit = 50): Promise<AdminOrderRecord[]> {
    const db = getDb();
    const orderRows = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);

    if (orderRows.length === 0) return [];

    const orderIds = orderRows.map((o) => o.id);
    const itemRows = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));

    const itemsByOrder = new Map<string, AdminOrderRecord['items']>();
    for (const item of itemRows) {
      const list = itemsByOrder.get(item.orderId) ?? [];
      list.push({
        id: item.id,
        fardoId: item.fardoId,
        fardoTitleSnapshot: item.fardoTitleSnapshot,
        quantity: item.quantity,
        unitPriceArs: item.unitPriceArs,
        subtotalArs: item.subtotalArs,
      });
      itemsByOrder.set(item.orderId, list);
    }

    return orderRows.map((o) => ({
      id: o.id,
      orderCode: o.orderCode,
      userId: o.userId,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      shippingCity: o.shippingCity,
      status: o.status,
      totalArs: o.totalArs,
      totalWeightKg: o.totalWeightKg,
      totalEstimatedUnitsMin: o.totalEstimatedUnitsMin,
      totalEstimatedUnitsMax: o.totalEstimatedUnitsMax,
      createdAt: o.createdAt.toISOString(),
      items: itemsByOrder.get(o.id) ?? [],
    }));
  }

  async updateOrderStatus(orderId: string, nextStatus: OrderStatus): Promise<{ id: string; status: OrderStatus }> {
    const db = getDb();

    return db.transaction(async (tx) => {
      const [order] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .for('update')
        .limit(1);

      if (!order) throw new Error('Pedido no encontrado.');
      if (order.status === nextStatus) {
        return { id: order.id, status: order.status };
      }
      if (order.status === 'cancelled') {
        throw new Error('No se puede reactivar un pedido ya cancelado.');
      }

      const items = await tx
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      for (const item of items) {
        const [fardo] = await tx
          .select()
          .from(fardos)
          .where(eq(fardos.id, item.fardoId))
          .for('update')
          .limit(1);

        if (!fardo) continue;

        if (order.status === 'pending_confirmation' && (nextStatus === 'confirmed' || nextStatus === 'shipped')) {
          const nextReserved = Math.max(0, fardo.reservedStock - item.quantity);
          await tx
            .update(fardos)
            .set({ reservedStock: nextReserved, updatedAt: new Date() })
            .where(eq(fardos.id, fardo.id));

          await tx.insert(stockMovements).values({
            fardoId: fardo.id,
            orderId: order.id,
            type: 'sale',
            quantityDelta: 0,
            stockBefore: fardo.availableStock,
            stockAfter: fardo.availableStock,
            note: `Venta confirmada (${item.quantity} u.) — Pedido ${order.orderCode}`,
          });
        } else if (nextStatus === 'cancelled') {
          const stockBefore = fardo.availableStock;
          const stockAfter = stockBefore + item.quantity;
          const nextReserved =
            order.status === 'pending_confirmation'
              ? Math.max(0, fardo.reservedStock - item.quantity)
              : fardo.reservedStock;

          await tx
            .update(fardos)
            .set({
              availableStock: stockAfter,
              reservedStock: nextReserved,
              updatedAt: new Date(),
            })
            .where(eq(fardos.id, fardo.id));

          await tx.insert(stockMovements).values({
            fardoId: fardo.id,
            orderId: order.id,
            type: 'release',
            quantityDelta: item.quantity,
            stockBefore,
            stockAfter,
            note: `Stock liberado por cancelación de pedido ${order.orderCode}`,
          });
        }
      }

      const [updated] = await tx
        .update(orders)
        .set({ status: nextStatus, updatedAt: new Date() })
        .where(eq(orders.id, order.id))
        .returning({ id: orders.id, status: orders.status });

      return updated;
    });
  }
}

export const adminRepository = new AdminRepository();
