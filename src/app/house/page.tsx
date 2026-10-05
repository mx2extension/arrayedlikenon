// app/house/page.tsx
import React from 'react';
import Link from 'next/link';

export default function HousePage() {
  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 px-[5vw] pb-20">
      <header className="fixed top-0 left-0 w-full z-50 bg-[#f5f2ea]/90 backdrop-blur-md border-b border-black/10 px-[5vw] py-5 flex items-center justify-between">
        <Link href="/" className="font-serif-aln font-light tracking-[0.2em] text-sm hover:opacity-70">A L N</Link>
        <nav className="flex items-center gap-6 text-[9px] tracking-[0.2em] uppercase">
          <Link href="/#map" className="hover:opacity-50">The Map</Link>
          <Link href="/house" className="underline">The House</Link>
          <Link href="/collections" className="hover:opacity-50">Collections</Link>
          <Link href="/atelier" className="hover:opacity-50">The Atelier</Link>
          <Link href="/archive" className="hover:opacity-50">The Archive</Link>
          <Link href="/journal" className="hover:opacity-50">Journal</Link>
        </nav>
      </header>

      <main className="max-w-[1200px] mx-auto space-y-24">
        <div className="space-y-4">
          <div className="text-[9px] tracking-[0.24em] uppercase">02 / Philosophy</div>
          <h1 className="font-serif-aln font-light text-[clamp(60px,10vw,140px)] leading-[0.75] tracking-[-0.06em]">
            THE HOUSE
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-t border-black/20 pt-12">
          <p className="font-serif-aln text-3xl leading-[1.2]">
            Beauty without comparison. ALN creates pieces that do not ask to belong. They belong to themselves.
          </p>
          <div className="space-y-6 text-[11px] leading-[1.8] opacity-80">
            <p>
              Founded on the principles of quiet structure and deliberate restraint, Arrayed Like None operates outside the cycle of seasonal urgency.
            </p>
            <p>
              Every garment represents an exercise in subtraction—removing the noise of traditional ornamentation until only pure form, distinction, and presence remain.
            </p>
          </div>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src="https://res.cloudinary.com/vhdlwici/image/upload/v1788347593/ALN-09.png" 
            alt="The House of ALN" 
            className="w-full h-full object-cover"
          />
        </div>
      </main>
    </div>
  );
}