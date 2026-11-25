/**
 * Typed environment variable helpers separating server-only (backend)
 * and public (frontend NEXT_PUBLIC_*) configuration.
 */

export const clientEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491100000000',
} as const;

export function getServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() must only be called on the server.');
  }

  return {
    databaseUrl: process.env.DATABASE_URL?.trim() || '',
    adminSecret: process.env.ADMIN_SECRET?.trim() || 'fardo-admin-dev-secret',
  } as const;
}

export function isDatabaseConfigured(): boolean {
  if (typeof window !== 'undefined') return false;
  return Boolean(process.env.DATABASE_URL?.trim());
}
