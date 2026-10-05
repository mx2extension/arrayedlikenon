'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import GarmentQRCode from '@/components/GarmentQRCode';
import { supabase } from '@/lib/supabase';

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [authenticityRecords, setAuthenticityRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const qrRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    async function fetchAdminOrderData() {
      const { data, error } = await supabase
        .from('garment_authenticity')
        .select('*')
        .eq('order_id', params.id);

      if (!error && data) {
        setAuthenticityRecords(data);
      }
      setLoading(false);
    }

    fetchAdminOrderData();
  }, [params.id]);

  const downloadQRCode = async (recordId: string, itemCode: string) => {
    const node = qrRefs.current[recordId];
    if (!node) return;

    try {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `ALN-QR-${itemCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export QR code image:', err);
    }
  };

  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-24 pb-20 px-[5vw]">
      <main className="max-w-[1000px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-black/20 pb-6">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase opacity-50">
              Atelier Management
            </div>
            <h1 className="font-serif-aln text-3xl sm:text-5xl font-light mt-1">
              Order Fulfillment & Provenance
            </h1>
          </div>
          <Link
            href="/admin/orders"
            className="text-[9px] tracking-[0.2em] uppercase border-b border-black pb-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            ← Back to Orders
          </Link>
        </div>

        {/* Loading / Records List */}
        {loading ? (
          <div className="py-20 text-center text-[10px] tracking-[0.2em] uppercase opacity-50">
            Loading Garment Records...
          </div>
        ) : authenticityRecords.length === 0 ? (
          <div className="text-center py-16 space-y-4 border border-black/10 p-8">
            <p className="font-serif-aln text-2xl opacity-60">No authenticity records found for this order.</p>
            <p className="text-[10px] uppercase tracking-[0.14em] opacity-40">
              Ensure the customer order has been marked as paid.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {authenticityRecords.map((record) => (
              <div
                key={record.id}
                className="border border-black/20 bg-white/50 p-6 flex flex-col justify-between space-y-6"
              >
                {/* Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[9px] tracking-[0.2em] uppercase opacity-50">
                    <span>{record.series_number}</span>
                    <span className="font-mono">{record.item_code}</span>
                  </div>
                  <h2 className="font-serif-aln text-2xl">{record.product_title}</h2>
                  <div className="text-[10px] tracking-[0.12em] uppercase opacity-70">
                    Commissioned For: <span className="font-semibold">{record.owner_name}</span>
                  </div>
                </div>

                {/* Printable QR Code Area */}
                <div className="flex flex-col items-center gap-4 py-4 border-t border-b border-black/10">
                  <div
                    ref={(el) => {
                      qrRefs.current[record.id] = el;
                    }}
                    className="p-4 bg-white border border-black/10"
                  >
                    <GarmentQRCode token={record.id} size={160} />
                  </div>
                </div>

                {/* Export Action */}
                <button
                  onClick={() => downloadQRCode(record.id, record.item_code)}
                  className="w-full py-3 bg-[#151515] text-[#f5f2ea] text-[9px] tracking-[0.2em] uppercase hover:bg-black/80 transition-colors"
                >
                  Download Print Ready PNG ↓
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}