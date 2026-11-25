import { clientEnv } from '@/lib/env';
import {
  FardoProduct,
  CategoryItem,
  FardoQueryParams,
  OrderQuoteResponse,
  CreateOrderDto,
  DropItem,
} from '@/types';

class ApiClient {
  private baseUrl = clientEnv.apiUrl.replace(/\/$/, '');

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `HTTP error ${res.status}`);
    }
    return json.data;
  }

  async getFardos(params?: FardoQueryParams): Promise<FardoProduct[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('categoria', params.category);
    if (params?.quality && params.quality !== 'all') query.set('calidad', params.quality);
    if (params?.dropId) query.set('dropId', params.dropId);
    if (params?.search) query.set('q', params.search);
    if (params?.sortBy) query.set('orden', params.sortBy);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const qs = query.toString();
    return this.request<FardoProduct[]>(`/api/fardos${qs ? `?${qs}` : ''}`);
  }

  async getFardoById(id: string): Promise<FardoProduct> {
    return this.request<FardoProduct>(`/api/fardos/${id}`);
  }

  async getCategories(): Promise<CategoryItem[]> {
    return this.request<CategoryItem[]>('/api/categories');
  }

  async getActiveDrops(): Promise<DropItem[]> {
    return this.request<DropItem[]>('/api/drops');
  }

  async subscribeToDrop(phone: string, dropId?: string | null): Promise<{ id: string }> {
    return this.request<{ id: string }>('/api/drops', {
      method: 'POST',
      body: JSON.stringify({ phone, dropId }),
    });
  }

  async createOrderQuote(dto: CreateOrderDto): Promise<OrderQuoteResponse> {
    return this.request<OrderQuoteResponse>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }
}

export const api = new ApiClient();
