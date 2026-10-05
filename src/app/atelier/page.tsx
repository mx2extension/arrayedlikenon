import React from 'react';
import Link from 'next/link';

export default function AtelierPage() {
  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 px-[5vw] pb-20">
      <header className="fixed top-0 left-0 w-full z-50 bg-[#f5f2ea]/90 backdrop-blur-md border-b border-black/10 px-[5vw] py-5 flex items-center justify-between">
        <Link href="/" className="font-serif-aln font-light tracking-[0.2em] text-sm hover:opacity-70">A L N</Link>
        <nav className="flex items-center gap-6 text-[9px] tracking-[0.2em] uppercase">
          <Link href="/#map" className="hover:opacity-50">The Map</Link>
          <Link href="/house" className="hover:opacity-50">The House</Link>
          <Link href="/collections" className="hover:opacity-50">Collections</Link>
          <Link href="/atelier" className="underline">The Atelier</Link>
          <Link href="/archive" className="hover:opacity-50">The Archive</Link>
          <Link href="/journal" className="hover:opacity-50">Journal</Link>
        </nav>
      </header>

      <main className="max-w-[1250px] mx-auto space-y-16">
        <div className="space-y-4 border-b border-black/20 pb-12">
          <div className="text-[9px] tracking-[0.24em] uppercase">04 / Craft & Process</div>
          <h1 className="font-serif-aln font-light text-[clamp(60px,10vw,140px)] leading-[0.75] tracking-[-0.06em]">
            THE ATELIER
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "MATERIAL SELECTION", text: "Sourced from small-batch mills with an emphasis on tactile weight, raw textures, and longevity.", img: "https://res.cloudinary.com/vhdlwici/image/upload/f_auto,q_auto/ALN-08_hoodie_army-green_serries_II" },
            { step: "02", title: "PATTERN DRAFTING", text: "Constructed through 3D draping and traditional flat drafting to establish unique dynamic movement.", img: "https://res.cloudinary.com/vhdlwici/image/upload/v1788340969/ALN-05_jacket_black.png" },
            { step: "03", title: "HAND FINISHING", text: "Every internal seam, edge, and closure is finished individually by master craftsmen.", img: "https://res.cloudinary.com/vhdlwici/image/upload/v1788341004/ALN-01_BODY_HUGGED_T-SHIRT.png" }
          ].map((item, idx) => (
            <div key={idx} className="space-y-4">
              <div className="aspect-[4/5] bg-neutral-300 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-black/50">Phase {item.step}</div>
              <h2 className="font-serif-aln text-xl tracking-[0.05em]">{item.title}</h2>
              <p className="text-[10px] leading-[1.7] opacity-80">{item.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}