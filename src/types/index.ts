export type QualityTierId = 'premium' | 'primera' | 'original';

export type DropStatus = 'draft' | 'scheduled' | 'live' | 'ended';

export type StockMovementType = 'restock' | 'reserve' | 'release' | 'sale' | 'adjustment';

export type OrderStatus = 'pending_confirmation' | 'confirmed' | 'shipped' | 'cancelled';

export interface QualityTier {
  id: QualityTierId;
  name: string;
  tagline: string;
  description: string;
  condition: string;
  marginPotential: string;
  idealFor: string;
}

export interface FardoProduct {
  id: string;
  title: string;
  category: 'mujer' | 'hombre' | 'ninos' | 'temporada' | 'vintage';
  quality: QualityTierId;
  weightKg: number;
  estimatedUnitsMin: number;
  estimatedUnitsMax: number;
  priceArs: number;
  availableStock: number;
  reservedStock?: number;
  dropId?: string | null;
  isPopular?: boolean;
  isNewDrop?: boolean;
  isActive?: boolean;
  image: string;
  highlights: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
  iconName: string;
}

export interface DropItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: DropStatus;
  startsAt: string | null;
  endsAt: string | null;
  isFeatured: boolean;
  fardoCount?: number;
  subscriberCount?: number;
  createdAt: string;
}

export interface CreateDropDto {
  slug?: string;
  title: string;
  description?: string;
  status?: DropStatus;
  startsAt?: string | null;
  endsAt?: string | null;
  isFeatured?: boolean;
}

export interface UpdateDropDto {
  title?: string;
  description?: string;
  status?: DropStatus;
  startsAt?: string | null;
  endsAt?: string | null;
  isFeatured?: boolean;
}

export interface StockMovementItem {
  id: string;
  fardoId: string;
  fardoTitle?: string;
  orderId: string | null;
  type: StockMovementType;
  quantityDelta: number;
  stockBefore: number;
  stockAfter: number;
  note: string | null;
  createdAt: string;
}

export interface AdjustStockDto {
  fardoId: string;
  type: 'restock' | 'adjustment' | 'sale' | 'release';
  quantityDelta: number;
  note?: string;
}

export interface CreateFardoDto {
  id?: string;
  title: string;
  category: FardoProduct['category'];
  dropId?: string | null;
  quality: QualityTierId;
  weightKg: number;
  estimatedUnitsMin: number;
  estimatedUnitsMax: number;
  priceArs: number;
  availableStock: number;
  isPopular?: boolean;
  isNewDrop?: boolean;
  isActive?: boolean;
  image: string;
  highlights: string[];
}

export interface UpdateFardoDto {
  title?: string;
  category?: FardoProduct['category'];
  dropId?: string | null;
  quality?: QualityTierId;
  weightKg?: number;
  estimatedUnitsMin?: number;
  estimatedUnitsMax?: number;
  priceArs?: number;
  isPopular?: boolean;
  isNewDrop?: boolean;
  isActive?: boolean;
  image?: string;
  highlights?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  business: string;
  city: string;
  quote: string;
  metric: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FardoQueryParams {
  category?: string;
  quality?: string;
  dropId?: string;
  search?: string;
  sortBy?: 'popular' | 'price-asc' | 'price-desc' | 'weight';
  limit?: number;
  offset?: number;
}

export interface OrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  customerName?: string;
  customerPhone?: string;
  shippingCity?: string;
}

export interface OrderQuoteResponse {
  orderId: string;
  items: Array<{
    product: FardoProduct;
    quantity: number;
    subtotalArs: number;
  }>;
  totalArs: number;
  totalWeightKg: number;
  totalEstimatedUnitsMin: number;
  totalEstimatedUnitsMax: number;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminOrderRecord {
  id: string;
  orderCode: string;
  userId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  shippingCity: string | null;
  status: OrderStatus;
  totalArs: number;
  totalWeightKg: number;
  totalEstimatedUnitsMin: number;
  totalEstimatedUnitsMax: number;
  createdAt: string;
  items: Array<{
    id: string;
    fardoId: string;
    fardoTitleSnapshot: string;
    quantity: number;
    unitPriceArs: number;
    subtotalArs: number;
  }>;
}
