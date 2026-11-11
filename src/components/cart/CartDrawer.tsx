'use client';

import React from 'react';
import { FardoProduct } from '@/types';
import { formatArs } from '@/lib/formatters';
import { X, Trash2, MessageCircle, Scale, Layers, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartItem {
  product: FardoProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (!isOpen) return null;

  const totalKg = items.reduce((sum, item) => sum + item.product.weightKg * item.quantity, 0);
  const totalMinUnits = items.reduce(
    (sum, item) => sum + item.product.estimatedUnitsMin * item.quantity,
    0
  );
  const totalMaxUnits = items.reduce(
    (sum, item) => sum + item.product.estimatedUnitsMax * item.quantity,
    0
  );
  const totalPriceArs = items.reduce(
    (sum, item) => sum + item.product.priceArs * item.quantity,
    0
  );

  const orderLines = items.map(
    (i) => `• ${i.quantity}x ${i.product.title} (${i.product.weightKg}kg) = ${formatArs(i.product.priceArs * i.quantity)}`
  );

  const whatsappMessage = encodeURIComponent(
    `Hola Fardo Club, quiero confirmar el siguiente pedido mayorista:\n\n${orderLines.join(
      '\n'
    )}\n\n*Total estimado:* ${formatArs(totalPriceArs)} ARS\n*Peso total:* ${totalKg} kg (~${totalMinUnits}-${totalMaxUnits} prendas)\n\n¿Me indican los datos para coordinar el pago por transferencia y despacho?`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-950 border-l border-stone-800 text-stone-100 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-black text-lg text-stone-100">Mi Pedido Mayorista</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
              aria-label="Cerrar pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-700 mx-auto" />
                <p className="font-bold text-sm text-stone-300">Tu pedido está vacío</p>
                <p className="text-xs text-stone-500">
                  Elegí fardos en el catálogo para armar tu cotización con peso y prendas estimadas.
                </p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-100 line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {product.weightKg} kg • ~{product.estimatedUnitsMin}-{product.estimatedUnitsMax} prendas
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                        className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-stone-100 w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            product.id,
                            Math.min(product.availableStock, quantity + 1)
                          )
                        }
                        className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-black text-sm text-amber-400">
                      {formatArs(product.priceArs * quantity)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-stone-900/95 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-500" /> Peso Total del Envío:
                  </span>
                  <strong className="text-stone-100">{totalKg} kg</strong>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> Prendas Estimadas:
                  </span>
                  <strong className="text-stone-100">~{totalMinUnits} a {totalMaxUnits} prendas</strong>
                </div>

                <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline">
                  <span className="font-bold text-stone-200 uppercase text-xs">Total Mayorista:</span>
                  <span className="text-2xl font-black text-amber-400">
                    {formatArs(totalPriceArs)}
                  </span>
                </div>
              </div>

              <a
                href={`https://wa.me/5491112345678?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmar Pedido por WhatsApp</span>
              </a>

              <p className="text-[10px] text-center text-stone-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Factura A/B • Envíos asegurados a toda Argentina</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
