import type { Metadata } from 'next';
import { Cormorant_Garamond, Caveat, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../lib/cart-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const handwritten = Caveat({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-handwriting',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'ARRAYED LIKE NONE',
  description: 'A house of form, distinction and quiet confidence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${serif.variable} ${handwritten.variable} ${sans.variable}`}
    >
      <body className="bg-[#f5f2ea] text-[#151515] font-sans relative selection:bg-[#151515] selection:text-[#f5f2ea] overflow-x-hidden">
        <div
          className="fixed inset-0 pointer-events-none z-[100] opacity-20 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.045'/%3E%3C/svg%3E")`,
          }}
        />
        <CartProvider>
          <Navbar />
          <CartDrawer />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}