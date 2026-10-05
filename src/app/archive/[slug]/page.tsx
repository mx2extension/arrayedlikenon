import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import { ArchiveItem } from '../../../lib/types';

export const revalidate = 60;

export default async function ArchiveItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: item } = await supabase.from('archive_items').select('*').eq('slug', slug).single();
  if (!item) notFound();
  const archive = item as ArchiveItem;
  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <main className="max-w-[900px] mx-auto">
        <div className="border-b border-black/20 pb-8 flex justify-between items-start mb-12">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase">Archive / {archive.year || ''}</div>
            <h1 className="font-serif-aln font-light text-[clamp(48px,7vw,100px)] leading-[0.75] tracking-[-0.05em] mt-2">{archive.title}</h1>
          </div>
          <Link href="/archive" className="text-[9px] tracking-[0.18em] uppercase hover:underline pt-2">← Archive</Link>
        </div>
        {archive.cover_image && (
          <div className="aspect-[16/10] bg-neutral-300 overflow-hidden mb-12">
            <img src={archive.cover_image} alt={archive.title} className="w-full h-full object-cover grayscale mix-blend-multiply" />
          </div>
        )}
        {archive.description && (
          <div className="font-serif-aln text-xl leading-[1.6] opacity-80 whitespace-pre-line">{archive.description}</div>
        )}
      </main>
    </div>
  );
}