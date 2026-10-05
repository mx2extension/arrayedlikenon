import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/lib/types';

export const revalidate = 60;

export default async function CollectionsPage() {
  const { data: collections } = await supabase
    .from('collections')
    .select('*, products:products(count)')
    .eq('is_active', true)
    .order('order_index');

  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <main className="max-w-[1250px] mx-auto">
        <div className="border-b border-black/20 pb-8 flex justify-between items-start mb-16">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase">03 / Collections</div>
            <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,140px)] leading-[0.72] tracking-[-0.06em] mt-3">COLLECTIONS</h1>
          </div>
          <Link href="/" className="text-[9px] tracking-[0.18em] uppercase hover:underline pt-2">← Return Home</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {(collections || []).map((c: Collection & { products: { count: number }[] }, i: number) => (
            <Link key={c.id} href={`/collections/${c.slug}`} className="group block space-y-4">
              <div className="aspect-[3/4] bg-neutral-300 overflow-hidden relative">
                <img src={c.cover_image || ''} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-3 border border-black/20 pointer-events-none" />
              </div>
              <div className="flex justify-between items-end border-b border-black/28 pb-3">
                <div>
                  <div className="font-serif-aln text-3xl">{c.name}</div>
                  <div className="text-[9px] tracking-[0.14em] uppercase opacity-50 mt-1">{c.year || ''} — {c.products?.[0]?.count || 0} pieces</div>
                </div>
                <span className="text-[9px] tracking-[0.14em] uppercase opacity-40 group-hover:opacity-100 transition">View →</span>
              </div>
              {c.description && <p className="text-[10px] leading-[1.7] opacity-60 max-w-[400px]">{c.description}</p>}
            </Link>
          ))}
        </div>
        {(!collections || collections.length === 0) && <p className="text-center font-hand-aln text-xl opacity-40 py-20">collections coming soon</p>}
      </main>
    </div>
  );
}