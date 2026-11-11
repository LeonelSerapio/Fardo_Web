'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FardoProduct } from '@/types';
import { formatArs, formatUnitCost } from '@/lib/formatters';
import {
  Scale,
  Layers,
  Check,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/catalog/ProductCard';

interface FardoDetailClientProps {
  fardo: FardoProduct;
  relatedFardos: FardoProduct[];
}

interface CartItem {
  product: FardoProduct;
  quantity: number;
}

export const FardoDetailClient: React.FC<FardoDetailClientProps> = ({
  fardo,
  relatedFardos,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const avgUnits = (fardo.estimatedUnitsMin + fardo.estimatedUnitsMax) / 2;
  const costPerUnit = Math.round(fardo.priceArs / avgUnits);

  const handleAddToCart = (product: FardoProduct, qty: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.availableStock, item.quantity + qty) }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const directWhatsappUrl = `https://wa.me/5491112345678?text=${encodeURIComponent(
    `Hola Fardo Club, quiero consultar y reservar ${quantity} bulto(s) del fardo "${fardo.title}" (${formatArs(
      fardo.priceArs * quantity
    )} ARS, ${fardo.weightKg * quantity}kg). ¿Tienen disponibilidad para despacho inmediato?`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5ec] text-[#19150b]">
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#686257] mb-8 font-medium">
          <Link href="/" className="hover:text-[#c40506] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[#d1c9ba]" />
          <Link href="/#catalogo" className="hover:text-[#c40506] transition-colors">
            Catálogo
          </Link>
          <ChevronRight className="w-3 h-3 text-[#d1c9ba]" />
          <span className="capitalize">{fardo.category}</span>
          <ChevronRight className="w-3 h-3 text-[#d1c9ba]" />
          <span className="text-[#19150b] font-bold truncate max-w-[200px] sm:max-w-md">
            {fardo.title}
          </span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Gallery / Image (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#eae3d2] border border-[#e7e0d2] shadow-sm">
              <Image
                src={fardo.image}
                alt={fardo.title}
                fill
                priority
                className="object-cover"
                unoptimized
              />

              {/* Quality & Status badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded text-xs font-black uppercase tracking-wider bg-[#c40506] text-white">
                  {fardo.quality === 'premium'
                    ? 'Selección Premium • Grado A'
                    : fardo.quality === 'primera'
                    ? '1ª Selección • Grado B+'
                    : 'Fardo Original Mixto'}
                </span>
                {fardo.isNewDrop && (
                  <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-[#fde8e8] text-[#c40506] border border-[#fbd0d0]">
                    Nuevo Drop
                  </span>
                )}
              </div>

              {/* Bottom stock badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-[#e7e0d2] flex items-center gap-2 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#c40506] animate-pulse" />
                <span>
                  Depósito Central:{' '}
                  <strong className="text-[#c40506]">{fardo.availableStock} fardos disponibles</strong>
                </span>
              </div>
            </div>

            {/* Packaging Guarantee Note */}
            <div className="bg-white p-4 rounded-xl border border-[#e7e0d2] flex items-center gap-3 text-xs text-[#686257]">
              <ShieldCheck className="w-5 h-5 text-[#c40506] shrink-0" />
              <span>
                Fardo sellado de origen con zunchos de alta resistencia y precinto numerado inviolable. Se pesa en báscula calibrada antes de cargar al transporte.
              </span>
            </div>
          </div>

          {/* Product Data & Actions (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#e7e0d2] shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c40506] block mb-1">
                Lote Mayorista Verificado
              </span>
              <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#19150b] leading-tight">
                {fardo.title}
              </h1>
              <p className="text-xs text-[#686257] mt-1.5">
                Código de lote: <strong className="text-[#19150b]">LOT-{fardo.id.slice(-6).toUpperCase()}</strong>
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-[#f8f5ec] border border-[#e7e0d2] space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#686257] block">
                    Precio Total del Fardo
                  </span>
                  <span className="font-serif-heading text-3xl sm:text-4xl font-black text-[#19150b]">
                    {formatArs(fardo.priceArs)}
                  </span>
                  <span className="text-xs text-[#686257] ml-1">IVA incluido</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#686257] block">
                    Costo estimado
                  </span>
                  <span className="text-base font-bold text-[#c40506]">
                    ~{formatUnitCost(fardo.priceArs, fardo.estimatedUnitsMin, fardo.estimatedUnitsMax)}
                  </span>
                  <span className="text-[10px] text-[#686257] block">/prenda</span>
                </div>
              </div>
            </div>

            {/* Core Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-[#e7e0d2] bg-[#f8f5ec]">
                <div className="flex items-center gap-1.5 text-[#686257] mb-1">
                  <Scale className="w-4 h-4 text-[#c40506]" />
                  <span className="uppercase text-[10px] font-bold">Peso Neto</span>
                </div>
                <span className="font-serif-heading text-lg font-black text-[#19150b]">
                  {fardo.weightKg} kg
                </span>
              </div>

              <div className="p-3 rounded-lg border border-[#e7e0d2] bg-[#f8f5ec]">
                <div className="flex items-center gap-1.5 text-[#686257] mb-1">
                  <Layers className="w-4 h-4 text-[#19150b]" />
                  <span className="uppercase text-[10px] font-bold">Prendas Est.</span>
                </div>
                <span className="font-serif-heading text-lg font-black text-[#19150b]">
                  ~{fardo.estimatedUnitsMin}-{fardo.estimatedUnitsMax} u.
                </span>
              </div>
            </div>

            {/* Highlights Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#19150b]">
                Ficha Técnica y Curaduría:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#686257]">
                {fardo.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#c40506] shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="pt-4 border-t border-[#e7e0d2] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#19150b]">Cantidad de bultos:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg border border-[#e7e0d2] bg-[#f8f5ec] hover:bg-[#eae3d2] text-[#19150b] font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-[#19150b] w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(fardo.availableStock, quantity + 1))}
                    className="w-8 h-8 rounded-lg border border-[#e7e0d2] bg-[#f8f5ec] hover:bg-[#eae3d2] text-[#19150b] font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => handleAddToCart(fardo, quantity)}
                className="w-full py-3.5 px-4 bg-[#c40506] hover:bg-[#a80405] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar {quantity} al Pedido ({formatArs(fardo.priceArs * quantity)})</span>
              </button>

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#f8f5ec] hover:bg-[#eae3d2] border border-[#e7e0d2] text-[#19150b] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25d366]" />
                <span>Consultar o Reservar por WhatsApp</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-[#e7e0d2] space-y-2 text-[11px] text-[#686257]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c40506]" />
                <span>Despacho en 24–48 hs por Vía Cargo, Correo Arg o Expresos.</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#19150b]" />
                <span>Pago con Transferencia (descuento) o pasarela en cuotas.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c40506]" />
                <span>7 días de garantía de satisfacción por lote.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedFardos.length > 0 && (
          <section className="pt-12 border-t border-[#e7e0d2]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[#c40506] text-xs font-bold uppercase tracking-widest">
                  Más Opciones
                </span>
                <h3 className="font-serif-heading text-2xl font-bold text-[#19150b] mt-1">
                  Otros Fardos de la Misma Categoría
                </h3>
              </div>
              <Link
                href="/#catalogo"
                className="text-xs font-bold text-[#c40506] hover:underline"
              >
                Ver todo el catálogo →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedFardos.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};
