'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { FardoProduct } from '@/types';
import { ProductCard } from './ProductCard';
import { api } from '@/lib/api-client';
import { Search, Filter, SlidersHorizontal, Sparkles, Loader2 } from 'lucide-react';

interface CatalogSectionProps {
  initialProducts?: FardoProduct[];
  selectedCategory: string;
  onAddToCart: (product: FardoProduct) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  initialProducts = [],
  selectedCategory,
  onAddToCart,
}) => {
  const [products, setProducts] = useState<FardoProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'weight'>('popular');
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const data = await api.getFardos({
          category: selectedCategory,
          quality: selectedQuality,
          search: searchQuery,
          sortBy,
        });
        if (isMounted) {
          startTransition(() => {
            setProducts(data);
          });
        }
      } catch (err) {
        console.error('Error fetching fardos from API handler:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFiltered();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, selectedQuality, searchQuery, sortBy]);

  return (
    <section id="catalogo" className="py-16 bg-[#f8f5ec] text-[#19150b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#c40506] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inventario Mayorista Disponible</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#19150b]">
              Catálogo de Fardos en Depósito
            </h2>
          </div>
          <p className="text-[#686257] text-sm max-w-md">
            Todos los fardos se entregan precintados y flejados. Ficha de pesaje y contenido verificada antes del despacho.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#e7e0d2] p-4 rounded-2xl mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between shadow-sm">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#686257] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por fardo, prendas o marcas (Nike, Levi's, sweaters...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#19150b] placeholder-[#686257] focus:outline-none focus:border-[#c40506] transition-colors"
            />
          </div>

          {/* Quality tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs text-[#686257] font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Calidad:
            </span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'premium', label: 'Premium' },
              { id: 'primera', label: '1ª Selección' },
              { id: 'original', label: 'Original' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedQuality(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedQuality === tab.id
                    ? 'bg-[#c40506] text-white shadow-sm'
                    : 'bg-[#f8f5ec] text-[#686257] hover:text-[#19150b] border border-[#e7e0d2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#686257] font-semibold whitespace-nowrap flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Ordenar:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-lg px-3 py-2 text-xs text-[#19150b] focus:outline-none focus:border-[#c40506]"
            >
              <option value="popular">Más destacados</option>
              <option value="price-asc">Menor precio (ARS)</option>
              <option value="price-desc">Mayor precio (ARS)</option>
              <option value="weight">Menor peso (kg)</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Loading status */}
        <div className="mb-6 flex items-center justify-between text-xs text-[#686257]">
          <span className="flex items-center gap-2">
            Mostrando <strong className="text-[#19150b]">{products.length}</strong> lotes disponibles
            {(loading || isPending) && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c40506]" />}
          </span>
          {selectedCategory !== 'all' && (
            <span className="text-[#c40506] font-semibold">Filtro de rubro activo: {selectedCategory}</span>
          )}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e7e0d2] rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
            <p className="text-[#19150b] font-bold text-base">
              No encontramos fardos con los filtros solicitados
            </p>
            <p className="text-xs text-[#686257]">
              Probá limpiando la búsqueda o cambiando el nivel de calidad.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedQuality('all');
              }}
              className="px-4 py-2 bg-[#c40506] hover:bg-[#a80405] text-white text-xs font-semibold rounded-lg"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
