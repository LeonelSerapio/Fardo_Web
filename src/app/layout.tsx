import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fardo Club Argentina | Venta Mayorista de Fardos de Ropa',
  description:
    'E-commerce mayorista B2B de fardos de ropa vintage, circular y de primera selección en Argentina. Precios transparentes en ARS, kilos verificados y despacho a todo el país.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
        {children}
      </body>
    </html>
  );
}
