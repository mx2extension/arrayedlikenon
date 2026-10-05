'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GarmentQRCode from '@/components/GarmentQRCode';
import { supabaseAdmin } from '../../lib/supabase';
import { Order, OrderItem } from '../../lib/types';
import { formatPrice } from '../../lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<(Order & { items?: OrderItem[]; authenticityRecords?: any[] })[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeQrModal, setActiveQrModal] = useState<{ token: string; title: string; code: string } | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    setLoading(true);
    let query = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
    if (statusFilter) query = query.eq('status', statusFilter);
    const { data } = await query;
    if (data) setOrders(data);
    setLoading(false);
  }

  async function toggleExpand(orderId: string) {
    if (expanded === orderId) {
      setExpanded(null);
      return;
    }
    setExpanded(orderId);

    // Fetch order items and authenticity records in parallel
    const [itemsRes, authenticityRes] = await Promise.all([
      supabaseAdmin.from('order_items').select('*').eq('order_id', orderId),
      supabaseAdmin.from('garment_authenticity').select('*').eq('order_id', orderId)
    ]);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: itemsRes.data || [],
              authenticityRecords: authenticityRes.data || []
            }
          : o
      )
    );
  }

  async function updateStatus(orderId: string, newStatus: string) {
    await supabaseAdmin.from('orders').update({ status: newStatus }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  }

  const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'failed'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif-aln text-3xl">Orders</h1>
        <div className="text-[9px] uppercase tracking-widest opacity-50">
          Atelier Order Fulfillment & QR Generation
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-3 py-1.5 text-[9px] uppercase tracking-wider border ${
            !statusFilter ? 'bg-black text-white border-black' : 'border-black/20 hover:bg-black/5'
          }`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-[9px] uppercase tracking-wider border ${
              statusFilter === s ? 'bg-black text-white border-black' : 'border-black/20 hover:bg-black/5'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-[10px] opacity-40 p-4">Loading...</div>
      ) : (
        <div className="border border-black/10 divide-y divide-black/10">
          {orders.length === 0 && <div className="p-4 text-[10px] opacity-40">No orders found</div>}
          {orders.map((order) => (
            <div key={order.id}>
              <button
                onClick={() => toggleExpand(order.id)}
                className="w-full flex items-center gap-4 p-4 text-[10px] text-left hover:bg-black/[0.02] transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium font-mono text-xs flex items-center gap-2">
                    <span>{order.tracking_id}</span>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[8px] tracking-wider uppercase underline opacity-50 hover:opacity-100"
                    >
                      [Print Page →]
                    </Link>
                  </div>
                  <div className="opacity-40 text-[9px] mt-0.5">
                    {order.customer_name} · {order.customer_email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatPrice(order.total_amount, order.currency)}</div>
                  <div className="text-[9px] mt-0.5">
                    <select
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateStatus(order.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-[8px] uppercase tracking-wider px-2 py-0.5 border cursor-pointer bg-transparent ${
                        order.status === 'paid'
                          ? 'border-green-300 text-green-700'
                          : order.status === 'shipped'
                          ? 'border-blue-300 text-blue-700'
                          : order.status === 'delivered'
                          ? 'border-emerald-300 text-emerald-700'
                          : order.status === 'failed'
                          ? 'border-red-300 text-red-700'
                          : 'border-black/20'
                      }`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-[9px] opacity-30 w-20 text-right">
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
                <span className="opacity-30 text-[9px]">{expanded === order.id ? '▲' : '▼'}</span>
              </button>

              {expanded === order.id && (
                <div className="px-4 pb-4 pl-8 space-y-3 border-t border-black/5 pt-3 bg-black/[0.01]">
                  <div className="grid grid-cols-2 gap-2 text-[9px] opacity-60">
                    <div>Phone: {order.customer_phone}</div>
                    <div>
                      Address: {order.customer_address}
                      {order.city ? `, ${order.city}` : ''}
                      {order.state ? `, ${order.state}` : ''}
                    </div>
                  </div>
                  {order.payment_reference && (
                    <div className="text-[8px] opacity-30 font-mono">Ref: {order.payment_reference}</div>
                  )}

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="border border-black/10 divide-y divide-black/10 mt-2 bg-white/60">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center px-3 py-2 text-[9px]">
                          <span>
                            {item.product_number ? `${item.product_number} — ` : ''}
                            {item.product_title}{' '}
                            <span className="opacity-40">
                              {item.color ? `/ ${item.color}` : ''} {item.size ? `/ ${item.size}` : ''} ×{item.quantity}
                            </span>
                          </span>
                          <span>{formatPrice(item.price * item.quantity, order.currency)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Authenticity QR Code Actions */}
                  {order.authenticityRecords && order.authenticityRecords.length > 0 && (
                    <div className="pt-2 border-t border-black/10">
                      <div className="text-[8px] uppercase tracking-widest opacity-40 mb-2">
                        Digital Garment Passports
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.authenticityRecords.map((auth) => (
                          <button
                            key={auth.id}
                            onClick={() =>
                              setActiveQrModal({
                                token: auth.id,
                                title: auth.product_title,
                                code: auth.item_code,
                              })
                            }
                            className="px-2 py-1 bg-black text-white text-[8px] uppercase tracking-wider hover:bg-black/80 transition-colors"
                          >
                            QR Tag: {auth.item_code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick QR View Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f5f2ea] border border-black/20 p-6 max-w-sm w-full space-y-4 text-center">
            <div className="text-[9px] uppercase tracking-widest opacity-50">{activeQrModal.code}</div>
            <div className="font-serif-aln text-xl">{activeQrModal.title}</div>

            <div className="flex justify-center py-2">
              <GarmentQRCode token={activeQrModal.token} size={160} />
            </div>

            <button
              onClick={() => setActiveQrModal(null)}
              className="w-full py-2 bg-black text-white text-[9px] uppercase tracking-widest hover:bg-black/80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}