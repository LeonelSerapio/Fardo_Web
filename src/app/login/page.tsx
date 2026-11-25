import type { Metadata } from 'next';
import { LoginFormClient } from '@/components/auth/LoginFormClient';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Fardo Club Argentina',
  description: 'Ingresá a tu cuenta mayorista de Fardo Club para ver tus pedidos y datos de despacho.',
};

export default function LoginPage() {
  return <LoginFormClient />;
}
