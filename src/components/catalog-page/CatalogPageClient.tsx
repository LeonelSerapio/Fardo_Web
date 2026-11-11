'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { FardoProduct, CategoryItem } from '@/types';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { api } from '@/lib/api-client';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Package,
} from 'lucide-react';

interface CatalogPageClientProps {
  initialProducts: FardoProduct[];
  categories: CategoryItem[];
  initialCategory?: string;
  initialQuality?: string;
  initialQuery?: string;
}

interface CartItem {
  product: FardoProduct;
  quantity: number;
}

export const CatalogPageClient: React.FC<CatalogPageClientProps> = ({
  initialProducts,
  categories,
  initialCategory = 'all',
  initialQuality = 'all',
  initialQuery = '',
}) => {
  const [products, setProducts] = useState<FardoProduct[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedQuality, setSelectedQuality] = useState<string>(initialQuality);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'weight'>('popular');
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const data = await api.getFardos({
          category: selectedCategory,
          quality: selectedQuality,
          search: searchQuery,
          sortBy,
        });
        if (isMounted) {
          startTransition(() => {
            setProducts(data);
          });
        }
      } catch (err) {
        console.error('Error fetching fardos in catalog page:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFiltered();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, selectedQuality, searchQuery, sortBy]);

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
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#686257] mb-6 font-medium">
          <Link href="/" className="hover:text-[#c40506] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[#d1c9ba]" />
          <span className="text-[#19150b] font-bold">Catálogo de Fardos</span>
          {selectedCategory !== 'all' && (
            <>
              <ChevronRight className="w-3 h-3 text-[#d1c9ba]" />
              <span className="capitalize text-[#c40506] font-bold">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#fde8e8] text-[#c40506] text-xs font-bold uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Inventario Mayorista Federal</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#19150b]">
            Catálogo General de Fardos
          </h1>
          <p className="text-sm text-[#686257] mt-1.5 max-w-2xl">
            Explorá todos los lotes textiles clasificados listos para despacho. Filtrá por rubro, calidad o busques por marcas específicas.
          </p>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === 'all'
                ? 'bg-[#c40506] text-white border-[#c40506] shadow-sm'
                : 'bg-white text-[#686257] hover:text-[#19150b] border-[#e7e0d2]'
            }`}
          >
            Todos los Fardos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat.slug
                  ? 'bg-[#c40506] text-white border-[#c40506] shadow-sm'
                  : 'bg-white text-[#686257] hover:text-[#19150b] border-[#e7e0d2]'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Filters and Search Toolbar */}
        <div className="bg-white border border-[#e7e0d2] p-4 rounded-2xl mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#686257] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por lote, prendas o marcas (Levi's, Nike, buzos...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#19150b] placeholder-[#686257] focus:outline-none focus:border-[#c40506] transition-colors"
            />
          </div>

          {/* Quality Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs text-[#686257] font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Calidad:
            </span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'premium', label: 'Premium' },
              { id: 'primera', label: '1ª Selección' },
              { id: 'original', label: 'Original' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedQuality(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedQuality === tab.id
                    ? 'bg-[#19150b] text-white shadow-sm'
                    : 'bg-[#f8f5ec] text-[#686257] hover:text-[#19150b] border border-[#e7e0d2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#686257] font-semibold whitespace-nowrap flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Ordenar:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-lg px-3 py-2 text-xs text-[#19150b] focus:outline-none focus:border-[#c40506]"
            >
              <option value="popular">Más destacados</option>
              <option value="price-asc">Menor precio (ARS)</option>
              <option value="price-desc">Mayor precio (ARS)</option>
              <option value="weight">Menor peso (kg)</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between text-xs text-[#686257]">
          <span className="flex items-center gap-2">
            Mostrando <strong className="text-[#19150b]">{products.length}</strong> fardos disponibles
            {(loading || isPending) && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c40506]" />}
          </span>
          {(selectedCategory !== 'all' || selectedQuality !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedQuality('all');
                setSearchQuery('');
              }}
              className="text-[#c40506] hover:underline font-semibold"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => handleAddToCart(p, 1)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e7e0d2] rounded-2xl p-16 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <Package className="w-12 h-12 text-[#d1c9ba] mx-auto" />
            <h3 className="font-serif-heading font-bold text-lg text-[#19150b]">
              No encontramos lotes con esos criterios
            </h3>
            <p className="text-xs text-[#686257]">
              Probá seleccionando otra categoría o cambiando el término de búsqueda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedQuality('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-[#c40506] hover:bg-[#a80405] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm"
            >
              Ver todos los fardos
            </button>
          </div>
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
