import { NextRequest, NextResponse, connection } from 'next/server';
import { getUserFromRequest, updateUserProfile } from '@/lib/auth';
import { UpdateProfileDto } from '@/types';

export async function GET(request: NextRequest) {
  await connection();
  try {
    const user = await getUserFromRequest(request);
    return NextResponse.json({ success: true, data: { user } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al consultar sesión.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'No autenticado.' }, { status: 401 });
  }

  try {
    const body: UpdateProfileDto = await request.json();
    const updated = await updateUserProfile(user.id, body);
    return NextResponse.json({ success: true, data: { user: updated } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar perfil.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
