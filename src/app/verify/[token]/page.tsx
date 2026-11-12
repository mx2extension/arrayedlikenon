import { supabase } from '@/lib/supabase';

type Props = {
  params: Promise<{ token: string }>;
};

export default async function VerifyPage({ params }: Props) {
  const { token } = await params;

  // Fetch authenticity record directly via token (UUID)
  const { data: item } = await supabase
    .from('garment_authenticity')
    .select('*')
    .eq('id', token)
    .single();

  const isValid = !!item;

  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen flex items-center justify-center p-6">
      <div className="max-w-[500px] w-full border border-black/20 p-8 sm:p-12 text-center space-y-6 bg-white/40 backdrop-blur-sm">
        <div className="text-[9px] tracking-[0.3em] uppercase opacity-60">
          Registry of Authenticity
        </div>

        {isValid ? (
          <>
            <div className="inline-block px-4 py-1.5 bg-black text-[#f5f2ea] text-[9px] tracking-[0.25em] uppercase">
              ✓ Verified Genuine Piece
            </div>

            <div className="space-y-2 pt-4">
              <div className="text-[10px] tracking-[0.2em] uppercase opacity-50">
                {item.series_number} — {item.item_code}
              </div>
              <h1 className="font-serif-aln text-3xl sm:text-4xl">{item.product_title}</h1>
            </div>

            <div className="border-t border-b border-black/15 py-4 my-6 space-y-1 text-left text-[10px] tracking-[0.14em] uppercase opacity-80">
              <div className="flex justify-between">
                <span className="opacity-50">Owner / VIP:</span>
                <span>{item.owner_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Authenticated:</span>
                <span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">House:</span>
                <span>Arrayed Like None</span>
              </div>
            </div>

            <p className="font-hand-aln text-lg opacity-60">
              crafted with divine authority & proprietary pattern structures.
            </p>
          </>
        ) : (
          <>
            <div className="inline-block px-4 py-1.5 bg-red-950 text-white text-[9px] tracking-[0.25em] uppercase">
              ⚠ Unverified / Potential Counterfeit
            </div>

            <h1 className="font-serif-aln text-2xl pt-4">Garment Not Found</h1>

            <p className="text-[11px] opacity-70 leading-relaxed">
              This code does not match any official record in the Arrayed Like None registry. If you believe this is an error, please contact atelier@arrayedlikenone.com.
            </p>
          </>
        )}
      </div>
    </div>
  );
}