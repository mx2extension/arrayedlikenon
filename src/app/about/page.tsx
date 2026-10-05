'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-24 pb-32 px-[5vw]">
      <div className="max-w-[1250px] mx-auto border-b border-black/20 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-60">
            The House / Identity
          </span>
          <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,130px)] leading-[0.75] tracking-[-0.06em] mt-2">
            ABOUT US
          </h1>
        </div>
        <Link href="/" className="text-[9px] font-mono tracking-[0.2em] uppercase hover:underline mb-2">
          ← Return
        </Link>
      </div>

      <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mt-16">
        <div className="md:col-span-5 space-y-6">
          <p className="font-serif-aln text-2xl leading-[1.2]">
            Arrayed Like None was founded on a singular premise: beauty without comparison.
          </p>
          <p className="text-xs leading-relaxed opacity-80">
            We operate as an independent house dedicated to form, structure, and quiet confidence. Every piece is developed through thoughtful exploration of silhouettes, material integrity, and spatial movement.
          </p>
          <div className="font-hand-aln text-[22px] italic opacity-80 pt-4">
            drawn by hand / refined in the atelier
          </div>
        </div>

        <div className="md:col-span-7 space-y-8 font-serif-aln text-lg opacity-90 border-t md:border-t-0 md:border-l border-black/20 pt-8 md:pt-0 md:pl-16">
          <p>
            We reject mass repetition in favor of limited, deliberate releases. Our garments do not compete with trends; they remain distinct within their own geometry.
          </p>
          <p>
            Based between Bauchi and worldwide atelier points, ALN unites traditional structural craftsmanship with contemporary lines to deliver pieces crafted to endure.
          </p>
        </div>
      </div>
    </main>
  );
}