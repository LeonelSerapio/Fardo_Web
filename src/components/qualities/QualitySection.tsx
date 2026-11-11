'use client';

import React, { useState } from 'react';
import { QUALITY_TIERS } from '@/data/mock-data';
import { formatArs } from '@/lib/formatters';
import { Check, Calculator, TrendingUp } from 'lucide-react';

export const QualitySection: React.FC = () => {
  const [fardoCost, setFardoCost] = useState<number>(245000);
  const [units, setUnits] = useState<number>(50);
  const [sellPricePerUnit, setSellPricePerUnit] = useState<number>(14000);

  const costPerUnit = units > 0 ? Math.round(fardoCost / units) : 0;
  const totalRevenue = units * sellPricePerUnit;
  const netProfit = totalRevenue - fardoCost;
  const roi = fardoCost > 0 ? Math.round((netProfit / fardoCost) * 100) : 0;

  return (
    <section id="calidades" className="py-20 bg-[#f8f5ec] text-[#19150b] border-b border-[#e7e0d2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#c40506] text-xs font-bold uppercase tracking-widest">
            Transparencia y Rentabilidad
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#19150b] mt-2">
            Niveles de Calidad & Estimador de Margen
          </h2>
          <p className="text-[#686257] text-sm sm:text-base mt-3">
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
                  ? 'bg-white border-[#c40506] shadow-md ring-1 ring-[#c40506]'
                  : 'bg-white border-[#e7e0d2]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                      tier.id === 'premium'
                        ? 'bg-[#c40506] text-white'
                        : tier.id === 'primera'
                        ? 'bg-[#17140f] text-white'
                        : 'bg-[#e7e0d2] text-[#19150b]'
                    }`}
                  >
                    {tier.name}
                  </span>
                </div>

                <h3 className="font-serif-heading font-bold text-base text-[#19150b] mb-2">
                  {tier.tagline}
                </h3>
                <p className="text-xs text-[#686257] leading-relaxed mb-4">
                  {tier.description}
                </p>

                <div className="space-y-2 text-xs border-t border-[#f0ebe0] pt-3">
                  <div className="flex items-start gap-2 text-[#19150b]">
                    <Check className="w-3.5 h-3.5 text-[#c40506] shrink-0 mt-0.5" />
                    <span><strong>Condición:</strong> {tier.condition}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#19150b]">
                    <Check className="w-3.5 h-3.5 text-[#c40506] shrink-0 mt-0.5" />
                    <span><strong>Retorno estimado:</strong> {tier.marginPotential}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#f0ebe0] text-[11px] text-[#686257]">
                <strong>Ideal para:</strong> {tier.idealFor}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Margin Calculator */}
        <div className="bg-white border border-[#e7e0d2] rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e7e0d2]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#c40506] text-xs font-bold uppercase tracking-widest">
                <Calculator className="w-4 h-4" />
                <span>Herramienta Interactiva</span>
              </div>
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#19150b] mt-1">
                Calculadora de Rentabilidad B2B
              </h3>
            </div>
            <p className="text-[#686257] text-xs sm:text-sm max-w-sm">
              Simulá tu margen según el fardo que elijas y el precio de reventa estimado en tu canal comercial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#19150b] mb-2">
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
                          ? 'bg-[#c40506] text-white border-[#c40506]'
                          : 'bg-[#f8f5ec] border-[#e7e0d2] text-[#686257] hover:text-[#19150b]'
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
                  className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-2.5 text-sm text-[#19150b] font-bold focus:outline-none focus:border-[#c40506]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#19150b] mb-2">
                    Prendas Estimadas en el Fardo
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-2.5 text-sm text-[#19150b] font-bold focus:outline-none focus:border-[#c40506]"
                  />
                  <span className="text-[10px] text-[#686257] mt-1 block">
                    Ej: 50 prendas en buzos de 25kg
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#19150b] mb-2">
                    Precio de Reventa Promedio (ARS)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={sellPricePerUnit}
                    onChange={(e) => setSellPricePerUnit(Number(e.target.value))}
                    className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-2.5 text-sm text-[#19150b] font-bold focus:outline-none focus:border-[#c40506]"
                  />
                  <span className="text-[10px] text-[#686257] mt-1 block">
                    Precio por prenda en tu mostrador
                  </span>
                </div>
              </div>
            </div>

            {/* Results Output (5 cols) */}
            <div className="lg:col-span-5 bg-[#17140f] text-white rounded-2xl p-6 space-y-4 shadow-md">
              <div className="text-center pb-4 border-b border-[#29231b]">
                <span className="text-[11px] uppercase tracking-wider text-[#a8a196] font-bold">
                  Tu Ganancia Neta Estimada
                </span>
                <p className="font-serif-heading text-3xl sm:text-4xl font-black text-white mt-1">
                  {formatArs(netProfit)}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#c40506] text-white text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{roi}% Retorno (ROI)</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#a8a196]">
                  <span>Costo unitario por prenda:</span>
                  <strong className="text-white">{formatArs(costPerUnit)}</strong>
                </div>
                <div className="flex justify-between text-[#a8a196]">
                  <span>Recaudación bruta total:</span>
                  <strong className="text-white">{formatArs(totalRevenue)}</strong>
                </div>
                <div className="flex justify-between text-[#a8a196]">
                  <span>Inversión inicial fardo:</span>
                  <strong className="text-white">{formatArs(fardoCost)}</strong>
                </div>
              </div>

              <a
                href="#catalogo"
                className="block text-center w-full py-3 bg-[#c40506] hover:bg-[#a80405] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm"
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
