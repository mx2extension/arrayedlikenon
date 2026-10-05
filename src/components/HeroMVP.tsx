// File: src/components/HeroMVP.tsx
'use client';

import Link from 'next/link';
import { Cormorant_Garamond, Caveat } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500'],
});

export default function HeroMVP() {
  return (
    <section className="relative w-full min-h-screen bg-[#f5f2ea] flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none">
      
      {/* Background SVG Grid & Line Vector Blueprint */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Vertical Grid Lines */}
          <line x1="15%" y1="0" x2="15%" y2="100%" stroke="#151515" strokeWidth="0.5" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#151515" strokeWidth="0.5" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#151515" strokeWidth="0.5" />
          <line x1="66%" y1="0" x2="66%" y2="100%" stroke="#151515" strokeWidth="0.5" />
          <line x1="85%" y1="0" x2="85%" y2="100%" stroke="#151515" strokeWidth="0.5" />

          {/* Organic Vector Wave Lines */}
          <path
            d="M 100 200 Q 300 100, 600 250 T 1200 180"
            fill="none"
            stroke="#151515"
            strokeWidth="0.75"
          />
          <path
            d="M 50 450 Q 400 300, 800 480 T 1400 350"
            fill="none"
            stroke="#151515"
            strokeWidth="0.75"
          />

          {/* Blueprint Nodes/Circles */}
          <circle cx="30%" cy="22%" r="4" fill="none" stroke="#151515" strokeWidth="1" />
          <circle cx="66%" cy="18%" r="4" fill="none" stroke="#151515" strokeWidth="1" />
          <circle cx="40%" cy="75%" r="5" fill="none" stroke="#151515" strokeWidth="1" />
        </svg>
      </div>

      {/* Top Section */}
      <div className="relative z-10 w-full flex justify-between items-start pt-16">
        <Link href="/house" className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] hover:opacity-50 transition">
          <span className="w-2 h-2 rounded-full border border-black flex items-center justify-center text-[6px]">⊙</span>
          THE HOUSE
        </Link>

        <div className="text-right">
          <span className={`${caveat.className} text-xl text-neutral-800 -rotate-6 block mb-1`}>
            begin here ↗
          </span>
          <Link href="/collections" className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] hover:opacity-50 transition">
            <span className="w-2 h-2 rounded-full border border-black flex items-center justify-center text-[6px]">⊙</span>
            COLLECTIONS
          </Link>
        </div>
      </div>

      {/* Main Serif Headline Stack */}
      <div className="relative z-10 my-auto text-center py-6">
        <h1 className={`${cormorant.className} text-5xl sm:text-7xl md:text-[90px] lg:text-[110px] font-light tracking-[0.08em] leading-[0.9] uppercase`}>
          ARRAYED
        </h1>
        <h1 className={`${cormorant.className} text-5xl sm:text-7xl md:text-[90px] lg:text-[110px] font-light tracking-[0.08em] leading-[0.9] uppercase mt-2`}>
          LIKE NONE
        </h1>
        
        {/* Monogram Spacer */}
        <div className="mt-6">
          <p className={`${cormorant.className} text-xl sm:text-2xl tracking-[0.6em] font-light uppercase pl-[0.6em]`}>
            A L N
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Left Callout */}
        <div className="space-y-3 max-w-xs">
          <p className="font-mono text-[9px] leading-relaxed opacity-70 tracking-wide">
            A house of form, distinction and quiet confidence.
          </p>
          <div className="flex items-center gap-3">
            <p className={`${caveat.className} text-lg text-neutral-800`}>
              drawn by hand / 01
            </p>
            <Link href="/atelier" className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.2em] hover:opacity-50 transition">
              <span className="w-2 h-2 rounded-full border border-black flex items-center justify-center text-[5px]">⊙</span>
              ATELIER
            </Link>
          </div>
        </div>

        {/* Center Text */}
        <div className="text-center">
          <span className={`${caveat.className} text-lg text-neutral-800 block`}>
            follow the line
          </span>
        </div>

        {/* Right Nav Link */}
        <div className="flex justify-end">
          <Link href="/archive" className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] hover:opacity-50 transition">
            <span className="w-2 h-2 rounded-full border border-black flex items-center justify-center text-[6px]">⊙</span>
            ARCHIVE
          </Link>
        </div>
      </div>

    </section>
  );
}