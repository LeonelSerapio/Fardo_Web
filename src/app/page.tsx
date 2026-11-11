'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { CatalogSection } from '@/components/catalog/CatalogSection';
import { HowItWorks } from '@/components/guide/HowItWorks';
import { QualitySection } from '@/components/qualities/QualitySection';
import { DropsBanner } from '@/components/drops/DropsBanner';
import { TestimonialsAndFaq } from '@/components/social/TestimonialsAndFaq';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MOCK_FARDOS } from '@/data/mock-data';
import { FardoProduct } from '@/types';

interface CartItem {
  product: FardoProduct;
  quantity: number;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const handleAddToCart = (product: FardoProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.availableStock, item.quantity + 1) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5ec] text-[#19150b]">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        <HeroSection />

        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => {
            setSelectedCategory(slug);
            const catalogEl = document.getElementById('catalogo');
            if (catalogEl) {
              catalogEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        <CatalogSection
          initialProducts={MOCK_FARDOS}
          selectedCategory={selectedCategory}
          onAddToCart={handleAddToCart}
        />

        <HowItWorks />

        <QualitySection />

        <DropsBanner />

        <TestimonialsAndFaq />
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
}
