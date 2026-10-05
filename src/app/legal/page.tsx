'use client';

import Link from 'next/link';

export default function LegalPage() {
  return (
    <main className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-24 pb-32 px-[5vw]">
      <div className="max-w-[1250px] mx-auto border-b border-black/20 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-60">
            Legal / House Notice
          </span>
          <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,130px)] leading-[0.75] tracking-[-0.06em] mt-2">
            LEGAL
          </h1>
        </div>
        <Link href="/" className="text-[9px] font-mono tracking-[0.2em] uppercase hover:underline mb-2">
          ← Return
        </Link>
      </div>

      <div className="max-w-[900px] mx-auto mt-16 space-y-12 text-sm leading-relaxed opacity-90 font-serif-aln">
        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">01 / Publisher & Brand Details</h3>
          <p>
            ARRAYED LIKE NONE (ALN) is operated as an independent atelier brand. All operational, commercial, and intellectual rights associated with the identity, product designs, and digital content are strictly reserved.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">02 / Hosting & Technical Operations</h3>
          <p>
            This website is hosted on distributed cloud infrastructure with database operations secured via Supabase services. All customer interactions and tokenized sessions adhere to encrypted transport standards.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">03 / Copyright & Trademarks</h3>
          <p>
            The ALN logotype, mark, garment silhouettes, product nomenclature, and original imagery rendered on this domain are shielded under applicable copyright and international trademark laws. Reproduction without written consent is prohibited.
          </p>
        </section>
      </div>
    </main>
  );
}