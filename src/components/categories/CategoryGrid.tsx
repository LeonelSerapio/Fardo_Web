'use client';

import React from 'react';
import { CATEGORIES } from '@/data/mock-data';
import { Flame, CloudSnow, Shirt, Sparkles, Smile } from 'lucide-react';

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#c40506]" />;
      case 'CloudSnow':
        return <CloudSnow className="w-5 h-5 text-[#2563eb]" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-[#4b5563]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#db2777]" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-[#059669]" />;
      default:
        return <Flame className="w-5 h-5 text-[#c40506]" />;
    }
  };

  return (
    <section id="categorias" className="py-12 bg-[#f8f5ec] border-b border-[#e7e0d2] text-[#19150b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[#c40506] text-xs font-bold uppercase tracking-widest">
              Lotes Mayoristas Clasificados
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#19150b] mt-1">
              Categorías de Mayor Rotación
            </h2>
          </div>
          <p className="text-[#686257] text-xs sm:text-sm max-w-md">
            Seleccioná un rubro para filtrar los fardos activos con stock listo para despacho inmediato.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Option for ALL */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
              selectedCategory === 'all'
                ? 'bg-white border-[#c40506] shadow-md ring-1 ring-[#c40506]'
                : 'bg-white/80 border-[#e7e0d2] hover:border-[#c40506]/50 hover:bg-white'
            }`}
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#f8f5ec] border border-[#e7e0d2] flex items-center justify-center mb-3">
                <span className="font-black text-[#c40506] text-xs">TODO</span>
              </div>
              <h3 className="font-bold text-sm text-[#19150b]">Ver Todo</h3>
              <p className="text-xs text-[#686257] mt-1 line-clamp-2">
                Catálogo general con todos los lotes disponibles.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f0ebe0] text-[11px] text-[#c40506] font-semibold">
              Mostrar todo
            </div>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#c40506] shadow-md ring-1 ring-[#c40506]'
                    : 'bg-white/80 border-[#e7e0d2] hover:border-[#c40506]/50 hover:bg-white'
                }`}
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#f8f5ec] border border-[#e7e0d2] flex items-center justify-center mb-3">
                    {getIcon(cat.iconName)}
                  </div>
                  <h3 className="font-bold text-sm text-[#19150b]">{cat.name}</h3>
                  <p className="text-xs text-[#686257] mt-1 line-clamp-2">{cat.description}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#f0ebe0] flex items-center justify-between text-[11px]">
                  <span className="text-[#686257]">{cat.count} lotes</span>
                  <span className={`font-semibold ${isSelected ? 'text-[#c40506]' : 'text-[#8c8578]'}`}>
                    {isSelected ? 'Filtrado' : 'Explorar'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
