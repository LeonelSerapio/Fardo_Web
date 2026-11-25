import type { Metadata } from 'next';
import { AccountDashboardClient } from '@/components/auth/AccountDashboardClient';

export const metadata: Metadata = {
  title: 'Mi Cuenta | Fardo Club Argentina',
  description: 'Gestioná tu perfil mayorista y consultá el estado de tus pedidos de fardos.',
};

export default function AccountPage() {
  return <AccountDashboardClient />;
}
