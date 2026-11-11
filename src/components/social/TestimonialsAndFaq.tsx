'use client';

import React, { useState } from 'react';
import { TESTIMONIALS, FAQS } from '@/data/mock-data';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';

export const TestimonialsAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-20 bg-[#f8f5ec] border-b border-[#e7e0d2] text-[#19150b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Testimonials */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#c40506] text-xs font-bold uppercase tracking-widest">
              Comunidad de Revendedores
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#19150b] mt-2">
              Locales y Showrooms que Crecen con Nosotros
            </h2>
            <p className="text-[#686257] text-sm mt-2">
              Casos reales de emprendedores que abastecen sus tiendas físicas y virtuales en Argentina.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-2xl border border-[#e7e0d2] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#c40506]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#c40506]" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-[#c40506] bg-[#fde8e8] px-2.5 py-0.5 rounded-full">
                      {t.metric}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#19150b] italic leading-relaxed mb-6 font-serif-heading">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f0ebe0] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f8f5ec] border border-[#e7e0d2] text-[#c40506] flex items-center justify-center font-bold text-xs">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#19150b]">{t.name}</h4>
                    <p className="text-[11px] text-[#686257]">{t.business} • {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#c40506] text-xs font-bold uppercase tracking-widest">
              Dudas Resueltas
            </span>
            <h2 className="font-serif-heading text-3xl font-bold text-[#19150b] mt-2">
              Preguntas Frecuentes
            </h2>
            <p className="text-[#686257] text-sm mt-2">
              Todo lo que necesitás saber antes de hacer tu primera compra mayorista.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#e7e0d2] rounded-xl overflow-hidden transition-colors shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#f8f5ec]/60 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#19150b]">
                      {faq.question}
                    </span>
                    <span className="text-[#686257] shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#c40506]" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#686257] leading-relaxed border-t border-[#f0ebe0] bg-[#faf8f2]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
