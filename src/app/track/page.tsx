'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Order, OrderItem } from '@/lib/types';

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await fetch(`/api/tracking/${trackingId.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order not found');
      setOrder(data.order);
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message);
      setOrder(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const statusSteps = ['pending', 'paid', 'processing', 'shipped', 'delivered'];

  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <main className="max-w-[700px] mx-auto">
        <div className="border-b border-black/20 pb-8 mb-12">
          <div className="text-[9px] tracking-[0.24em] uppercase">Track Your Order</div>
          <h1 className="font-serif-aln font-light text-[clamp(48px,7vw,100px)] leading-[0.75] tracking-[-0.05em] mt-2">TRACK</h1>
        </div>
        <form onSubmit={handleSearch} className="flex gap-3 mb-12">
          <input type="text" placeholder="ALN-2026-XXXXXX" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} className="flex-1 bg-transparent border-b border-black/20 py-3 text-sm tracking-[0.1em] focus:outline-none focus:border-black/60 transition" />
          <button type="submit" disabled={loading} className="px-6 py-3 bg-[#151515] text-[#f5f2ea] text-[9px] tracking-[0.2em] uppercase hover:bg-black/80 transition disabled:opacity-50">{loading ? '...' : 'Track'}</button>
        </form>
        {error && <p className="font-hand-aln text-lg opacity-60 mb-8">{error}</p>}
        {order && (
          <div className="space-y-8">
            <div className="border-t border-black/20 pt-8">
              <div className="flex justify-between text-[8px] tracking-[0.16em] uppercase mb-4">
                {statusSteps.map((s) => (
                  <span key={s} className={statusSteps.indexOf(order.status) >= statusSteps.indexOf(s) ? 'opacity-100' : 'opacity-30'}>{s}</span>
                ))}
              </div>
              <div className="w-full h-[2px] bg-black/10 relative">
                <div className="absolute left-0 top-0 h-full bg-[#151515] transition-all duration-500" style={{ width: `${(statusSteps.indexOf(order.status) / (statusSteps.length - 1)) * 100}%` }} />
              </div>
              <div className="text-center mt-4 font-hand-aln text-xl">{order.status.toUpperCase()}</div>
            </div>
            <div className="border-t border-black/15 pt-6 space-y-0 text-[9px] tracking-[0.12em] uppercase">
              <div className="flex justify-between py-3 border-b border-black/10"><span className="opacity-50">Tracking ID</span><span>{order.tracking_id}</span></div>
              <div className="flex justify-between py-3 border-b border-black/10"><span className="opacity-50">Date</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
              <div className="flex justify-between py-3 border-b border-black/10"><span className="opacity-50">Name</span><span>{order.customer_name}</span></div>
              <div className="flex justify-between py-3 border-b border-black/10"><span className="opacity-50">Total</span><span className="font-serif-aln text-base normal-case">{formatPrice(order.total_amount, order.currency)}</span></div>
            </div>
            {items.length > 0 && (
              <div className="border-t border-black/15 pt-6">
                <div className="text-[9px] tracking-[0.2em] uppercase mb-4">Items</div>
                <div className="divide-y divide-black/10">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-3 text-[10px]">
                      <span className="opacity-70">{item.product_title} {item.color && `/ ${item.color}`} {item.size && `/ ${item.size}`} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity, order.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {!searched && <p className="font-hand-aln text-lg opacity-40">Enter your tracking ID to see order status</p>}
      </main>
    </div>
  );
}