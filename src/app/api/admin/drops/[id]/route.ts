import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { adminRepository } from '@/lib/repositories/admin-repository';
import { isDatabaseConfigured } from '@/lib/env';
import { UpdateDropDto } from '@/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

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
    const body: UpdateDropDto = await request.json();
    const updated = await adminRepository.updateDrop(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el drop.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
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
    await adminRepository.deleteDrop(id);
    return NextResponse.json({ success: true, data: { id } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el drop.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
