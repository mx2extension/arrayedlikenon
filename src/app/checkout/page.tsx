'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

interface CartItem {
  id?: string;
  productId?: string;
  title?: string;
  name?: string;
  price: number;
  image?: string;
  color?: string | null;
  size?: string | null;
  quantity: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  // Safe Hydration Reader
  useEffect(() => {
    const keys = ['aln_cart', 'cart', 'shopping_cart', 'arrayed_cart'];
    let checkCount = 0;

    const pullFromStorage = () => {
      for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            const items = Array.isArray(parsed) ? parsed : parsed.items || parsed.state?.cart || [];
            if (items.length > 0) {
              setCart(items);
              setIsHydrating(false);
              return true;
            }
          } catch (err) {
            console.error('Error parsing cart key:', key, err);
          }
        }
      }
      return false;
    };

    if (!pullFromStorage()) {
      const interval = setInterval(() => {
        checkCount++;
        if (pullFromStorage() || checkCount >= 10) {
          clearInterval(interval);
          setIsHydrating(false);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  function generateTrackingCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'ALN-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function clearCartStorage() {
    ['aln_cart', 'cart', 'shopping_cart', 'arrayed_cart'].forEach((key) => localStorage.removeItem(key));
  }

  const handlePaymentSuccess = async (response: any) => {
    setLoading(true);
    const generatedCode = generateTrackingCode();

    try {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          tracking_code: generatedCode,
          customer_name: form.customerName,
          email: form.email,
          phone: form.phone,
          shipping_address: `${form.address}, ${form.city}`,
          notes: form.notes || null,
          total_amount: subtotal,
          payment_reference: response.transaction_id || response.tx_ref || 'FLW_SUCCESS',
          status: 'paid',
        })
        .select('id')
        .single();

      if (orderErr) throw orderErr;

      if (orderData?.id) {
        const orderItems = cart.map((item) => ({
          order_id: orderData.id,
          product_id: item.productId || item.id || null,
          title: item.title || item.name || 'Item',
          price: item.price,
          quantity: item.quantity || 1,
          selected_color: item.color || null,
          selected_size: item.size || null,
        }));

        await supabase.from('order_items').insert(orderItems);
      }

      clearCartStorage();
      setTrackingCode(generatedCode);
      setOrderComplete(true);
    } catch (err: any) {
      alert(`Error storing order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  function handleSubmitOrder(e: FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!form.phone) {
      alert('Please enter a valid phone number with your country code.');
      return;
    }

    if (typeof window.FlutterwaveCheckout !== 'function') {
      alert('Flutterwave SDK is initializing. Please try again in a few seconds.');
      return;
    }

    const txRef = `ALN-TX-${Date.now()}`;

    window.FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxx-X',
      tx_ref: txRef,
      amount: subtotal,
      currency: 'USD', // Updated to US Dollars
      payment_options: 'card',
      customer: {
        email: form.email,
        phone_number: form.phone,
        name: form.customerName,
      },
      customizations: {
        title: 'ARRAYED LIKE NONE',
        description: 'Order Queue Payment',
      },
      callback: function (data: any) {
        if (data.status === 'successful' || data.status === 'completed') {
          handlePaymentSuccess(data);
        } else {
          alert('Payment was not completed.');
        }
      },
      onclose: function () {
        setLoading(false);
      },
    });
  }

  if (isHydrating) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center font-mono text-xs uppercase tracking-widest bg-[#fdfbf7]">
        Loading checkout details...
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-6 font-mono text-neutral-900 bg-[#fafafa]">
        <div className="max-w-md w-full border border-black/10 bg-white p-8 space-y-6 text-center shadow-sm">
          <span className="text-[10px] tracking-[0.25em] uppercase text-emerald-600 block">
            Payment Verified & Order Queued
          </span>
          <h1 className="font-serif text-3xl font-light">Order Confirmed</h1>
          <p className="text-xs opacity-70 leading-relaxed">
            Your payment was processed successfully. Save this tracking code to check your position in the order queue.
          </p>
          <div className="bg-neutral-100 p-4 border border-neutral-200">
            <span className="text-[9px] tracking-[0.2em] uppercase opacity-50 block mb-1">
              Tracking & Queue Code
            </span>
            <span className="text-xl font-bold tracking-wider select-all">{trackingCode}</span>
          </div>
          <Link
            href="/"
            className="block w-full py-4 bg-black text-white text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
          >
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center space-y-4 font-mono px-6 text-center bg-[#fdfbf7]">
        <p className="text-xs uppercase tracking-widest opacity-60">Your shopping bag is currently empty.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.flutterwave.com/v3.js" strategy="lazyOnload" />

      <div className="w-full min-h-screen bg-[#fdfbf7] text-neutral-900 font-sans">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
          <div className="border-b border-black/10 pb-6 mb-12">
            <span className="text-[9px] font-mono tracking-[0.25em] uppercase opacity-50 block mb-1">
              ARRAYED LIKE NONE
            </span>
            <h1 className="font-serif text-3xl lg:text-4xl font-light">Checkout & Payment</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
              <div className="border border-black/10 bg-white p-6 space-y-4">
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-50 block border-b border-neutral-100 pb-2">
                  1. Delivery Details
                </span>

                <div className="space-y-4 font-mono">
                  <div>
                    <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className="w-full border border-black/10 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-black/10 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Phone *</label>
                      <PhoneInput
                        defaultCountry="US"
                        international
                        withCountryCallingCode
                        value={form.phone}
                        onChange={(val) => setForm({ ...form, phone: val || '' })}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Address *</label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full border border-black/10 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">City / State *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full border border-black/10 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#151515] text-[#f5f2ea] font-mono text-[11px] tracking-[0.25em] uppercase hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? 'Processing Order...' : `Pay $${subtotal.toLocaleString()} with Flutterwave`}
              </button>
            </form>

            <div className="lg:col-span-5 border border-black/10 bg-white p-6 space-y-6">
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-50 block border-b border-neutral-100 pb-2">
                2. Bag Summary ({cart.length})
              </span>

              <div className="space-y-4 divide-y divide-neutral-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <div className="relative w-14 h-18 bg-neutral-100 border border-neutral-200 flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.title || 'Item'} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] font-mono opacity-40">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 font-mono text-xs space-y-1">
                      <p className="font-medium truncate">{item.title || item.name}</p>
                      <p className="text-[10px] opacity-60">
                        Qty: {item.quantity || 1} {item.size ? `| Size: ${item.size}` : ''}
                      </p>
                    </div>
                    <p className="font-mono text-xs font-semibold">
                      ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/10 pt-4 font-mono flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}