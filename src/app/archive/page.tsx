import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArchiveItem } from '@/lib/types';

export const revalidate = 60;

export default async function ArchivePage() {
  const { data: items } = await supabase.from('archive_items').select('*').order('order_index');
  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <main className="max-w-[1250px] mx-auto space-y-12">
        <div className="border-b border-black/20 pb-8 flex justify-between items-start">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase">05 / The Archive</div>
            <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,140px)] leading-[0.72] tracking-[-0.06em] mt-3">THE ARCHIVE</h1>
          </div>
          <Link href="/" className="text-[9px] tracking-[0.18em] uppercase hover:underline pt-2">← Return Home</Link>
        </div>
        <div className="border-t border-black divide-y divide-black/28">
          {(items || []).map((item: ArchiveItem, i: number) => (
            <Link key={item.id} href={`/archive/${item.slug}`} className="py-6 px-2 grid grid-cols-12 items-center hover:px-6 transition-all duration-300 block">
              <span className="col-span-1 text-[9px] tracking-[0.16em]">00{i + 1}</span>
              <span className="col-span-8 font-serif-aln text-3xl md:text-4xl">{item.title}</span>
              <span className="col-span-3 text-right text-[9px] tracking-[0.16em]">{item.year || ''}</span>
            </Link>
          ))}
          {(!items || items.length === 0) && <p className="py-16 text-center font-hand-aln text-xl opacity-40">archive entries coming soon</p>}
        </div>
      </main>
    </div>
  );
}