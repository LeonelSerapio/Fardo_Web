'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';

export const RegisterFormClient: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    phone: '',
    shippingCity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo crear la cuenta.');
      }

      router.push('/cuenta');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ec] text-[#19150b] flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg bg-white border border-[#e7e0d2] rounded-3xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#686257] hover:text-[#c40506]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al catálogo
          </Link>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold tracking-tight">
            Crear Cuenta Mayorista
          </h1>
          <p className="text-sm text-[#686257]">
            Guardá tus datos de envío y seguí tus reservas de fardos en tiempo real.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Ej: Carolina Benítez"
                className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c40506]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                Email *
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@negocio.com"
                className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c40506]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                Contraseña * (mínimo 8 caracteres)
              </label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c40506]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                Local / Emprendimiento
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                placeholder="Ej: Vintage Garage"
                className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c40506]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                WhatsApp
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Ej: 11 2345 6789"
                className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c40506]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
                Ciudad / Provincia de envío
              </label>
              <input
                type="text"
                value={form.shippingCity}
                onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
                placeholder="Ej: Rosario, Santa Fe"
                className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c40506]"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#c40506] font-medium bg-[#fde8e8] border border-[#fbd0d0] rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#c40506] hover:bg-[#a80405] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            <span>{loading ? 'Creando cuenta...' : 'Crear Cuenta'}</span>
          </button>
        </form>

        <p className="text-xs text-center text-[#686257]">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-bold text-[#c40506] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
