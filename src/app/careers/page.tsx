'use client';

import Link from 'next/link';

export default function CareersPage() {
  const roles = [
    { title: 'Atelier Pattern Maker', type: 'Full-time', location: 'Bauchi / On-site' },
    { title: 'Textile & Sourcing Specialist', type: 'Contract', location: 'Remote / Hybrid' },
    { title: 'Digital Media & Visual Designer', type: 'Full-time', location: 'Remote' },
  ];

  return (
    <main className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-24 pb-32 px-[5vw]">
      <div className="max-w-[1250px] mx-auto border-b border-black/20 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-60">
            The House / Opportunities
          </span>
          <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,130px)] leading-[0.75] tracking-[-0.06em] mt-2">
            CAREERS
          </h1>
        </div>
        <Link href="/" className="text-[9px] font-mono tracking-[0.2em] uppercase hover:underline mb-2">
          ← Return
        </Link>
      </div>

      <div className="max-w-[1250px] mx-auto mt-16 space-y-12">
        <p className="font-serif-aln text-2xl max-w-2xl">
          We invite individuals who appreciate patience, exactness, and quiet design to join our growing studio.
        </p>

        <div className="border-t border-black divide-y divide-black/20">
          {roles.map((role, idx) => (
            <div key={idx} className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-serif-aln text-2xl">{role.title}</h3>
                <span className="text-[10px] font-mono tracking-[0.16em] uppercase opacity-60">
                  {role.type} — {role.location}
                </span>
              </div>
              <a
                href="mailto:careers@aln.com"
                className="px-6 py-2 border border-black text-[9px] font-mono tracking-[0.2em] uppercase hover:bg-black hover:text-[#f5f2ea] transition"
              >
                Apply via Email →
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}