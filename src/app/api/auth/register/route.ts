import { NextRequest, NextResponse } from 'next/server';
import { createSession, registerUser, setSessionCookie } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/env';
import { RegisterDto } from '@/types';

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Base de datos no configurada.' },
      { status: 503 }
    );
  }

  try {
    const body: RegisterDto = await request.json();
    const user = await registerUser(body);
    const { token, expiresAt } = await createSession(user.id);

    const response = NextResponse.json({ success: true, data: { user } }, { status: 201 });
    setSessionCookie(response, token, expiresAt);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear la cuenta.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
