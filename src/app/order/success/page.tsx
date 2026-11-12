import Link from 'next/link';
import GarmentQRCode from '@/components/GarmentQRCode';
import { supabase } from '@/lib/supabase';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  let authenticityRecords: any[] = [];

  if (orderId) {
    // 1. Fetch order details from Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (!error && order) {
      // 2. Generate or fetch garment authenticity records for each item
      const records = [];
      for (const item of order.order_items || []) {
        // Check if token already exists
        let { data: existing } = await supabase
          .from('garment_authenticity')
          .select('*')
          .eq('order_id', order.id)
          .eq('product_id', item.product_id)
          .single();

        if (!existing) {
          // Insert new record
          const { data: created } = await supabase
            .from('garment_authenticity')
            .insert({
              order_id: order.id,
              product_id: item.product_id,
              product_title: item.title,
              series_number: item.series_number || 'SERIES I',
              item_code: `ALN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
              owner_name: order.customer_name || 'ALN VIP Collector',
            })
            .select()
            .single();

          if (created) records.push(created);
        } else {
          records.push(existing);
        }
      }
      authenticityRecords = records;
    }
  }

  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <main className="max-w-[700px] mx-auto text-center space-y-8">
        <div className="text-[9px] tracking-[0.24em] uppercase opacity-60">Order Confirmed</div>
        <h1 className="font-serif-aln text-4xl sm:text-6xl font-light">ARRAYED LIKE NONE</h1>
        <p className="font-hand-aln text-xl opacity-70">
          Your piece is being prepared by our atelier. Below is your official digital product passport.
        </p>

        {!orderId ? (
          <div className="py-12 text-[10px] tracking-[0.2em] uppercase opacity-50">No Order ID Provided</div>
        ) : authenticityRecords.length === 0 ? (
          <div className="py-12 text-[10px] tracking-[0.2em] uppercase opacity-50">Generating Authenticity Passport...</div>
        ) : (
          <div className="grid gap-6 mt-8">
            {authenticityRecords.map((record) => (
              <div key={record.id} className="p-8 border border-black/15 bg-[#ebd2a9]/10 space-y-4">
                <div className="text-[10px] tracking-[0.2em] uppercase opacity-50">
                  {record.series_number} / {record.item_code}
                </div>
                <div className="font-serif-aln text-2xl">{record.product_title}</div>
                <div className="text-[11px] tracking-[0.1em] opacity-70">Commissioned for: {record.owner_name}</div>
                
                <div className="flex justify-center pt-4">
                  <GarmentQRCode token={record.id} size={140} />
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/collections" className="inline-block border-b border-black pb-1 text-[9px] tracking-[0.2em] uppercase pt-6">
          Return to Collections →
        </Link>
      </main>
    </div>
  );
}