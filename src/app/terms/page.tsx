'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-24 pb-32 px-[5vw]">
      <div className="max-w-[1250px] mx-auto border-b border-black/20 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-60">
            Legal / Terms of Service
          </span>
          <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,130px)] leading-[0.75] tracking-[-0.06em] mt-2">
            TERMS
          </h1>
        </div>
        <Link href="/" className="text-[9px] font-mono tracking-[0.2em] uppercase hover:underline mb-2">
          ← Return
        </Link>
      </div>

      <div className="max-w-[900px] mx-auto mt-16 space-y-12 text-sm leading-relaxed opacity-90 font-serif-aln">
        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">01 / Orders & Queue System</h3>
          <p>
            Orders placed on the ALN system are allocated strictly on a payment-first queue basis. Each completed transaction generates a unique order reference code used to track order fulfillment.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">02 / Shipping & Worldwide Fulfillment</h3>
          <p>
            All garments are dispatched from our regional ateliers. Standard lead times range from 3–7 business days depending on release volume and destination.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">03 / Returns & Exchanges</h3>
          <p>
            Due to the limited nature of ALN releases, items must be returned unwashed, unworn, and in original packaging within 14 days of delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">04 / Intellectual Property</h3>
          <p>
            All designs, photography, graphics, and typography rendered across this site remain the exclusive property of ARRAYED LIKE NONE.
          </p>
        </section>
      </div>
    </main>
  );
}