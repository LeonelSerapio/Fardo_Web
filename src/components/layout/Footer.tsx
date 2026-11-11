import React from 'react';
import { Package, ShieldCheck, Truck, CreditCard, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#17140f] text-[#a8a196] border-t border-[#29231b] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c40506] text-white flex items-center justify-center font-serif font-black text-base shadow-sm">
                F
              </div>
              <span className="font-serif-heading font-extrabold text-lg tracking-tight text-white uppercase">
                FARDO CLUB
              </span>
            </div>

            <p className="text-xs text-[#a8a196] leading-relaxed">
              Importación y selección directa de fardos de ropa vintage, circular y de primera calidad para emprendedores y locales en toda Argentina.
            </p>

            <div className="flex items-center gap-2 text-xs text-white">
              <ShieldCheck className="w-4 h-4 text-[#c40506]" />
              <span>Garantía de satisfacción y pesaje legal</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              Secciones
            </h4>
            <ul className="space-y-2 text-xs text-[#a8a196]">
              <li><a href="#catalogo" className="hover:text-white transition-colors">Catálogo de Fardos</a></li>
              <li><a href="#calidades" className="hover:text-white transition-colors">Niveles de Calidad (A, B+, Mixto)</a></li>
              <li><a href="#drops" className="hover:text-white transition-colors">Drops Semanales</a></li>
              <li><a href="#como-comprar" className="hover:text-white transition-colors">Guía de Compra</a></li>
              <li><a href="#faqs" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Col 3: Shipping & Payment Argentina */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              Logística & Pagos
            </h4>
            <div className="space-y-2 text-xs text-[#a8a196]">
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c40506]" />
                <span>Vía Cargo • Correo Arg • Andreani • Expresos</span>
              </p>
              <p className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-white" />
                <span>Transferencia (Descuento B2B) • Factura A y B</span>
              </p>
              <p className="text-[11px] text-[#706a61] pt-1">
                Despachos diarios a depósito central y terminales de micros en las 24 provincias.
              </p>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              Atención Comercial
            </h4>
            <div className="space-y-2 text-xs text-[#a8a196]">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c40506]" />
                <span>+54 9 11 1234-5678 (WhatsApp)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c40506]" />
                <span>ventas@fardoclub.com.ar</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c40506]" />
                <span>Depósito Central: Buenos Aires, Argentina</span>
              </p>
              <p className="text-[11px] text-[#706a61]">
                Lunes a Viernes de 09:00 a 18:00 hs.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#29231b] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#706a61]">
          <p>© 2026 Fardo Club Argentina. Todos los derechos reservados.</p>
          <p className="text-[11px]">
            Precios expresados en Pesos Argentinos (ARS). Venta exclusiva por fardo cerrado mayorista.
          </p>
        </div>
      </div>
    </footer>
  );
};
