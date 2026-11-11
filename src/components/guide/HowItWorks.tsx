import React from 'react';
import { HOW_IT_WORKS_STEPS } from '@/data/mock-data';
import { Search, Calculator, CreditCard, Truck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Search className="w-5 h-5 text-[#c40506]" />;
      case 1:
        return <Calculator className="w-5 h-5 text-[#19150b]" />;
      case 2:
        return <CreditCard className="w-5 h-5 text-[#c40506]" />;
      case 3:
        return <Truck className="w-5 h-5 text-[#19150b]" />;
      default:
        return null;
    }
  };

  return (
    <section id="como-comprar" className="py-20 bg-white border-b border-[#e7e0d2] text-[#19150b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#c40506] text-xs font-bold uppercase tracking-widest">
            Proceso de Compra Mayorista
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#19150b] mt-2">
            Comprar un Fardo Nunca Fue Tan Simple
          </h2>
          <p className="text-[#686257] text-sm sm:text-base mt-3">
            Sin intermediarios ni sorpresas en el pesaje. 4 pasos claros desde la elección del lote hasta la recepción en tu local o domicilio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="bg-[#f8f5ec] p-6 rounded-2xl border border-[#e7e0d2] hover:border-[#c40506]/40 transition-colors flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#e7e0d2] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    {getStepIcon(idx)}
                  </div>
                  <span className="font-serif-heading text-3xl font-black text-[#e7e0d2] group-hover:text-[#c40506]/30 transition-colors">
                    {step.step}
                  </span>
                </div>

                <h3 className="font-serif-heading font-bold text-base text-[#19150b] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#686257] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#e7e0d2] text-[11px] font-semibold text-[#c40506]">
                Paso verificado ✓
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
