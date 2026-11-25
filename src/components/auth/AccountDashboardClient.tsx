'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  LogOut,
  Package,
  Shield,
  User,
  CheckCircle2,
  Loader2,
  Save,
} from 'lucide-react';
import { AdminOrderRecord, AuthUser, OrderStatus } from '@/types';
import { formatArs } from '@/lib/formatters';

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_confirmation: 'Pendiente de confirmación',
  confirmed: 'Confirmado',
  shipped: 'Despachado',
  cancelled: 'Cancelado',
};

export const AccountDashboardClient: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    shippingCity: '',
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        const me = json.data?.user as AuthUser | null;
        if (!me) {
          router.replace('/login');
          return;
        }
        setUser(me);
        setProfileForm({
          fullName: me.fullName,
          businessName: me.businessName || '',
          phone: me.phone || '',
          shippingCity: me.shippingCity || '',
        });

        const ordersRes = await fetch('/api/account/orders');
        const ordersJson = await ordersRes.json();
        if (ordersJson.success) {
          setOrders(ordersJson.data || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo actualizar tu perfil.');
      }
      setUser(json.data.user);
      setSavedMsg('Datos guardados correctamente.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ec] text-[#19150b] flex items-center justify-center">
        <p className="text-sm text-[#686257]">Cargando tu cuenta...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8f5ec] text-[#19150b]">
      <header className="bg-white border-b border-[#e7e0d2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-[#686257] hover:text-[#c40506] inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Catálogo
            </Link>
            <span className="text-[#e7e0d2]">|</span>
            <h1 className="font-bold text-base">Mi Cuenta</h1>
          </div>

          <div className="flex items-center gap-2">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c40506] text-white text-xs font-bold hover:bg-[#a80405]"
              >
                <Shield className="w-3.5 h-3.5" />
                Panel Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#19150b] text-white text-xs font-medium hover:bg-[#332c1d]"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <section className="lg:col-span-5 bg-white border border-[#e7e0d2] rounded-3xl p-6 space-y-5 h-fit">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#fde8e8] text-[#c40506] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">{user.fullName}</h2>
              <p className="text-xs text-[#686257]">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full mt-1 bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                Local / Emprendimiento
              </label>
              <input
                type="text"
                value={profileForm.businessName}
                onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                placeholder="Ej: Vintage Garage"
                className="w-full mt-1 bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                WhatsApp
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="Ej: 11 2345 6789"
                className="w-full mt-1 bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                Ciudad / Provincia de despacho
              </label>
              <input
                type="text"
                value={profileForm.shippingCity}
                onChange={(e) => setProfileForm({ ...profileForm, shippingCity: e.target.value })}
                placeholder="Ej: Córdoba Capital"
                className="w-full mt-1 bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
              />
            </div>

            {savedMsg && (
              <p className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {savedMsg}
              </p>
            )}
            {errorMsg && <p className="text-xs text-[#c40506] font-medium">{errorMsg}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-[#c40506] hover:bg-[#a80405] disabled:opacity-60 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </form>
        </section>

        {/* Orders History */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-heading text-xl font-bold flex items-center gap-2">
              <Package className="w-5 h-5 text-[#c40506]" />
              Mis Pedidos ({orders.length})
            </h2>
            <Link
              href="/fardos"
              className="text-xs font-bold text-[#c40506] hover:underline"
            >
              Explorar fardos →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-[#e7e0d2] rounded-3xl p-8 text-center space-y-2">
              <p className="font-bold text-sm">Todavía no registraste pedidos con esta cuenta</p>
              <p className="text-xs text-[#686257]">
                Cuando armes un pedido desde el carrito estando logueado, aparecerá acá automáticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#e7e0d2] rounded-2xl p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-mono font-bold text-sm">{order.orderCode}</p>
                      <p className="text-xs text-[#686257]">
                        {new Date(order.createdAt).toLocaleDateString('es-AR')} • {order.totalWeightKg} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f8f5ec] border border-[#e7e0d2]">
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <p className="font-mono font-bold text-sm text-[#c40506] mt-1">
                        {formatArs(order.totalArs)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#f0eae0] pt-2 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs text-[#686257]">
                        <span>
                          {item.quantity}x {item.fardoTitleSnapshot}
                        </span>
                        <span className="font-mono">{formatArs(item.subtotalArs)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
