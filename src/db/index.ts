import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';
import { getServerEnv } from '@/lib/env';

// Required for Neon Pool WebSockets in Node.js (enables full ACID transactions & SELECT FOR UPDATE)
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const globalForDb = globalThis as unknown as {
  neonPool?: Pool;
  drizzleDb?: NeonDatabase<typeof schema>;
};

export function getDb(): NeonDatabase<typeof schema> {
  if (globalForDb.drizzleDb) {
    return globalForDb.drizzleDb;
  }

  const { databaseUrl } = getServerEnv();
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not configured. Add your Neon PostgreSQL connection string to .env.local.'
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.neonPool = pool;
    globalForDb.drizzleDb = db;
  }

  return db;
}

export * as schema from './schema';
