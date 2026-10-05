'use client';

import Link from 'next/link';

export default function PartnersPage() {
  return (
    <main className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-24 pb-32 px-[5vw]">
      <div className="max-w-[1250px] mx-auto border-b border-black/20 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-60">
            The House / Collaboration
          </span>
          <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,130px)] leading-[0.75] tracking-[-0.06em] mt-2">
            PARTNERS
          </h1>
        </div>
        <Link href="/" className="text-[9px] font-mono tracking-[0.2em] uppercase hover:underline mb-2">
          ← Return
        </Link>
      </div>

      <div className="max-w-[1250px] mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <h2 className="font-serif-aln text-3xl">Stockists & Retail Partners</h2>
          <p className="text-xs leading-relaxed opacity-80">
            ALN works with select global galleries, boutiques, and stockists who share our values of architectural form and quiet presentation.
          </p>
          <a
            href="mailto:partners@aln.com"
            className="inline-block border-b border-black text-[9px] font-mono tracking-[0.2em] uppercase pb-1 hover:opacity-60 transition"
          >
            Wholesale & Retail Inquiries ↗
          </a>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif-aln text-3xl">Artistic Collaborations</h2>
          <p className="text-xs leading-relaxed opacity-80">
            We partner with textile artisans, sculptors, and spatial designers on limited studio commissions and exhibition pieces.
          </p>
          <a
            href="mailto:atelier@aln.com"
            className="inline-block border-b border-black text-[9px] font-mono tracking-[0.2em] uppercase pb-1 hover:opacity-60 transition"
          >
            Propose a Project ↗
          </a>
        </div>
      </div>
    </main>
  );
}