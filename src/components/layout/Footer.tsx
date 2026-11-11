import React from 'react';
import { Package, ShieldCheck, Truck, CreditCard, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-md">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-stone-100 uppercase">
                  FARDO <span className="text-amber-500">CLUB</span>
                </span>
                <span className="text-[10px] text-stone-400 block tracking-widest uppercase font-semibold">
                  Mayorista Textil Argentina
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Importación y selección directa de fardos de ropa vintage, circular y de primera calidad para emprendedores y locales en todo el país.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía de satisfacción y pesaje legal</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-100">
              Secciones
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#catalogo" className="hover:text-amber-400 transition-colors">Catálogo de Fardos</a></li>
              <li><a href="#calidades" className="hover:text-amber-400 transition-colors">Niveles de Calidad (A, B+, Mixto)</a></li>
              <li><a href="#drops" className="hover:text-amber-400 transition-colors">Drops Semanales</a></li>
              <li><a href="#como-comprar" className="hover:text-amber-400 transition-colors">Guía de Compra</a></li>
              <li><a href="#faqs" className="hover:text-amber-400 transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Col 3: Shipping & Payment Argentina */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-100">
              Logística & Pagos
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Vía Cargo • Correo Arg • Andreani • Expresos</span>
              </p>
              <p className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Transferencia (Descuento B2B) • Factura A y B</span>
              </p>
              <p className="text-[11px] text-stone-500 pt-1">
                Despachos diarios a depósito central y terminales de micros en las 24 provincias.
              </p>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-100">
              Atención Comercial
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+54 9 11 1234-5678 (WhatsApp)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>ventas@fardoclub.com.ar</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Depósito Central: Buenos Aires, Argentina</span>
              </p>
              <p className="text-[11px] text-stone-500">
                Lunes a Viernes de 09:00 a 18:00 hs.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Fardo Club Argentina. Todos los derechos reservados.</p>
          <p className="text-[11px]">
            Precios expresados en Pesos Argentinos (ARS). Venta exclusiva por bulto cerrado y fardo mayorista.
          </p>
        </div>
      </div>
    </footer>
  );
};
