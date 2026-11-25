import {
  pgTable,
  pgEnum,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const qualityTierEnum = pgEnum('quality_tier', ['premium', 'primera', 'original']);

export const dropStatusEnum = pgEnum('drop_status', ['draft', 'scheduled', 'live', 'ended']);

export const stockMovementTypeEnum = pgEnum('stock_movement_type', [
  'restock',
  'reserve',
  'release',
  'sale',
  'adjustment',
]);

export const orderStatusEnum = pgEnum('order_status', [
  'pending_confirmation',
  'confirmed',
  'shipped',
  'cancelled',
]);

export const userRoleEnum = pgEnum('user_role', ['customer', 'admin']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 180 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull().default('customer'),
    fullName: varchar('full_name', { length: 160 }).notNull(),
    businessName: varchar('business_name', { length: 160 }),
    phone: varchar('phone', { length: 64 }),
    shippingCity: varchar('shipping_city', { length: 160 }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('users_email_idx').on(table.email)]
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('sessions_user_idx').on(table.userId),
    index('sessions_expires_idx').on(table.expiresAt),
  ]
);

export const categories = pgTable('categories', {
  id: varchar('id', { length: 64 }).primaryKey(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  description: text('description').notNull(),
  iconName: varchar('icon_name', { length: 64 }).notNull().default('Package'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const drops = pgTable(
  'drops',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    title: varchar('title', { length: 160 }).notNull(),
    description: text('description').notNull().default(''),
    status: dropStatusEnum('status').notNull().default('draft'),
    startsAt: timestamp('starts_at', { withTimezone: true }),
    endsAt: timestamp('ends_at', { withTimezone: true }),
    isFeatured: boolean('is_featured').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('drops_status_idx').on(table.status)]
);

export const fardos = pgTable(
  'fardos',
  {
    id: varchar('id', { length: 120 }).primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    categoryId: varchar('category_id', { length: 64 })
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    dropId: uuid('drop_id').references(() => drops.id, { onDelete: 'set null' }),
    quality: qualityTierEnum('quality').notNull(),
    weightKg: integer('weight_kg').notNull(),
    estimatedUnitsMin: integer('estimated_units_min').notNull(),
    estimatedUnitsMax: integer('estimated_units_max').notNull(),
    priceArs: integer('price_ars').notNull(),
    availableStock: integer('available_stock').notNull().default(0),
    reservedStock: integer('reserved_stock').notNull().default(0),
    isPopular: boolean('is_popular').notNull().default(false),
    isNewDrop: boolean('is_new_drop').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    image: text('image').notNull(),
    highlights: jsonb('highlights').$type<string[]>().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('fardos_category_idx').on(table.categoryId),
    index('fardos_drop_idx').on(table.dropId),
    index('fardos_quality_idx').on(table.quality),
    check('fardos_available_stock_non_negative', sql`${table.availableStock} >= 0`),
    check('fardos_reserved_stock_non_negative', sql`${table.reservedStock} >= 0`),
    check('fardos_price_non_negative', sql`${table.priceArs} >= 0`),
    check('fardos_weight_positive', sql`${table.weightKg} > 0`),
  ]
);

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderCode: varchar('order_code', { length: 48 }).notNull().unique(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    customerName: varchar('customer_name', { length: 160 }),
    customerPhone: varchar('customer_phone', { length: 64 }),
    shippingCity: varchar('shipping_city', { length: 160 }),
    status: orderStatusEnum('status').notNull().default('pending_confirmation'),
    totalArs: integer('total_ars').notNull(),
    totalWeightKg: integer('total_weight_kg').notNull(),
    totalEstimatedUnitsMin: integer('total_estimated_units_min').notNull(),
    totalEstimatedUnitsMax: integer('total_estimated_units_max').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('orders_status_idx').on(table.status),
    index('orders_user_id_idx').on(table.userId),
  ]
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    fardoId: varchar('fardo_id', { length: 120 })
      .notNull()
      .references(() => fardos.id, { onDelete: 'restrict' }),
    fardoTitleSnapshot: varchar('fardo_title_snapshot', { length: 200 }).notNull(),
    quantity: integer('quantity').notNull(),
    unitPriceArs: integer('unit_price_ars').notNull(),
    subtotalArs: integer('subtotal_ars').notNull(),
  },
  (table) => [
    index('order_items_order_idx').on(table.orderId),
    check('order_items_quantity_positive', sql`${table.quantity} > 0`),
  ]
);

export const stockMovements = pgTable(
  'stock_movements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    fardoId: varchar('fardo_id', { length: 120 })
      .notNull()
      .references(() => fardos.id, { onDelete: 'cascade' }),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
    type: stockMovementTypeEnum('type').notNull(),
    quantityDelta: integer('quantity_delta').notNull(),
    stockBefore: integer('stock_before').notNull(),
    stockAfter: integer('stock_after').notNull(),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('stock_movements_fardo_idx').on(table.fardoId),
    index('stock_movements_created_idx').on(table.createdAt),
  ]
);

export const dropSubscribers = pgTable(
  'drop_subscribers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    phone: varchar('phone', { length: 64 }).notNull(),
    dropId: uuid('drop_id').references(() => drops.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('drop_subscribers_phone_idx').on(table.phone)]
);

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  fardos: many(fardos),
}));

export const dropsRelations = relations(drops, ({ many }) => ({
  fardos: many(fardos),
  subscribers: many(dropSubscribers),
}));

export const fardosRelations = relations(fardos, ({ one, many }) => ({
  category: one(categories, {
    fields: [fardos.categoryId],
    references: [categories.id],
  }),
  drop: one(drops, {
    fields: [fardos.dropId],
    references: [drops.id],
  }),
  orderItems: many(orderItems),
  stockMovements: many(stockMovements),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  orders: many(orders),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  stockMovements: many(stockMovements),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  fardo: one(fardos, {
    fields: [orderItems.fardoId],
    references: [fardos.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  fardo: one(fardos, {
    fields: [stockMovements.fardoId],
    references: [fardos.id],
  }),
  order: one(orders, {
    fields: [stockMovements.orderId],
    references: [orders.id],
  }),
}));
