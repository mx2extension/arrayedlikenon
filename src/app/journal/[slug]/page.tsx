import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import { JournalEntry } from '../../../lib/types';

export const revalidate = 60;

export default async function JournalEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: entry } = await supabase.from('journal_entries').select('*').eq('slug', slug).eq('is_published', true).single();
  if (!entry) notFound();
  const j = entry as JournalEntry;
  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <main className="max-w-[800px] mx-auto">
        <div className="border-b border-black/20 pb-8 flex justify-between items-start mb-12">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase">Journal / {j.date || ''}</div>
            <h1 className="font-serif-aln font-light text-[clamp(40px,6vw,80px)] leading-[0.8] tracking-[-0.04em] mt-2">{j.title}</h1>
          </div>
          <Link href="/journal" className="text-[9px] tracking-[0.18em] uppercase hover:underline pt-2">← Journal</Link>
        </div>
        {j.cover_image && <div className="aspect-[16/9] bg-neutral-300 overflow-hidden mb-12"><img src={j.cover_image} alt={j.title} className="w-full h-full object-cover grayscale mix-blend-multiply" /></div>}
        {j.content && <div className="font-serif-aln text-lg leading-[1.8] opacity-80 whitespace-pre-line">{j.content}</div>}
      </main>
    </div>
  );
}