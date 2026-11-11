import { Suspense } from 'react';
import { Metadata } from 'next';
import { fardoRepository } from '@/lib/repositories/fardo-repository';
import { CatalogPageClient } from '@/components/catalog-page/CatalogPageClient';

export const metadata: Metadata = {
  title: 'Catálogo de Fardos Mayoristas | Fardo Club Argentina',
  description:
    'Explorá nuestro catálogo mayorista de fardos de ropa vintage, circular y de primera selección en Argentina. Precios en ARS, pesaje certificado y envíos a todo el país.',
};

interface FardosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function FardosCatalogContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParamsPromise;

  const categoryParam = typeof resolvedParams.categoria === 'string'
    ? resolvedParams.categoria
    : typeof resolvedParams.category === 'string'
    ? resolvedParams.category
    : 'all';

  const qualityParam = typeof resolvedParams.calidad === 'string'
    ? resolvedParams.calidad
    : typeof resolvedParams.quality === 'string'
    ? resolvedParams.quality
    : 'all';

  const queryParam = typeof resolvedParams.q === 'string'
    ? resolvedParams.q
    : typeof resolvedParams.search === 'string'
    ? resolvedParams.search
    : '';

  const [{ items: initialProducts }, categories] = await Promise.all([
    fardoRepository.findMany({
      category: categoryParam !== 'all' ? categoryParam : undefined,
      quality: qualityParam !== 'all' ? qualityParam : undefined,
      search: queryParam || undefined,
      limit: 30,
    }),
    fardoRepository.findCategories(),
  ]);

  return (
    <CatalogPageClient
      initialProducts={initialProducts}
      categories={categories}
      initialCategory={categoryParam}
      initialQuality={qualityParam}
      initialQuery={queryParam}
    />
  );
}

function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f5ec] py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-6 bg-[#e7e0d2] rounded w-60" />
        <div className="h-12 bg-[#e7e0d2] rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-[#e7e0d2] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FardosPage({ searchParams }: FardosPageProps) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <FardosCatalogContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}
