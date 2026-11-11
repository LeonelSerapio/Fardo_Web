'use client';

import React, { useState } from 'react';
import { Bell, Flame, MessageCircle, CheckCircle2, Clock } from 'lucide-react';

export const DropsBanner: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section id="drops" className="py-16 bg-white border-b border-[#e7e0d2] text-[#19150b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-3xl p-8 sm:p-12 shadow-sm relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Copy (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fde8e8] border border-[#fbd0d0] text-[#c40506] text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-[#c40506]" />
                <span>Mecánica de Drops Semanales</span>
              </div>

              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#19150b] tracking-tight">
                Los mejores lotes vuelan en menos de 48 horas
              </h2>

              <p className="text-[#686257] text-sm sm:text-base leading-relaxed">
                Todos los <strong className="text-[#19150b]">Viernes a las 18:00 hs</strong> liberamos el ingreso de nuevos fardos clasificados directos de importación. Sumate a la lista exclusiva de WhatsApp para recibir el listado con fotos y precios 1 hora antes de la apertura pública.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#686257]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#c40506]" />
                  <span>Próximo Drop: Viernes 18:00 hs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Sin spam • Solo avisos de stock</span>
                </div>
              </div>
            </div>

            {/* Subscribe Box (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-[#e7e0d2] p-6 rounded-2xl shadow-sm">
              {subscribed ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-[#fde8e8] text-[#c40506] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif-heading font-bold text-base text-[#19150b]">
                    ¡Quedaste registrado en la lista VIP!
                  </h4>
                  <p className="text-xs text-[#686257]">
                    Te enviaremos el catálogo anticipado de los viernes a tu WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-[#19150b] flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#c40506]" />
                      <span>Avisame del próximo Drop</span>
                    </h3>
                    <p className="text-xs text-[#686257] mt-1">
                      Ingresá tu número de WhatsApp para recibir el link privado con los fardos nuevos.
                    </p>
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Ej: 11 2345 6789 (WhatsApp)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-3 text-sm text-[#19150b] placeholder-[#686257] focus:outline-none focus:border-[#c40506] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#c40506] hover:bg-[#a80405] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Unirme a la Lista de Alertas</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
