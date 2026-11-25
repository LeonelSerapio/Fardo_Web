import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { eq } from 'drizzle-orm';
import { getDb } from './index';
import { categories, drops, fardos, stockMovements } from './schema';
import { CATEGORIES, MOCK_FARDOS } from '../data/mock-data';

async function seed() {
  const db = getDb();
  console.log('Seeding Neon PostgreSQL database...');

  // 1. Seed Categories (idempotent)
  for (const cat of CATEGORIES) {
    await db
      .insert(categories)
      .values({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        iconName: cat.iconName,
      })
      .onConflictDoNothing({ target: categories.id });
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`);

  // 2. Seed initial Drop (idempotent)
  const defaultDropSlug = 'drop-semanal-inaugural';
  let [initialDrop] = await db
    .select()
    .from(drops)
    .where(eq(drops.slug, defaultDropSlug))
    .limit(1);

  if (!initialDrop) {
    const now = new Date();
    const endsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    [initialDrop] = await db
      .insert(drops)
      .values({
        slug: defaultDropSlug,
        title: 'Drop Semanal — Streetwear & Temporada',
        description:
          'Ingreso semanal de fardos curados directamente de importación. Stock real actualizado en vivo.',
        status: 'live',
        startsAt: now,
        endsAt,
        isFeatured: true,
      })
      .returning();
    console.log(`Created initial live drop: ${initialDrop.title}`);
  } else {
    console.log(`Initial drop already exists: ${initialDrop.title}`);
  }

  // 3. Seed Fardos + Initial Stock Movements (idempotent)
  let insertedFardos = 0;
  for (const product of MOCK_FARDOS) {
    const [existing] = await db
      .select({ id: fardos.id })
      .from(fardos)
      .where(eq(fardos.id, product.id))
      .limit(1);

    if (!existing) {
      await db.transaction(async (tx) => {
        await tx.insert(fardos).values({
          id: product.id,
          title: product.title,
          categoryId: product.category,
          dropId: product.isNewDrop ? initialDrop.id : null,
          quality: product.quality,
          weightKg: product.weightKg,
          estimatedUnitsMin: product.estimatedUnitsMin,
          estimatedUnitsMax: product.estimatedUnitsMax,
          priceArs: product.priceArs,
          availableStock: product.availableStock,
          reservedStock: 0,
          isPopular: Boolean(product.isPopular),
          isNewDrop: Boolean(product.isNewDrop),
          isActive: true,
          image: product.image,
          highlights: product.highlights,
        });

        await tx.insert(stockMovements).values({
          fardoId: product.id,
          type: 'restock',
          quantityDelta: product.availableStock,
          stockBefore: 0,
          stockAfter: product.availableStock,
          note: 'Initial inventory seed',
        });
      });
      insertedFardos++;
    }
  }

  console.log(`Seeded ${insertedFardos} new fardos (skipped ${MOCK_FARDOS.length - insertedFardos} existing).`);
  console.log('Seed completed successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
