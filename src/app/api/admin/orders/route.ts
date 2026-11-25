import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { adminRepository } from '@/lib/repositories/admin-repository';
import { isDatabaseConfigured } from '@/lib/env';

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
    const data = await adminRepository.listOrders();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al listar pedidos.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
