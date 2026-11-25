import { NextRequest, NextResponse, connection } from 'next/server';
import { adminRepository } from '@/lib/repositories/admin-repository';
import { isDatabaseConfigured } from '@/lib/env';

export async function GET() {
  await connection();
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: { dbConfigured: false },
      });
    }

    const drops = await adminRepository.listDrops(true);
    return NextResponse.json({
      success: true,
      data: drops,
      meta: { total: drops.length, dbConfigured: true },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al consultar los drops activos.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
    const dropId = typeof body?.dropId === 'string' ? body.dropId : null;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Número de WhatsApp requerido.' },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: { id: 'mock-sub', persisted: false },
      });
    }

    const created = await adminRepository.subscribeToDrop(phone, dropId);
    return NextResponse.json({ success: true, data: { ...created, persisted: true } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al registrar suscripción al drop.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
