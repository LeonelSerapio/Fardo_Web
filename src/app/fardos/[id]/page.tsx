import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fardoRepository } from '@/lib/repositories/fardo-repository';
import { FardoDetailClient } from '@/components/fardo-detail/FardoDetailClient';
import { formatArs } from '@/lib/formatters';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

export async function generateStaticParams() {
  const { items } = await fardoRepository.findMany({ limit: 50 });
  return items.map((fardo) => ({
    id: fardo.id,
  }));
}

export default async function FardoDetailPage({ params }: PageProps) {
  const { id } = await params;
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
