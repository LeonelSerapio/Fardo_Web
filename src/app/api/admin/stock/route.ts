import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { adminRepository } from '@/lib/repositories/admin-repository';
import { isDatabaseConfigured } from '@/lib/env';
import { AdjustStockDto } from '@/types';

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'DATABASE_URL no está configurada en .env.local.' },
      { status: 503 }
    );
  }

  try {
    const fardoId = request.nextUrl.searchParams.get('fardoId') || undefined;
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, 200) : 50;

    const movements = await adminRepository.listStockMovements(fardoId, limit);
    return NextResponse.json({ success: true, data: movements });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al consultar movimientos de stock.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'DATABASE_URL no está configurada en .env.local.' },
      { status: 503 }
    );
  }

  try {
    const body: AdjustStockDto = await request.json();
    const movement = await adminRepository.adjustStock(body);
    return NextResponse.json({ success: true, data: movement }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al ajustar stock.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
