'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-24 pb-32 px-[5vw]">
      <div className="max-w-[1250px] mx-auto border-b border-black/20 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-60">
            Legal / Data Protection
          </span>
          <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,130px)] leading-[0.75] tracking-[-0.06em] mt-2">
            PRIVACY
          </h1>
        </div>
        <Link href="/" className="text-[9px] font-mono tracking-[0.2em] uppercase hover:underline mb-2">
          ← Return
        </Link>
      </div>

      <div className="max-w-[900px] mx-auto mt-16 space-y-12 text-sm leading-relaxed opacity-90 font-serif-aln">
        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">01 / Minimal Data Collection</h3>
          <p>
            ALN respects buyer anonymity. We operate on a friction-free guest model—no mandatory user accounts or logins are required to complete an order. We collect only the information strictly necessary to process payments and fulfill dispatch requests.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">02 / Order Tracking Codes</h3>
          <p>
            Order references and tracking codes generated upon checkout serve as key identifiers for your transaction. We do not sell, license, or share transactional metrics with third-party advertising platforms.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-sans text-xs font-mono tracking-[0.2em] uppercase">03 / Newsletter Subscriptions</h3>
          <p>
            If you subscribe to house dispatches, your email address is stored securely solely for communicating studio releases and private collection previews. Unsubscribe options are honored immediately upon request.
          </p>
        </section>
      </div>
    </main>
  );
}