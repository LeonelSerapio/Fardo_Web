import { MOCK_FARDOS, CATEGORIES } from '@/data/mock-data';
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

export class InMemoryFardoRepository implements IFardoRepository {
  private products: FardoProduct[] = [...MOCK_FARDOS];
  private categories: CategoryItem[] = [...CATEGORIES];

  async findMany(params: FardoQueryParams = {}): Promise<{ items: FardoProduct[]; total: number }> {
    let result = [...this.products];

    // Filter by Category
    if (params.category && params.category !== 'all') {
      result = result.filter((p) => p.category === params.category);
    }

    // Filter by Quality
    if (params.quality && params.quality !== 'all') {
      result = result.filter((p) => p.quality === params.quality);
    }

    // Full-text search
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter((p) => {
        const inTitle = p.title.toLowerCase().includes(q);
        const inHighlights = p.highlights.some((h) => h.toLowerCase().includes(q));
        const inCategory = p.category.toLowerCase().includes(q);
        return inTitle || inHighlights || inCategory;
      });
    }

    // Sort
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

    const items = result.slice(offset, offset + limit);
    return { items, total };
  }

  async findById(id: string): Promise<FardoProduct | null> {
    const product = this.products.find((p) => p.id === id);
    return product || null;
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

      quoteItems.push({
        product,
        quantity: item.quantity,
        subtotalArs,
      });
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

// Singleton repository instance for API routes
export const fardoRepository = new InMemoryFardoRepository();
