import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { getServerEnv } from '@/lib/env';
import { getUserFromRequest } from '@/lib/auth';

export const ADMIN_COOKIE_NAME = 'fardo_admin_session';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createSessionToken(secret: string): string {
  return crypto.createHmac('sha256', secret).update('fardo-club-admin-v1').digest('hex');
}

export function verifyAdminSecret(candidate: string): boolean {
  const { adminSecret } = getServerEnv();
  if (!adminSecret || !candidate) return false;
  return safeEqual(candidate.trim(), adminSecret);
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const { adminSecret } = getServerEnv();
  if (!adminSecret) return false;

  const headerSecret = request.headers.get('x-admin-secret');
  if (headerSecret && safeEqual(headerSecret.trim(), adminSecret)) {
    return true;
  }

  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookieToken) {
    const expected = createSessionToken(adminSecret);
    return safeEqual(cookieToken, expected);
  }

  return false;
}

/**
 * Unified admin check: allows either a logged-in user with role='admin'
 * OR the fallback ADMIN_SECRET header/cookie.
 */
export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  if (isAdminAuthenticated(request)) return true;
  const user = await getUserFromRequest(request);
  return user?.role === 'admin';
}
