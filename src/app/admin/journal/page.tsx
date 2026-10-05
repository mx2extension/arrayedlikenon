import Link from 'next/link';
import { supabaseAdmin } from '../../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminJournal() {
  if (!supabaseAdmin) return <div className="p-8 text-sm opacity-40">Not configured</div>;
  const { data: entries } = await supabaseAdmin.from('journal_entries').select('*').order('created_at', { ascending: false });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif-aln text-3xl">Journal Entries</h1>
        <Link href="/admin/journal/new" className="px-4 py-2 bg-black text-white text-[9px] tracking-[0.16em] uppercase">+ New Entry</Link>
      </div>
      <div className="border border-black/10 divide-y divide-black/10">
        {(!entries || entries.length === 0) && <div className="p-4 text-[10px] opacity-40">No entries yet</div>}
        {entries?.map((entry: any) => (
          <div key={entry.id} className="flex items-center gap-4 p-4 text-[10px]">
            {entry.cover_image && <img src={entry.cover_image} alt="" className="w-12 h-16 object-cover" />}
            <div className="flex-1 min-w-0">
              <div className="font-medium">{entry.title}</div>
              <div className="opacity-40 text-[9px]">{entry.slug} · {entry.date || 'No date'}</div>
            </div>
            <span className={`px-2 py-0.5 text-[8px] uppercase tracking-wider ${entry.is_published ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{entry.is_published ? 'Published' : 'Draft'}</span>
            <Link href={`/admin/journal/${entry.id}/edit`} className="px-3 py-1 border border-black/20 hover:bg-black/5 text-[9px] uppercase tracking-wider">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}