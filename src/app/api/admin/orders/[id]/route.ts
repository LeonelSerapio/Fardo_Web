import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { adminRepository } from '@/lib/repositories/admin-repository';
import { isDatabaseConfigured } from '@/lib/env';
import { OrderStatus } from '@/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: OrderStatus[] = ['pending_confirmation', 'confirmed', 'shipped', 'cancelled'];

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'DATABASE_URL no está configurada en .env.local.' },
      { status: 503 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const status = body?.status as OrderStatus;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: 'Estado de pedido inválido.' }, { status: 400 });
    }

    const updated = await adminRepository.updateOrderStatus(id, status);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar estado del pedido.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
