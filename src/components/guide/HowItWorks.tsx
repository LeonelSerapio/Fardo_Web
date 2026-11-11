import React from 'react';
import { HOW_IT_WORKS_STEPS } from '@/data/mock-data';
import { Search, Calculator, CreditCard, Truck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Search className="w-6 h-6 text-amber-500" />;
      case 1:
        return <Calculator className="w-6 h-6 text-emerald-400" />;
      case 2:
        return <CreditCard className="w-6 h-6 text-amber-500" />;
      case 3:
        return <Truck className="w-6 h-6 text-emerald-400" />;
      default:
        return null;
    }
  };

  return (
    <section id="como-comprar" className="py-20 bg-stone-900 border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            Proceso de Compra Mayorista
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-100 mt-2">
            Comprar un Fardo Nunca Fue Tan Simple
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-3">
            Sin intermediarios ni sorpresas en el pesaje. 4 pasos claros desde la elección del lote hasta la recepción en tu local o domicilio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="bg-stone-950 p-6 rounded-2xl border border-stone-800 hover:border-stone-700 transition-colors flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-stone-900 flex items-center justify-center border border-stone-800 group-hover:scale-105 transition-transform">
                    {getStepIcon(idx)}
                  </div>
                  <span className="text-3xl font-black text-stone-800 group-hover:text-amber-500/40 transition-colors">
                    {step.step}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-stone-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-800/80 text-[11px] font-semibold text-amber-500">
                Paso verificado ✓
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
