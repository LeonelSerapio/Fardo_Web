'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogIn, Loader2 } from 'lucide-react';
import { AuthUser } from '@/types';

export const LoginFormClient: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo iniciar sesión.');
      }

      const user = json.data.user as AuthUser;
      router.push(user.role === 'admin' ? '/admin' : '/cuenta');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ec] text-[#19150b] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#e7e0d2] rounded-3xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#686257] hover:text-[#c40506]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al catálogo
          </Link>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold tracking-tight">
            Ingresar a Fardo Club
          </h1>
          <p className="text-sm text-[#686257]">
            Accedé a tu historial de pedidos mayoristas y datos de despacho.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@negocio.com"
              className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c40506]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#686257]">
              Contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#f8f5ec] border border-[#e7e0d2] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c40506]"
            />
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
          </button>
        </form>

        <p className="text-xs text-center text-[#686257]">
          ¿Todavía no tenés cuenta?{' '}
          <Link href="/registro" className="font-bold text-[#c40506] hover:underline">
            Creá tu cuenta mayorista
          </Link>
        </p>
      </div>
    </div>
  );
};
