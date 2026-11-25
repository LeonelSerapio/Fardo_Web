import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { adminRepository } from '@/lib/repositories/admin-repository';
import { isDatabaseConfigured } from '@/lib/env';
import { CreateDropDto } from '@/types';

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
    const data = await adminRepository.listDrops(false);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al listar drops.';
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
    const body: CreateDropDto = await request.json();
    const created = await adminRepository.createDrop(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear el drop.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
