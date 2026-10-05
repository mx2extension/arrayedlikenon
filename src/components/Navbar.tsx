'use client';

import Link from 'next/link';
import { useCart } from '../lib/cart-context';
import { useState } from 'react';

export default function Navbar() {
  const { count, dispatch } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/#map', label: 'The Map' },
    { href: '/house', label: 'The House' },
    { href: '/collections', label: 'Collections' },
    { href: '/atelier', label: 'The Atelier' },
    { href: '/archive', label: 'The Archive' },
    { href: '/journal', label: 'Journal' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f5f2ea]/90 backdrop-blur-md border-b border-black/10">
      <div className="px-[5vw] py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif-aln font-light tracking-[0.2em] text-sm text-[#151515] group-hover:opacity-70">
            A L N
          </span>
          <img
            src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787826175/ChatGPT_Image_Aug_27_2026_11_10_03_AM_txadns.png"
            alt="ALN Logo"
            className="h-5 w-auto object-contain mix-blend-multiply group-hover:opacity-70 transition"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[9px] tracking-[0.2em] uppercase text-[#151515]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-50 transition">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DRAWER' })}
            className="relative text-[9px] tracking-[0.2em] uppercase hover:opacity-50 transition"
          >
            Cart{count > 0 && <span className="ml-1">({count})</span>}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[9px] tracking-[0.2em] uppercase"
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#f5f2ea] border-t border-black/10 px-[5vw] py-6 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-[10px] tracking-[0.2em] uppercase text-[#151515]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}