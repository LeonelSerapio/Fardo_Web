'use client';

import React from 'react';
import Image from 'next/image';
import { FardoProduct } from '@/types';
import { formatArs, formatUnitCost } from '@/lib/formatters';
import { Scale, Layers, Check, ShoppingBag, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: FardoProduct;
  onAddToCart: (product: FardoProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'premium':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider bg-[#c40506] text-white">
            Premium • Grado A
          </span>
        );
      case 'primera':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-[#17140f] text-white">
            1ª Selección
          </span>
        );
      case 'original':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-[#e7e0d2] text-[#19150b]">
            Fardo Original
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
    <article className="group bg-white rounded-2xl border border-[#e7e0d2] hover:border-[#c40506]/50 transition-all flex flex-col overflow-hidden shadow-sm hover:shadow-md">
      {/* Image Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eae3d2]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {getQualityBadge(product.quality)}
            {product.isNewDrop && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#fde8e8] text-[#c40506] border border-[#fbd0d0]">
                Nuevo Drop
              </span>
            )}
          </div>
          {product.isPopular && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/90 text-[#19150b] border border-[#e7e0d2]">
              Destacado
            </span>
          )}
        </div>

        {/* Stock badge bottom bar */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded bg-white/95 text-[#19150b] border border-[#e7e0d2] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c40506]" />
            Stock: <strong className="text-[#c40506]">{product.availableStock} fardos</strong>
          </span>
          <span className="text-[10px] font-medium bg-[#17140f]/80 text-white px-2 py-0.5 rounded">
            Flete directo
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif-heading font-bold text-base sm:text-lg text-[#19150b] group-hover:text-[#c40506] transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Technical Specs */}
          <div className="mt-3 grid grid-cols-2 gap-2 bg-[#f8f5ec] p-2.5 rounded-xl border border-[#e7e0d2] text-xs">
            <div className="flex items-center gap-2 text-[#19150b]">
              <Scale className="w-4 h-4 text-[#c40506] shrink-0" />
              <div>
                <span className="text-[10px] text-[#686257] block uppercase font-medium">Peso Fardo</span>
                <span className="font-bold text-[#19150b]">{product.weightKg} kg</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#19150b]">
              <Layers className="w-4 h-4 text-[#19150b] shrink-0" />
              <div>
                <span className="text-[10px] text-[#686257] block uppercase font-medium">Prendas Est.</span>
                <span className="font-bold text-[#19150b]">
                  ~{product.estimatedUnitsMin}-{product.estimatedUnitsMax} u.
                </span>
              </div>
            </div>
          </div>

          {/* Highlights checklist */}
          <ul className="mt-3 space-y-1.5 text-xs text-[#686257]">
            {product.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#c40506] shrink-0" />
                <span className="line-clamp-1">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Block */}
        <div className="pt-3 border-t border-[#e7e0d2] space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#686257] block">
                Precio Mayorista Total
              </span>
              <span className="font-serif-heading text-2xl font-black text-[#19150b]">
                {formatArs(product.priceArs)}
              </span>
              <span className="text-[10px] text-[#686257] ml-1">IVA inc.</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#686257] block">
                Costo estimado
              </span>
              <span className="text-sm font-bold text-[#c40506]">
                ~{formatUnitCost(product.priceArs, product.estimatedUnitsMin, product.estimatedUnitsMax)}
              </span>
              <span className="text-[10px] text-[#686257] block">/prenda</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onAddToCart(product)}
              type="button"
              className="w-full py-2.5 px-3 bg-[#c40506] hover:bg-[#a80405] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pedir</span>
            </button>

            <a
              href={`https://wa.me/5491112345678?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-2 bg-[#f8f5ec] hover:bg-[#eae3d2] border border-[#e7e0d2] text-[#19150b] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" />
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
