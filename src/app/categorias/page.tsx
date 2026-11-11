import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { fardoRepository } from '@/lib/repositories/fardo-repository';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatArs } from '@/lib/formatters';
import {
  Flame,
  CloudSnow,
  Shirt,
  Sparkles,
  Smile,
  ArrowRight,
  ChevronRight,
  ArrowLeft,
  Package,
  Layers,
  Scale,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Categorías Mayoristas de Fardos | Fardo Club Argentina',
  description:
    'Descubrí todos los rubros textiles clasificados: Vintage & 90s Streetwear, Abrigo de Temporada, Denim Hombre, Mujer y Niños. Fardos cerrados con entrega en todo el país.',
};

export default async function CategoriasPage() {
  const [categories, { items: allFardos }] = await Promise.all([
    fardoRepository.findCategories(),
    fardoRepository.findMany({ limit: 50 }),
  ]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-8 h-8 text-[#c40506]" />;
      case 'CloudSnow':
        return <CloudSnow className="w-8 h-8 text-[#2563eb]" />;
      case 'Shirt':
        return <Shirt className="w-8 h-8 text-[#4b5563]" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-[#db2777]" />;
      case 'Smile':
        return <Smile className="w-8 h-8 text-[#059669]" />;
      default:
        return <Flame className="w-8 h-8 text-[#c40506]" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5ec] text-[#19150b]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#686257] mb-6 font-medium">
          <Link href="/" className="hover:text-[#c40506] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[#d1c9ba]" />
          <span className="text-[#19150b] font-bold">Categorías Mayoristas</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#fde8e8] text-[#c40506] text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Clasificación por Especialidad</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#19150b]">
            Directorio de Rubros & Fardos
          </h1>
          <p className="text-base text-[#686257] mt-2 max-w-2xl">
            Cada rubro cuenta con procesos de selección y pesaje independientes. Seleccioná una categoría para explorar los fardos activos con stock en depósito.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-8 mb-16">
          {categories.map((cat) => {
            const fardosInCategory = allFardos.filter((f) => f.category === cat.slug);

            return (
              <div
                key={cat.id}
                className="bg-white border border-[#e7e0d2] rounded-3xl p-6 sm:p-8 shadow-sm hover:border-[#c40506]/40 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#f0ebe0]">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#f8f5ec] border border-[#e7e0d2] flex items-center justify-center shrink-0">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif-heading text-2xl font-bold text-[#19150b]">
                          {cat.name}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f8f5ec] border border-[#e7e0d2] text-[#686257]">
                          {fardosInCategory.length} lotes activos
                        </span>
                      </div>
                      <p className="text-sm text-[#686257] mt-1 max-w-xl">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/fardos?categoria=${cat.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c40506] hover:bg-[#a80405] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm self-start lg:self-auto"
                  >
                    <span>Ver Fardos de {cat.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Preview lot cards inside category */}
                {fardosInCategory.length > 0 && (
                  <div className="pt-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#686257] block mb-3">
                      Lotes destacados en este rubro:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fardosInCategory.map((item) => (
                        <Link
                          key={item.id}
                          href={`/fardos/${item.id}`}
                          className="p-4 rounded-xl border border-[#e7e0d2] bg-[#f8f5ec] hover:border-[#c40506]/60 hover:bg-white transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#c40506] block">
                              {item.quality.toUpperCase()}
                            </span>
                            <h3 className="font-serif-heading font-bold text-sm text-[#19150b] group-hover:text-[#c40506] line-clamp-1 mt-0.5">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-[#686257] mt-2">
                              <span className="flex items-center gap-1 font-semibold text-[#19150b]">
                                <Scale className="w-3.5 h-3.5 text-[#c40506]" /> {item.weightKg} kg
                              </span>
                              <span>•</span>
                              <span>~{item.estimatedUnitsMin}-{item.estimatedUnitsMax} prendas</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-2 border-t border-[#e7e0d2] flex items-center justify-between text-xs">
                            <span className="font-serif-heading font-black text-sm text-[#19150b]">
                              {formatArs(item.priceArs)}
                            </span>
                            <span className="text-[11px] font-bold text-[#c40506] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                              Ficha técnica →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
