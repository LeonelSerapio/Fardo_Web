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
        return <Flame className="w-6 h-6 text-amber-500" />;
      case 'CloudSnow':
        return <CloudSnow className="w-6 h-6 text-sky-400" />;
      case 'Shirt':
        return <Shirt className="w-6 h-6 text-indigo-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-pink-400" />;
      case 'Smile':
        return <Smile className="w-6 h-6 text-emerald-400" />;
      default:
        return <Flame className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <section className="py-12 bg-stone-900 border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              Lotes Mayoristas Clasificados
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100 mt-1">
              Categorías de Mayor Rotación
            </h2>
          </div>
          <p className="text-stone-400 text-xs sm:text-sm max-w-md">
            Seleccioná un rubro para filtrar los fardos activos con stock listo para despacho inmediato.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Option for ALL */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
              selectedCategory === 'all'
                ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center mb-3">
                <span className="font-black text-amber-400 text-sm">TODOS</span>
              </div>
              <h3 className="font-bold text-sm text-stone-100">Ver Todo</h3>
              <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                Catálogo general con todos los lotes disponibles.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-stone-800/60 text-[11px] text-amber-400 font-semibold">
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
                    ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center mb-3">
                    {getIcon(cat.iconName)}
                  </div>
                  <h3 className="font-bold text-sm text-stone-100">{cat.name}</h3>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">{cat.description}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">{cat.count} lotes</span>
                  <span className={`font-semibold ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
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
