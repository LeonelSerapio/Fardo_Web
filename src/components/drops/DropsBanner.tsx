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
    <section id="drops" className="py-16 bg-gradient-to-r from-stone-950 via-amber-950/30 to-stone-950 border-b border-stone-800 text-stone-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-stone-900/90 border border-amber-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Copy (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Mecánica de Drops Semanales</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-stone-100 uppercase tracking-tight">
                Los mejores lotes vuelan en menos de 48 horas
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Todos los <strong className="text-amber-400">Viernes a las 18:00 hs</strong> liberamos el ingreso de nuevos fardos clasificados directos de importación. Sumate a la lista exclusiva de WhatsApp para recibir el listado con fotos y precios 1 hora antes de la apertura pública.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Próximo Drop: Viernes 18:00 hs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sin spam • Solo avisos de stock</span>
                </div>
              </div>
            </div>

            {/* Subscribe Box (5 cols) */}
            <div className="lg:col-span-5 bg-stone-950 border border-stone-800 p-6 rounded-2xl">
              {subscribed ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-base text-stone-100">
                    ¡Quedaste registrado en la lista VIP!
                  </h4>
                  <p className="text-xs text-stone-400">
                    Te enviaremos el catálogo anticipado de los viernes a tu WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span>Avisame del próximo Drop</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
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
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10"
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
