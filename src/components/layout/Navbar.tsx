'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X, MessageCircle } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount = 0, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f8f5ec]/95 backdrop-blur-md border-b border-[#e7e0d2] text-[#19150b]">
      {/* Top Red Bar - Figma exact */}
      <div className="bg-[#cd0102] text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>ENVÍOS A TODA ARGENTINA - DESPACHO DIRECTO DESDE DEPÓSITO</span>
          <div className="hidden sm:flex items-center gap-3">
            <span>Compra segura</span>
            <span>•</span>
            <a
              href="https://wa.me/5491112345678"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 font-semibold"
            >
              Asesoría por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-[#c40506] text-white flex items-center justify-center font-serif font-black text-lg shadow-sm">
            F
          </div>
          <span className="font-serif-heading font-extrabold text-xl tracking-tight text-[#19150b] uppercase">
            FARDO CLUB
          </span>
        </Link>

        {/* Desktop Links - Figma exact */}
        <div className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-[#19150b]/80">
          <a href="#catalogo" className="hover:text-[#c40506] transition-colors">Fardos</a>
          <a href="#categorias" className="hover:text-[#c40506] transition-colors">Categorías</a>
          <a href="#temporada" className="hover:text-[#c40506] transition-colors">Temporada</a>
          <a href="#calidades" className="hover:text-[#c40506] transition-colors">Calidades</a>
          <a href="#drops" className="hover:text-[#c40506] transition-colors">Último drop</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <a
            href="#catalogo"
            className="hidden sm:flex items-center text-[#19150b]/80 hover:text-[#c40506] p-1.5"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4" />
          </a>

          <a
            href="https://wa.me/5491112345678"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-[#19150b]/80 hover:text-[#c40506]"
          >
            <User className="w-4 h-4" />
            <span>Mi cuenta</span>
          </a>

          <button
            onClick={onOpenCart}
            type="button"
            className="relative flex items-center gap-2 p-2 rounded-lg hover:bg-[#eae3d2] text-[#19150b] transition-colors"
            aria-label="Carrito"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="bg-[#c40506] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#19150b]"
            aria-label="Menú móvil"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e7e0d2] bg-[#f8f5ec] px-4 pt-3 pb-6 space-y-3 font-semibold text-sm">
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#19150b] hover:text-[#c40506]"
          >
            Fardos
          </a>
          <a
            href="#categorias"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#19150b] hover:text-[#c40506]"
          >
            Categorías
          </a>
          <a
            href="#temporada"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#19150b] hover:text-[#c40506]"
          >
            Temporada
          </a>
          <a
            href="#calidades"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#19150b] hover:text-[#c40506]"
          >
            Calidades
          </a>
          <a
            href="#drops"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#c40506]"
          >
            Último drop
          </a>
          <div className="pt-2 border-t border-[#e7e0d2]">
            <a
              href="https://wa.me/5491112345678"
              className="flex items-center gap-2 py-2 text-[#19150b] font-bold"
            >
              <MessageCircle className="w-4 h-4 text-[#c40506]" />
              <span>Asesoría por WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
