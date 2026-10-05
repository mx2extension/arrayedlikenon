import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { JournalEntry } from '@/lib/types';

export const revalidate = 60;

export default async function JournalPage() {
  const { data: entries } = await supabase.from('journal_entries').select('*').eq('is_published', true).order('date', { ascending: false });
  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <main className="max-w-[1250px] mx-auto">
        <div className="border-b border-black/20 pb-8 flex justify-between items-start mb-16">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase">06 / Journal</div>
            <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,140px)] leading-[0.72] tracking-[-0.06em] mt-3">JOURNAL</h1>
          </div>
          <Link href="/" className="text-[9px] tracking-[0.18em] uppercase hover:underline pt-2">← Return Home</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(entries || []).map((entry: JournalEntry) => (
            <Link key={entry.id} href={`/journal/${entry.slug}`} className="group space-y-3 block">
              <div className="aspect-[4/5] bg-neutral-300 overflow-hidden"><img src={entry.cover_image || ''} alt={entry.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
              <div className="text-[8px] tracking-[0.16em] uppercase">Entry / {entry.date || ''}</div>
              <h3 className="font-serif-aln text-2xl">{entry.title}</h3>
              <p className="text-[10px] leading-[1.6] opacity-80">{entry.excerpt}</p>
            </Link>
          ))}
        </div>
        {(!entries || entries.length === 0) && <p className="text-center font-hand-aln text-xl opacity-40 py-20">journal entries coming soon</p>}
      </main>
    </div>
  );
}