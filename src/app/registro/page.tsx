import type { Metadata } from 'next';
import { RegisterFormClient } from '@/components/auth/RegisterFormClient';

export const metadata: Metadata = {
  title: 'Crear Cuenta Mayorista | Fardo Club Argentina',
  description: 'Registrate en Fardo Club para guardar tus pedidos mayoristas y datos de envío.',
};

export default function RegisterPage() {
  return <RegisterFormClient />;
}
