import type { Metadata } from 'next';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Panel Admin | Fardo Club Argentina',
  description: 'Gestión de stock real, drops semanales y pedidos mayoristas conectados a Neon.',
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
