export type QualityTierId = 'premium' | 'primera' | 'original';

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
  isPopular?: boolean;
  isNewDrop?: boolean;
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
  status: 'pending_confirmation';
  createdAt: string;
}
