import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { adminRepository } from '@/lib/repositories/admin-repository';
import { isDatabaseConfigured } from '@/lib/env';
import { UpdateFardoDto } from '@/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
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
    const { id } = await context.params;
    const body: UpdateFardoDto = await request.json();
    const updated = await adminRepository.updateFardo(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el fardo.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
