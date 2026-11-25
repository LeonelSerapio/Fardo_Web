import { NextResponse, connection } from 'next/server';
import { sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { isDatabaseConfigured } from '@/lib/env';

export async function GET() {
  await connection();
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { status: 'degraded', database: 'not_configured' },
      { status: 200 }
    );
  }

  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database connection error';
    return NextResponse.json(
      { status: 'error', database: 'disconnected', error: message },
      { status: 503 }
    );
  }
}
