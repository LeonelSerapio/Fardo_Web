import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, deleteSessionByToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await deleteSessionByToken(token).catch(() => {});
  }
  const response = NextResponse.json({ success: true, data: { loggedOut: true } });
  clearSessionCookie(response);
  return response;
}
