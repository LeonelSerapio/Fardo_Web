import crypto from 'crypto';
import { promisify } from 'util';
import { and, desc, eq, gt, inArray } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orderItems, orders, sessions, users } from '@/db/schema';
import { isDatabaseConfigured } from '@/lib/env';
import {
  AdminOrderRecord,
  AuthUser,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
} from '@/types';

const scryptAsync = promisify(crypto.scrypt);

export const SESSION_COOKIE_NAME = 'fardo_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapUser(row: typeof users.$inferSelect): AuthUser {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    fullName: row.fullName,
    businessName: row.businessName,
    phone: row.phone,
    shippingCity: row.shippingCity,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, keyHex] = parts;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuf = Buffer.from(keyHex, 'hex');
  if (derived.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derived, storedBuf);
}

export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const db = getDb();
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function deleteSessionByToken(token: string): Promise<void> {
  if (!token || !isDatabaseConfigured()) return;
  const db = getDb();
  const tokenHash = hashSessionToken(token);
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export function setSessionCookie(response: NextResponse, token: string, expiresAt: Date): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  if (!isDatabaseConfigured()) return null;
  const rawToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const db = getDb();
  const tokenHash = hashSessionToken(rawToken);

  const [row] = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, new Date()),
        eq(users.isActive, true)
      )
    )
    .limit(1);

  return row ? mapUser(row.user) : null;
}

export async function registerUser(dto: RegisterDto): Promise<AuthUser> {
  const email = dto.email?.trim().toLowerCase() || '';
  const password = dto.password || '';
  const fullName = dto.fullName?.trim() || '';

  if (!EMAIL_REGEX.test(email)) {
    throw new Error('Ingresá un email válido.');
  }
  if (password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres.');
  }
  if (fullName.length < 2) {
    throw new Error('Ingresá tu nombre completo.');
  }

  const db = getDb();
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    throw new Error('Ya existe una cuenta registrada con ese email.');
  }

  const passwordHash = await hashPassword(password);
  const [created] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      role: 'customer',
      fullName,
      businessName: dto.businessName?.trim() || null,
      phone: dto.phone?.trim() || null,
      shippingCity: dto.shippingCity?.trim() || null,
    })
    .returning();

  return mapUser(created);
}

export async function authenticateUser(dto: LoginDto): Promise<AuthUser> {
  const email = dto.email?.trim().toLowerCase() || '';
  const password = dto.password || '';

  if (!email || !password) {
    throw new Error('Email y contraseña requeridos.');
  }

  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!row || !row.isActive) {
    throw new Error('Credenciales inválidas.');
  }

  const valid = await verifyPassword(password, row.passwordHash);
  if (!valid) {
    throw new Error('Credenciales inválidas.');
  }

  return mapUser(row);
}

export async function updateUserProfile(userId: string, dto: UpdateProfileDto): Promise<AuthUser> {
  const db = getDb();
  const patch: Partial<typeof users.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (dto.fullName !== undefined) {
    const trimmed = dto.fullName.trim();
    if (trimmed.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.');
    patch.fullName = trimmed;
  }
  if (dto.businessName !== undefined) patch.businessName = dto.businessName?.trim() || null;
  if (dto.phone !== undefined) patch.phone = dto.phone?.trim() || null;
  if (dto.shippingCity !== undefined) patch.shippingCity = dto.shippingCity?.trim() || null;

  const [updated] = await db.update(users).set(patch).where(eq(users.id, userId)).returning();
  if (!updated) throw new Error('Usuario no encontrado.');
  return mapUser(updated);
}

export async function listUserOrders(userId: string): Promise<AdminOrderRecord[]> {
  const db = getDb();
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(50);

  if (orderRows.length === 0) return [];

  const orderIds = orderRows.map((o) => o.id);
  const itemRows = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  const itemsByOrder = new Map<string, AdminOrderRecord['items']>();
  for (const item of itemRows) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push({
      id: item.id,
      fardoId: item.fardoId,
      fardoTitleSnapshot: item.fardoTitleSnapshot,
      quantity: item.quantity,
      unitPriceArs: item.unitPriceArs,
      subtotalArs: item.subtotalArs,
    });
    itemsByOrder.set(item.orderId, list);
  }

  return orderRows.map((o) => ({
    id: o.id,
    orderCode: o.orderCode,
    userId: o.userId,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    shippingCity: o.shippingCity,
    status: o.status,
    totalArs: o.totalArs,
    totalWeightKg: o.totalWeightKg,
    totalEstimatedUnitsMin: o.totalEstimatedUnitsMin,
    totalEstimatedUnitsMax: o.totalEstimatedUnitsMax,
    createdAt: o.createdAt.toISOString(),
    items: itemsByOrder.get(o.id) ?? [],
  }));
}
