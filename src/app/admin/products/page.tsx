import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabase';
import { formatPrice } from '../../../lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  if (!supabaseAdmin) return <div className="p-8 text-sm opacity-40">Not configured</div>;
  const { data: products } = await supabaseAdmin.from('products').select('*, collection:collections(name)').order('created_at', { ascending: false });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif-aln text-3xl">Products</h1>
        <Link href="/admin/products/new" className="px-4 py-2 bg-black text-white text-[9px] tracking-[0.16em] uppercase">+ New Product</Link>
      </div>
      <div className="border border-black/10 divide-y divide-black/10">
        {(!products || products.length === 0) && <div className="p-4 text-[10px] opacity-40">No products yet</div>}
        {products?.map((p: any) => (
          <div key={p.id} className="flex items-center gap-4 p-4 text-[10px]">
            {p.cover_image && <img src={p.cover_image} alt="" className="w-12 h-16 object-cover" />}
            <div className="flex-1 min-w-0">
              <div className="font-medium">{p.number || ''} — {p.title}</div>
              <div className="opacity-40 text-[9px]">{p.collection?.name || 'No collection'} · {formatPrice(p.price, p.currency)}</div>
            </div>
            <span className={`px-2 py-0.5 text-[8px] uppercase tracking-wider ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{p.is_active ? 'Active' : 'Inactive'}</span>
            <Link href={`/admin/products/${p.id}/edit`} className="px-3 py-1 border border-black/20 hover:bg-black/5 text-[9px] uppercase tracking-wider">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}