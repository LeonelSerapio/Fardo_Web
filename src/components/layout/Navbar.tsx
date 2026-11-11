'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Menu, X, ShoppingBag, MessageCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount = 0, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      {/* Top micro-bar for Argentine B2B trust */}
      <div className="bg-amber-600 text-stone-950 font-medium text-xs py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Venta mayorista directa en Argentina • Precios en ARS con IVA • Despachos a todo el país</span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-md group-hover:bg-amber-400 transition-colors">
            <Package className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-wider text-stone-100 uppercase">
              FARDO <span className="text-amber-500">CLUB</span>
            </span>
            <span className="text-[10px] text-stone-400 tracking-widest uppercase font-semibold">
              Tienda Mayorista Argentina
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
          <a href="#catalogo" className="hover:text-amber-400 transition-colors">Catálogo</a>
          <a href="#calidades" className="hover:text-amber-400 transition-colors">Niveles de Calidad</a>
          <a href="#drops" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Drops Semanales
          </a>
          <a href="#como-comprar" className="hover:text-amber-400 transition-colors">Cómo Comprar</a>
          <a href="#faqs" className="hover:text-amber-400 transition-colors">Preguntas Frecuentes</a>
        </div>

        {/* Desktop CTA actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/5491112345678?text=Hola,%20quiero%20consultar%20por%20fardos%20mayoristas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Asesor WhatsApp</span>
          </a>

          <button
            onClick={onOpenCart}
            type="button"
            className="relative flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mi Pedido</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-amber-400 border border-amber-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenCart}
            type="button"
            className="relative p-2 text-stone-300 hover:text-amber-400"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-amber-500 text-stone-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-300 hover:text-stone-100"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-800 bg-stone-950 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-200 hover:text-amber-400"
          >
            Catálogo de Fardos
          </a>
          <a
            href="#calidades"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-200 hover:text-amber-400"
          >
            Niveles de Calidad
          </a>
          <a
            href="#drops"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-emerald-400"
          >
            Drops Semanales (Lotes Nuevos)
          </a>
          <a
            href="#como-comprar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-200 hover:text-amber-400"
          >
            Cómo Comprar en 4 Pasos
          </a>
          <a
            href="#faqs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-200 hover:text-amber-400"
          >
            Preguntas Frecuentes
          </a>
          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <a
              href="https://wa.me/5491112345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar Asesor por WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
