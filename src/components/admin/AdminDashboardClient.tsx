'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Flame,
  ShoppingBag,
  Lock,
  LogOut,
  RefreshCw,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  History,
  Trash2,
} from 'lucide-react';
import {
  AdminOrderRecord,
  DropItem,
  DropStatus,
  FardoProduct,
  OrderStatus,
  QualityTierId,
  StockMovementItem,
} from '@/types';

type TabId = 'stock' | 'drops' | 'orders';

const DROP_STATUS_LABELS: Record<DropStatus, string> = {
  draft: 'Borrador',
  scheduled: 'Programado',
  live: 'En vivo',
  ended: 'Finalizado',
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_confirmation: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Despachado',
  cancelled: 'Cancelado',
};

function formatArs(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

export const AdminDashboardClient: React.FC = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [databaseConfigured, setDatabaseConfigured] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>('stock');
  const [loading, setLoading] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const [fardos, setFardos] = useState<FardoProduct[]>([]);
  const [movements, setMovements] = useState<StockMovementItem[]>([]);
  const [drops, setDrops] = useState<DropItem[]>([]);
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);

  // Stock adjustment form state
  const [selectedFardoId, setSelectedFardoId] = useState('');
  const [adjustType, setAdjustType] = useState<'restock' | 'adjustment' | 'sale' | 'release'>('restock');
  const [adjustDelta, setAdjustDelta] = useState('5');
  const [adjustNote, setAdjustNote] = useState('');

  // New Fardo form state
  const [showNewFardo, setShowNewFardo] = useState(false);
  const [newFardo, setNewFardo] = useState({
    title: '',
    category: 'vintage' as FardoProduct['category'],
    quality: 'premium' as QualityTierId,
    weightKg: 25,
    estimatedUnitsMin: 45,
    estimatedUnitsMax: 60,
    priceArs: 220000,
    availableStock: 3,
    dropId: '',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    highlights: 'Selección curada, Listo para reventa',
  });

  // New Drop form state
  const [newDrop, setNewDrop] = useState({
    title: '',
    description: '',
    status: 'scheduled' as DropStatus,
    startsAt: '',
    endsAt: '',
    isFeatured: true,
  });

  const adminFetch = useCallback(async <T,>(url: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Error HTTP ${res.status}`);
    }
    return json.data as T;
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setBannerMsg(null);
    try {
      const [fardosData, movementsData, dropsData, ordersData] = await Promise.all([
        adminFetch<FardoProduct[]>('/api/admin/fardos'),
        adminFetch<StockMovementItem[]>('/api/admin/stock?limit=30'),
        adminFetch<DropItem[]>('/api/admin/drops'),
        adminFetch<AdminOrderRecord[]>('/api/admin/orders'),
      ]);
      setFardos(fardosData);
      setMovements(movementsData);
      setDrops(dropsData);
      setOrders(ordersData);
      if (fardosData.length > 0 && !selectedFardoId) {
        setSelectedFardoId(fardosData[0].id);
      }
    } catch (err: unknown) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al cargar datos de Neon.',
      });
    } finally {
      setLoading(false);
    }
  }, [adminFetch, selectedFardoId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/auth');
        const json = await res.json();
        if (json.success) {
          setAuthenticated(Boolean(json.data.authenticated));
          setDatabaseConfigured(Boolean(json.data.databaseConfigured));
        }
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (authenticated && databaseConfigured) {
      loadAllData();
    }
  }, [authenticated, databaseConfigured, loadAllData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const data = await adminFetch<{ authenticated: boolean; databaseConfigured: boolean }>(
        '/api/admin/auth',
        {
          method: 'POST',
          body: JSON.stringify({ secret: secretInput }),
        }
      );
      setAuthenticated(data.authenticated);
      setDatabaseConfigured(data.databaseConfigured);
      setSecretInput('');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Error de autenticación.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setAuthenticated(false);
  };

  const handleQuickStock = async (fardoId: string, delta: number) => {
    setBannerMsg(null);
    try {
      await adminFetch('/api/admin/stock', {
        method: 'POST',
        body: JSON.stringify({
          fardoId,
          type: delta > 0 ? 'restock' : 'adjustment',
          quantityDelta: delta,
          note: delta > 0 ? `Reposición rápida (+${delta})` : `Ajuste rápido (${delta})`,
        }),
      });
      setBannerMsg({ type: 'success', text: 'Stock actualizado en transacción atómica.' });
      await loadAllData();
    } catch (err: unknown) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'No se pudo ajustar el stock.',
      });
    }
  };

  const handleAdjustStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFardoId) return;
    setBannerMsg(null);
    const parsedDelta = parseInt(adjustDelta, 10);
    if (Number.isNaN(parsedDelta) || parsedDelta === 0) {
      setBannerMsg({ type: 'error', text: 'Ingresá una cantidad entera distinta de 0.' });
      return;
    }

    try {
      await adminFetch('/api/admin/stock', {
        method: 'POST',
        body: JSON.stringify({
          fardoId: selectedFardoId,
          type: adjustType,
          quantityDelta: parsedDelta,
          note: adjustNote.trim() || undefined,
        }),
      });
      setAdjustNote('');
      setBannerMsg({ type: 'success', text: 'Movimiento de stock registrado en Neon.' });
      await loadAllData();
    } catch (err: unknown) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al registrar movimiento.',
      });
    }
  };

  const handleCreateFardo = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerMsg(null);
    try {
      await adminFetch('/api/admin/fardos', {
        method: 'POST',
        body: JSON.stringify({
          ...newFardo,
          dropId: newFardo.dropId || null,
          highlights: newFardo.highlights
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      setShowNewFardo(false);
      setNewFardo((prev) => ({ ...prev, title: '' }));
      setBannerMsg({ type: 'success', text: 'Fardo creado y stock inicial registrado.' });
      await loadAllData();
    } catch (err: unknown) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al crear fardo.',
      });
    }
  };

  const handleAssignDrop = async (fardoId: string, dropId: string) => {
    setBannerMsg(null);
    try {
      await adminFetch(`/api/admin/fardos/${fardoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ dropId: dropId || null, isNewDrop: Boolean(dropId) }),
      });
      setBannerMsg({ type: 'success', text: 'Asignación de drop actualizada.' });
      await loadAllData();
    } catch (err: unknown) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al asignar drop.',
      });
    }
  };

  const handleCreateDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerMsg(null);
    try {
      await adminFetch('/api/admin/drops', {
        method: 'POST',
        body: JSON.stringify({
          ...newDrop,
          startsAt: newDrop.startsAt ? new Date(newDrop.startsAt).toISOString() : null,
          endsAt: newDrop.endsAt ? new Date(newDrop.endsAt).toISOString() : null,
        }),
      });
      setNewDrop({
        title: '',
        description: '',
        status: 'scheduled',
        startsAt: '',
        endsAt: '',
        isFeatured: true,
      });
      setBannerMsg({ type: 'success', text: 'Drop creado correctamente.' });
      await loadAllData();
    } catch (err: unknown) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al crear el drop.',
      });
    }
  };

  const handleUpdateDropStatus = async (dropId: string, status: DropStatus) => {
    setBannerMsg(null);
    try {
      await adminFetch(`/api/admin/drops/${dropId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setBannerMsg({ type: 'success', text: `Estado del drop actualizado a "${DROP_STATUS_LABELS[status]}".` });
      await loadAllData();
    } catch (err: unknown) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al actualizar estado del drop.',
      });
    }
  };

  const handleDeleteDrop = async (dropId: string) => {
    setBannerMsg(null);
    try {
      await adminFetch(`/api/admin/drops/${dropId}`, { method: 'DELETE' });
      setBannerMsg({ type: 'success', text: 'Drop eliminado.' });
      await loadAllData();
    } catch (err: unknown) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al eliminar drop.',
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setBannerMsg(null);
    try {
      await adminFetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setBannerMsg({
        type: 'success',
        text: `Pedido actualizado a "${ORDER_STATUS_LABELS[status]}" (stock sincronizado).`,
      });
      await loadAllData();
    } catch (err: unknown) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al actualizar pedido.',
      });
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f8f5ec] text-[#19150b] flex items-center justify-center">
        <p className="text-sm text-[#686257]">Verificando sesión de administrador...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#f8f5ec] text-[#19150b] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-[#e7e0d2] rounded-3xl p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#fde8e8] text-[#c40506] flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Panel de Administración</h1>
            <p className="text-sm text-[#686257]">
              Ingresá tu <code className="bg-[#f8f5ec] px-1.5 py-0.5 rounded">ADMIN_SECRET</code> para gestionar stock real, drops y pedidos en Neon.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder="ADMIN_SECRET"
              required
              className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c40506]"
            />
            {authError && (
              <p className="text-xs text-[#c40506] font-medium">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#c40506] hover:bg-[#a80405] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              Ingresar al Panel
            </button>
          </form>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#686257] hover:text-[#19150b]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ec] text-[#19150b]">
      {/* Header */}
      <header className="bg-white border-b border-[#e7e0d2] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-medium text-[#686257] hover:text-[#19150b] inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Tienda
            </Link>
            <span className="text-[#e7e0d2]">|</span>
            <h1 className="font-bold text-base sm:text-lg tracking-tight">
              Fardo Club — Admin Neon
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              disabled={loading || !databaseConfigured}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e7e0d2] text-xs font-medium hover:bg-[#f8f5ec] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#19150b] text-white text-xs font-medium hover:bg-[#332c1d]"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {!databaseConfigured && (
          <div className="bg-amber-50 border border-amber-300 text-amber-950 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-bold">Falta conectar Neon (`DATABASE_URL` vacía en `.env.local`)</p>
              <p className="text-xs text-amber-900">
                Pegá tu connection string de Neon en <code>.env.local</code>, ejecutá{' '}
                <code>npm run db:push</code> y <code>npm run db:seed</code>, y reiniciá el servidor.
              </p>
            </div>
          </div>
        )}

        {bannerMsg && (
          <div
            className={`rounded-2xl p-4 text-sm flex items-center gap-2 border ${
              bannerMsg.type === 'error'
                ? 'bg-[#fde8e8] border-[#fbd0d0] text-[#c40506]'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {bannerMsg.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{bannerMsg.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#e7e0d2] pb-3">
          <button
            onClick={() => setActiveTab('stock')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'stock'
                ? 'bg-[#c40506] text-white'
                : 'bg-white border border-[#e7e0d2] text-[#686257] hover:text-[#19150b]'
            }`}
          >
            <Package className="w-4 h-4" />
            Stock Real ({fardos.length})
          </button>
          <button
            onClick={() => setActiveTab('drops')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'drops'
                ? 'bg-[#c40506] text-white'
                : 'bg-white border border-[#e7e0d2] text-[#686257] hover:text-[#19150b]'
            }`}
          >
            <Flame className="w-4 h-4" />
            Drops ({drops.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#c40506] text-white'
                : 'bg-white border border-[#e7e0d2] text-[#686257] hover:text-[#19150b]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Pedidos ({orders.length})
          </button>
        </div>

        {/* TAB 1: STOCK REAL */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Inventario de Fardos</h2>
              <button
                onClick={() => setShowNewFardo((v) => !v)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#19150b] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#332c1d]"
              >
                <Plus className="w-4 h-4" />
                Nuevo Fardo
              </button>
            </div>

            {showNewFardo && (
              <form
                onSubmit={handleCreateFardo}
                className="bg-white border border-[#e7e0d2] rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <input
                  required
                  placeholder="Título del fardo"
                  value={newFardo.title}
                  onChange={(e) => setNewFardo({ ...newFardo, title: e.target.value })}
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm sm:col-span-2"
                />
                <select
                  value={newFardo.category}
                  onChange={(e) =>
                    setNewFardo({ ...newFardo, category: e.target.value as FardoProduct['category'] })
                  }
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
                >
                  <option value="vintage">Vintage</option>
                  <option value="temporada">Temporada</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="ninos">Niños</option>
                </select>
                <select
                  value={newFardo.quality}
                  onChange={(e) =>
                    setNewFardo({ ...newFardo, quality: e.target.value as QualityTierId })
                  }
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
                >
                  <option value="premium">Premium</option>
                  <option value="primera">Primera</option>
                  <option value="original">Original</option>
                </select>
                <input
                  type="number"
                  min={1}
                  required
                  placeholder="Peso (kg)"
                  value={newFardo.weightKg}
                  onChange={(e) => setNewFardo({ ...newFardo, weightKg: Number(e.target.value) })}
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min={0}
                  required
                  placeholder="Precio ARS"
                  value={newFardo.priceArs}
                  onChange={(e) => setNewFardo({ ...newFardo, priceArs: Number(e.target.value) })}
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min={0}
                  required
                  placeholder="Stock inicial"
                  value={newFardo.availableStock}
                  onChange={(e) =>
                    setNewFardo({ ...newFardo, availableStock: Number(e.target.value) })
                  }
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
                />
                <select
                  value={newFardo.dropId}
                  onChange={(e) => setNewFardo({ ...newFardo, dropId: e.target.value })}
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
                >
                  <option value="">Sin Drop asignado</option>
                  {drops.map((d) => (
                    <option key={d.id} value={d.id}>
                      Drop: {d.title}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="URL de imagen"
                  value={newFardo.image}
                  onChange={(e) => setNewFardo({ ...newFardo, image: e.target.value })}
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
                />
                <input
                  placeholder="Highlights (separados por coma)"
                  value={newFardo.highlights}
                  onChange={(e) => setNewFardo({ ...newFardo, highlights: e.target.value })}
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm sm:col-span-2"
                />
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-[#c40506] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#a80405]"
                >
                  Guardar Fardo
                </button>
              </form>
            )}

            {/* Fardos Table */}
            <div className="bg-white border border-[#e7e0d2] rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f8f5ec] border-b border-[#e7e0d2] text-xs uppercase text-[#686257]">
                  <tr>
                    <th className="px-4 py-3">Fardo</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Disponible</th>
                    <th className="px-4 py-3">Reservado</th>
                    <th className="px-4 py-3">Drop</th>
                    <th className="px-4 py-3 text-right">Ajuste Rápido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e0d2]">
                  {fardos.map((f) => (
                    <tr key={f.id} className="hover:bg-[#fdfbf7]">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#19150b]">{f.title}</p>
                        <p className="text-xs text-[#686257]">
                          {f.category} • {f.quality} • {f.weightKg} kg
                        </p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{formatArs(f.priceArs)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            f.availableStock === 0
                              ? 'bg-[#fde8e8] text-[#c40506]'
                              : f.availableStock <= 2
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {f.availableStock} u.
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#686257]">{f.reservedStock ?? 0} u.</td>
                      <td className="px-4 py-3">
                        <select
                          value={f.dropId || ''}
                          onChange={(e) => handleAssignDrop(f.id, e.target.value)}
                          className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-lg px-2 py-1 text-xs"
                        >
                          <option value="">—</option>
                          {drops.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.title}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleQuickStock(f.id, -1)}
                            disabled={f.availableStock <= 0}
                            className="p-1.5 rounded-lg border border-[#e7e0d2] hover:bg-[#fde8e8] disabled:opacity-40"
                            title="Restar 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleQuickStock(f.id, 1)}
                            className="p-1.5 rounded-lg border border-[#e7e0d2] hover:bg-emerald-50"
                            title="Sumar 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleQuickStock(f.id, 5)}
                            className="px-2 py-1 rounded-lg border border-[#e7e0d2] text-xs font-bold hover:bg-emerald-50"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audited Adjustment Form + Movements Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleAdjustStockSubmit}
                className="lg:col-span-5 bg-white border border-[#e7e0d2] rounded-2xl p-6 space-y-4"
              >
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#686257]">
                  Ajuste Manual Auditable
                </h3>
                <select
                  value={selectedFardoId}
                  onChange={(e) => setSelectedFardoId(e.target.value)}
                  className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2.5 text-sm"
                >
                  {fardos.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title} (Stock: {f.availableStock})
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={adjustType}
                    onChange={(e) =>
                      setAdjustType(e.target.value as 'restock' | 'adjustment' | 'sale' | 'release')
                    }
                    className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2.5 text-sm"
                  >
                    <option value="restock">Reposición</option>
                    <option value="adjustment">Ajuste (+/-)</option>
                    <option value="sale">Venta directa (-)</option>
                    <option value="release">Liberación (+)</option>
                  </select>
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(e.target.value)}
                    placeholder="Ej: 5 o -2"
                    className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="Motivo / remito / nota de auditoría"
                  className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#c40506] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#a80405]"
                >
                  Registrar Movimiento
                </button>
              </form>

              <div className="lg:col-span-7 bg-white border border-[#e7e0d2] rounded-2xl p-6 space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#686257] flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Últimos Movimientos de Stock
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {movements.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-3 text-xs border-b border-[#f0eae0] pb-2"
                    >
                      <div>
                        <p className="font-semibold text-[#19150b]">{m.fardoTitle}</p>
                        <p className="text-[#686257]">
                          {m.type} • {m.note || 'Sin nota'}
                        </p>
                      </div>
                      <div className="text-right shrink-0 font-mono">
                        <span
                          className={`font-bold ${
                            m.quantityDelta > 0
                              ? 'text-emerald-700'
                              : m.quantityDelta < 0
                                ? 'text-[#c40506]'
                                : 'text-[#686257]'
                          }`}
                        >
                          {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                        </span>
                        <p className="text-[11px] text-[#686257]">
                          {m.stockBefore} → {m.stockAfter}
                        </p>
                      </div>
                    </div>
                  ))}
                  {movements.length === 0 && (
                    <p className="text-xs text-[#686257]">Todavía no hay movimientos registrados.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DROPS */}
        {activeTab === 'drops' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleCreateDrop}
              className="lg:col-span-5 bg-white border border-[#e7e0d2] rounded-2xl p-6 space-y-4 h-fit"
            >
              <h2 className="font-bold text-base">Crear Nuevo Drop</h2>
              <input
                required
                placeholder="Título (ej: Drop Viernes Vintage 90s)"
                value={newDrop.title}
                onChange={(e) => setNewDrop({ ...newDrop, title: e.target.value })}
                className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2.5 text-sm"
              />
              <textarea
                rows={3}
                placeholder="Descripción del drop..."
                value={newDrop.description}
                onChange={(e) => setNewDrop({ ...newDrop, description: e.target.value })}
                className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2.5 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#686257]">Inicio</label>
                  <input
                    type="datetime-local"
                    value={newDrop.startsAt}
                    onChange={(e) => setNewDrop({ ...newDrop, startsAt: e.target.value })}
                    className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#686257]">Fin</label>
                  <input
                    type="datetime-local"
                    value={newDrop.endsAt}
                    onChange={(e) => setNewDrop({ ...newDrop, endsAt: e.target.value })}
                    className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-xs mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <select
                  value={newDrop.status}
                  onChange={(e) => setNewDrop({ ...newDrop, status: e.target.value as DropStatus })}
                  className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-3 py-2 text-sm"
                >
                  <option value="draft">Borrador</option>
                  <option value="scheduled">Programado</option>
                  <option value="live">En vivo</option>
                  <option value="ended">Finalizado</option>
                </select>
                <label className="inline-flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={newDrop.isFeatured}
                    onChange={(e) => setNewDrop({ ...newDrop, isFeatured: e.target.checked })}
                  />
                  Destacado
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#c40506] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#a80405]"
              >
                Crear Drop
              </button>
            </form>

            <div className="lg:col-span-7 space-y-4">
              {drops.map((d) => (
                <div
                  key={d.id}
                  className="bg-white border border-[#e7e0d2] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base">{d.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#f8f5ec] border border-[#e7e0d2]">
                        {DROP_STATUS_LABELS[d.status]}
                      </span>
                    </div>
                    <p className="text-xs text-[#686257]">{d.description || 'Sin descripción'}</p>
                    <p className="text-xs text-[#686257]">
                      Fardos asignados: <strong>{d.fardoCount ?? 0}</strong> • Suscriptores WhatsApp:{' '}
                      <strong>{d.subscriberCount ?? 0}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={d.status}
                      onChange={(e) => handleUpdateDropStatus(d.id, e.target.value as DropStatus)}
                      className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-lg px-2.5 py-1.5 text-xs font-medium"
                    >
                      <option value="draft">Borrador</option>
                      <option value="scheduled">Programado</option>
                      <option value="live">En vivo</option>
                      <option value="ended">Finalizado</option>
                    </select>
                    <button
                      onClick={() => handleDeleteDrop(d.id)}
                      className="p-2 rounded-lg border border-[#e7e0d2] text-[#686257] hover:text-[#c40506] hover:bg-[#fde8e8]"
                      title="Eliminar drop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {drops.length === 0 && (
                <p className="text-sm text-[#686257]">No hay drops creados todavía.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-[#e7e0d2] rounded-2xl p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono font-bold text-sm">{order.orderCode}</p>
                    <p className="text-xs text-[#686257]">
                      {order.customerName || 'Cliente sin nombre'} • {order.customerPhone || 'Sin tel'} •{' '}
                      {order.shippingCity || 'Sin ciudad'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm">{formatArs(order.totalArs)}</span>
                    <select
                      value={order.status}
                      disabled={order.status === 'cancelled'}
                      onChange={(e) =>
                        handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="bg-[#f8f5ec] border border-[#e7e0d2] rounded-lg px-2.5 py-1.5 text-xs font-semibold disabled:opacity-60"
                    >
                      <option value="pending_confirmation">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="shipped">Despachado</option>
                      <option value="cancelled">Cancelado (libera stock)</option>
                    </select>
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
            {orders.length === 0 && (
              <p className="text-sm text-[#686257]">Todavía no hay pedidos registrados en Neon.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
