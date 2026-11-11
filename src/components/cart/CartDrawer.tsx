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
        className="absolute inset-0 bg-[#17140f]/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#e7e0d2] text-[#19150b] flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#e7e0d2] bg-[#f8f5ec] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c40506]" />
              <h2 className="font-serif-heading font-bold text-lg text-[#19150b]">Mi Pedido Mayorista</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#686257] hover:text-[#19150b] hover:bg-[#eae3d2] transition-colors"
              aria-label="Cerrar pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#d1c9ba] mx-auto" />
                <p className="font-bold text-sm text-[#19150b]">Tu pedido está vacío</p>
                <p className="text-xs text-[#686257]">
                  Elegí fardos en el catálogo para armar tu cotización con peso y prendas estimadas.
                </p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-[#f8f5ec] border border-[#e7e0d2] p-4 rounded-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-serif-heading font-bold text-xs sm:text-sm text-[#19150b] line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-[#686257] mt-0.5">
                        {product.weightKg} kg • ~{product.estimatedUnitsMin}-{product.estimatedUnitsMax} prendas
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-[#8c8578] hover:text-[#c40506] p-1 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#e7e0d2]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                        className="w-7 h-7 rounded bg-white border border-[#e7e0d2] hover:bg-[#eae3d2] text-[#19150b] font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#19150b] w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            product.id,
                            Math.min(product.availableStock, quantity + 1)
                          )
                        }
                        className="w-7 h-7 rounded bg-white border border-[#e7e0d2] hover:bg-[#eae3d2] text-[#19150b] font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif-heading font-bold text-sm text-[#c40506]">
                      {formatArs(product.priceArs * quantity)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#e7e0d2] bg-[#f8f5ec] space-y-4">
              <div className="space-y-1.5 text-xs text-[#686257]">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#c40506]" /> Peso Total del Envío:
                  </span>
                  <strong className="text-[#19150b]">{totalKg} kg</strong>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#19150b]" /> Prendas Estimadas:
                  </span>
                  <strong className="text-[#19150b]">~{totalMinUnits} a {totalMaxUnits} prendas</strong>
                </div>

                <div className="pt-2 border-t border-[#e7e0d2] flex justify-between items-baseline">
                  <span className="font-bold text-[#19150b] uppercase text-xs">Total Mayorista:</span>
                  <span className="font-serif-heading text-2xl font-black text-[#c40506]">
                    {formatArs(totalPriceArs)}
                  </span>
                </div>
              </div>

              <a
                href={`https://wa.me/5491112345678?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#c40506] hover:bg-[#a80405] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmar Pedido por WhatsApp</span>
              </a>

              <p className="text-[10px] text-center text-[#686257] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c40506]" />
                <span>Factura A/B • Envíos asegurados a toda Argentina</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
