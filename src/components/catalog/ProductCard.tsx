'use client';

import React from 'react';
import Image from 'next/image';
import { FardoProduct } from '@/types';
import { formatArs, formatUnitCost } from '@/lib/formatters';
import { Scale, Layers, Check, ShoppingBag, MessageCircle, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: FardoProduct;
  onAddToCart: (product: FardoProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'premium':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-amber-500 text-stone-950 border border-amber-400">
            Premium • Grado A
          </span>
        );
      case 'primera':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/40">
            1ª Selección • Grado B+
          </span>
        );
      case 'original':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            Fardo Original Mixto
          </span>
        );
      default:
        return null;
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Fardo Club, me interesa el fardo "${product.title}" (${formatArs(product.priceArs)} ARS, ${product.weightKg}kg). ¿Sigue disponible para despacho?`
  );

  return (
    <article className="group bg-stone-950 rounded-2xl border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col overflow-hidden shadow-lg hover:shadow-amber-500/5">
      {/* Visual Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {getQualityBadge(product.quality)}
            {product.isNewDrop && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500 text-stone-950">
                Nuevo Drop
              </span>
            )}
          </div>
          {product.isPopular && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-900/90 text-amber-400 border border-amber-500/40">
              Más Vendido
            </span>
          )}
        </div>

        {/* Stock warning bottom banner */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-stone-300">
          <span className="inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur-sm border border-stone-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Stock: <strong className="text-amber-400">{product.availableStock} fardos</strong>
          </span>
          <span className="text-[11px] text-stone-400">Embalaje flejado</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-stone-100 group-hover:text-amber-400 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Technical Specs Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2 bg-stone-900/80 p-2.5 rounded-xl border border-stone-800/80 text-xs">
            <div className="flex items-center gap-2 text-stone-300">
              <Scale className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Peso Fardo</span>
                <span className="font-bold text-stone-100">{product.weightKg} kg</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-stone-300">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Prendas Est.</span>
                <span className="font-bold text-stone-100">
                  ~{product.estimatedUnitsMin}-{product.estimatedUnitsMax} u.
                </span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <ul className="mt-3 space-y-1.5 text-xs text-stone-300">
            {product.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="line-clamp-1">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Block */}
        <div className="pt-3 border-t border-stone-800 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Precio Mayorista Total
              </span>
              <span className="text-2xl font-black text-amber-400">
                {formatArs(product.priceArs)}
              </span>
              <span className="text-[10px] text-stone-400 ml-1">IVA inc.</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Costo por prenda est.
              </span>
              <span className="text-sm font-extrabold text-emerald-400">
                ~{formatUnitCost(product.priceArs, product.estimatedUnitsMin, product.estimatedUnitsMax)}
              </span>
              <span className="text-[10px] text-stone-400 block">/unidad</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onAddToCart(product)}
              type="button"
              className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </button>

            <a
              href={`https://wa.me/5491112345678?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-2 bg-stone-900 hover:bg-stone-800 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
