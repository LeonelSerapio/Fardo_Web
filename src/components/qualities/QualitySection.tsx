'use client';

import React, { useState } from 'react';
import { QUALITY_TIERS } from '@/data/mock-data';
import { formatArs } from '@/lib/formatters';
import { Check, Calculator, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export const QualitySection: React.FC = () => {
  // Calculator state
  const [fardoCost, setFardoCost] = useState<number>(245000);
  const [units, setUnits] = useState<number>(50);
  const [sellPricePerUnit, setSellPricePerUnit] = useState<number>(14000);

  // Calculations
  const costPerUnit = units > 0 ? Math.round(fardoCost / units) : 0;
  const totalRevenue = units * sellPricePerUnit;
  const netProfit = totalRevenue - fardoCost;
  const roi = fardoCost > 0 ? Math.round((netProfit / fardoCost) * 100) : 0;

  return (
    <section id="calidades" className="py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            Transparencia y Rentabilidad
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-100 mt-2">
            Niveles de Calidad & Estimador de Margen
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-3">
            Conocé en detalle qué incluye cada selección para elegir el fardo que mejor se ajusta a tu modelo de reventa.
          </p>
        </div>

        {/* Tiers Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {QUALITY_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between ${
                tier.id === 'premium'
                  ? 'bg-stone-900 border-amber-500/50 shadow-xl shadow-amber-500/5'
                  : 'bg-stone-900/40 border-stone-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                      tier.id === 'premium'
                        ? 'bg-amber-500 text-stone-950'
                        : tier.id === 'primera'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {tier.name}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-stone-100 mb-2">
                  {tier.tagline}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed mb-4">
                  {tier.description}
                </p>

                <div className="space-y-2 text-xs border-t border-stone-800 pt-3">
                  <div className="flex items-start gap-2 text-stone-300">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Condición:</strong> {tier.condition}</span>
                  </div>
                  <div className="flex items-start gap-2 text-stone-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Retorno estimado:</strong> {tier.marginPotential}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
                <strong>Ideal para:</strong> {tier.idealFor}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Margin Calculator */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest">
                <Calculator className="w-4 h-4" />
                <span>Herramienta Interactiva</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-100 mt-1">
                Calculadora de Rentabilidad B2B
              </h3>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm max-w-sm">
              Simulá tu margen según el fardo que elijas y el precio de reventa estimado en tu canal comercial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                  Costo Total del Fardo (ARS)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[185000, 245000, 320000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFardoCost(preset)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                        fardoCost === preset
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {formatArs(preset)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="50000"
                  step="5000"
                  value={fardoCost}
                  onChange={(e) => setFardoCost(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                    Prendas Estimadas en el Fardo
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    Ej: 50 prendas en buzos de 25kg
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                    Precio de Reventa Promedio (ARS)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={sellPricePerUnit}
                    onChange={(e) => setSellPricePerUnit(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    Precio por prenda en tu mostrador
                  </span>
                </div>
              </div>
            </div>

            {/* Results Output (5 cols) */}
            <div className="lg:col-span-5 bg-stone-950 border border-stone-800 rounded-2xl p-6 space-y-4">
              <div className="text-center pb-4 border-b border-stone-800">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                  Tu Ganancia Neta Estimada
                </span>
                <p className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                  {formatArs(netProfit)}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{roi}% de Retorno (ROI)</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span>Costo unitario por prenda:</span>
                  <strong className="text-stone-100">{formatArs(costPerUnit)}</strong>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Recaudación bruta total:</span>
                  <strong className="text-stone-100">{formatArs(totalRevenue)}</strong>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Inversión inicial fardo:</span>
                  <strong className="text-amber-400">{formatArs(fardoCost)}</strong>
                </div>
              </div>

              <a
                href="#catalogo"
                className="block text-center w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-amber-500/10"
              >
                Buscar Fardos con Este Rendimiento
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
