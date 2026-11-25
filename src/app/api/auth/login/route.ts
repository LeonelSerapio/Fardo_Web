import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession, setSessionCookie } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/env';
import { LoginDto } from '@/types';

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Base de datos no configurada.' },
      { status: 503 }
    );
  }

  try {
    const body: LoginDto = await request.json();
    const user = await authenticateUser(body);
    const { token, expiresAt } = await createSession(user.id);

    const response = NextResponse.json({ success: true, data: { user } });
    setSessionCookie(response, token, expiresAt);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al iniciar sesión.';
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
