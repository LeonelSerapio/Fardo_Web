import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, Truck, Sparkles, TrendingUp } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100 py-16 sm:py-24 border-b border-stone-800">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge: Stock en vivo */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/90 border border-stone-700 text-xs font-medium text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-emerald-400">Stock activo en depósito</span>
            <span className="text-stone-500">•</span>
            <span>Despacho inmediato a todo el país</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-100 uppercase">
            Ropa con historia.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              Margen para crecer.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-stone-300 font-normal leading-relaxed">
            Plataforma mayorista B2B en Argentina de fardos de ropa vintage, circular y de primera selección.
            Comprá por kilo con ficha técnica transparente, costo unitario exacto y garantía de satisfacción.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#catalogo"
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
            >
              <span>Ver Catálogo de Fardos</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#calidades"
              className="w-full sm:w-auto px-7 py-4 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-sm tracking-wide rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Calculadora de Ganancia</span>
            </a>
          </div>

          {/* Trust Metric Badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-stone-800/80 text-left">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-900/40 border border-stone-800">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-stone-100">+1.800 Fardos</p>
                <p className="text-xs text-stone-400">Despachados a revendedores</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-900/40 border border-stone-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-stone-100">7 Días Garantía</p>
                <p className="text-xs text-stone-400">Satisfacción y calidad real</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-900/40 border border-stone-800">
              <Truck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-stone-100">Envíos Federales</p>
                <p className="text-xs text-stone-400">Vía Cargo / Correo / Expresos</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-900/40 border border-stone-800">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-stone-100">Ficha Clara</p>
                <p className="text-xs text-stone-400">Kilos y prendas estimadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
