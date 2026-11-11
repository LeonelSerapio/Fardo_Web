'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-[#f8f5ec] text-[#19150b] pt-8 sm:pt-14 border-b border-[#e7e0d2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-12 sm:pb-16">
          {/* Left Column (Copy & CTAs) - 6 cols */}
          <div className="lg:col-span-6 space-y-6">
            {/* Drop Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fde8e8] border border-[#fbd0d0] text-[#c40506] text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c40506] animate-pulse" />
              <span>Drop Primavera & Vintage Abierto</span>
            </div>

            {/* Headline in Serif */}
            <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#19150b] leading-[1.08] tracking-tight">
              Ropa con historia.{' '}
              <span className="block mt-1">Margen para crecer.</span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-[#686257] leading-relaxed max-w-xl font-normal">
              Fardos seleccionados para tiendas, ferias y proyectos circulares. Sabés qué comprás: peso, mix, temporada y calidad garantizada.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-5">
              <a
                href="#catalogo"
                className="px-6 py-3.5 bg-[#c40506] hover:bg-[#a80405] text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Explorar fardos</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#como-comprar"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#19150b] hover:text-[#c40506] transition-colors group"
              >
                <span>Cómo elegir</span>
                <div className="w-6 h-6 rounded-full border border-[#19150b] group-hover:border-[#c40506] flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
              </a>
            </div>

            {/* Trust line */}
            <div className="pt-3 flex items-center gap-2 text-xs text-[#686257] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#c40506]" />
              <span>Más de 1.800 compras mayoristas verificadas</span>
            </div>
          </div>

          {/* Right Column (Warehouse Photo with Floating Badge) - 6 cols */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] w-full bg-[#eae3d2] border border-[#e7e0d2]">
              <Image
                src="/hero-warehouse.jpg"
                alt="Depósito mayorista de fardos de ropa textil"
                fill
                priority
                className="object-cover"
                unoptimized
              />

              {/* Floating Stock Card - Figma exact */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-lg border border-[#e7e0d2] max-w-[220px]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#c40506] block">
                  Stock actualizado hoy
                </span>
                <span className="font-serif-heading text-2xl sm:text-3xl font-black text-[#19150b] block mt-0.5">
                  124 fardos
                </span>
                <span className="text-[11px] text-[#686257] block mt-1">
                  Listos para despacho en 24–48 h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Strip - Figma exact dark brown bar */}
      <div className="bg-[#17140f] text-white py-6 sm:py-8 border-t border-[#29231b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            {/* Col 1 */}
            <div className="border-b sm:border-b-0 sm:border-r border-[#29231b] pb-4 sm:pb-0 pr-0 sm:pr-4">
              <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-white">
                Desde 20 kg
              </h3>
              <p className="text-xs text-[#a8a196] mt-0.5">
                Formatos para empezar
              </p>
            </div>

            {/* Col 2 */}
            <div className="border-b sm:border-b-0 sm:border-r border-[#29231b] pb-4 sm:pb-0 pr-0 sm:pr-4">
              <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-white">
                3 niveles
              </h3>
              <p className="text-xs text-[#a8a196] mt-0.5">
                Original • 1ª • Premium
              </p>
            </div>

            {/* Col 3 */}
            <div className="border-b sm:border-b-0 sm:border-r border-[#29231b] pb-4 sm:pb-0 pr-0 sm:pr-4">
              <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-white">
                Ficha real
              </h3>
              <p className="text-xs text-[#a8a196] mt-0.5">
                Peso y prendas estimadas
              </p>
            </div>

            {/* Col 4 */}
            <div>
              <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-white">
                7 días
              </h3>
              <p className="text-xs text-[#a8a196] mt-0.5">
                Garantía de recepción
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
