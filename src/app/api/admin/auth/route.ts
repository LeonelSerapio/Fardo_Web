import { NextRequest, NextResponse, connection } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  isAdminRequest,
  verifyAdminSecret,
} from '@/lib/admin-auth';
import { getServerEnv, isDatabaseConfigured } from '@/lib/env';

export async function GET(request: NextRequest) {
  await connection();
  return NextResponse.json({
    success: true,
    data: {
      authenticated: await isAdminRequest(request),
      databaseConfigured: isDatabaseConfigured(),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret = typeof body?.secret === 'string' ? body.secret : '';

    if (!verifyAdminSecret(secret)) {
      return NextResponse.json(
        { success: false, error: 'Clave de administrador inválida.' },
        { status: 401 }
      );
    }

    const { adminSecret } = getServerEnv();
    const token = createSessionToken(adminSecret);

    const response = NextResponse.json({
      success: true,
      data: { authenticated: true, databaseConfigured: isDatabaseConfigured() },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Solicitud inválida.' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, data: { authenticated: false } });
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
