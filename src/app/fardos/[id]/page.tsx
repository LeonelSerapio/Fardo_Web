import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { fardoRepository } from '@/lib/repositories/fardo-repository';
import { FardoDetailClient } from '@/components/fardo-detail/FardoDetailClient';
import { formatArs } from '@/lib/formatters';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connection();
  const { id } = await params;
  const fardo = await fardoRepository.findById(id);

  if (!fardo) {
    return {
      title: 'Fardo No Encontrado | Fardo Club Argentina',
      description: 'El lote mayorista solicitado no está disponible en depósito.',
    };
  }

  return {
    title: `${fardo.title} (${fardo.weightKg}kg) | Fardo Club Mayorista`,
    description: `Lote mayorista en Argentina de ${fardo.weightKg} kg con ~${fardo.estimatedUnitsMin}-${fardo.estimatedUnitsMax} prendas. Precio: ${formatArs(fardo.priceArs)} ARS. Despacho directo a todo el país.`,
  };
}

async function FardoDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await paramsPromise;
  const fardo = await fardoRepository.findById(id);

  if (!fardo) {
    notFound();
  }

  // Fetch up to 3 related fardos in the same category (excluding current)
  const { items: categoryFardos } = await fardoRepository.findMany({
    category: fardo.category,
    limit: 4,
  });

  const relatedFardos = categoryFardos.filter((item) => item.id !== fardo.id).slice(0, 3);

  return <FardoDetailClient fardo={fardo} relatedFardos={relatedFardos} />;
}

function FardoDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f5ec] py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-5 bg-[#e7e0d2] rounded w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 aspect-[4/3] bg-[#e7e0d2] rounded-2xl" />
          <div className="lg:col-span-5 h-[420px] bg-[#e7e0d2] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function FardoDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<FardoDetailSkeleton />}>
      <FardoDetailContent paramsPromise={params} />
    </Suspense>
  );
}
