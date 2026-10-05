'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        // Handle duplicate email constraint gracefully
        if (error.code === '23505') {
          setSubscribed(true);
        } else {
          console.error('Subscription error:', error.message);
        }
      } else {
        setSubscribed(true);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
      setEmail('');
    }
  };

  return (
    <footer className="w-full border-t border-black/10 py-16 px-[5vw] bg-[#f5f2ea] text-[#151515]">
      <div className="max-w-[1250px] mx-auto space-y-16">
        {/* Top Section: Brand Info & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-12 border-b border-black/10">
          {/* Brand Identity & Logo */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787826175/ChatGPT_Image_Aug_27_2026_11_10_03_AM_txadns.png"
                alt="Arrayed Like None Logo"
                className="h-10 w-auto object-contain mix-blend-multiply"
              />
            </Link>
            <div>
              <span className="font-serif-aln text-xl font-light tracking-[0.15em] block">
                ARRAYED LIKE NONE
              </span>
              <p className="opacity-60 font-hand-aln text-lg mt-1">
                ...even Solomon in all his glory was not arrayed like one of these
              </p>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-7 space-y-3">
            <span className="opacity-40 text-[8px] font-mono uppercase tracking-[0.2em] block">
              Journal & Dispatches
            </span>
            <p className="font-serif-aln text-sm max-w-md">
              Subscribe to receive seasonal collection previews, atelier notes, and private release notifications.
            </p>
            {subscribed ? (
              <p className="font-hand-aln text-lg text-black/80">
                ✓ You are now subscribed to the house list.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md gap-2 pt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-transparent border-b border-black/30 py-2 text-xs font-serif-aln focus:outline-none focus:border-black transition placeholder:opacity-40"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-black text-[9px] font-mono tracking-[0.2em] uppercase hover:bg-black hover:text-[#f5f2ea] transition whitespace-nowrap disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join →'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[10px] tracking-[0.08em] font-sans">
          {/* Column 1: Navigation */}
          <div className="flex flex-col gap-2">
            <span className="opacity-40 text-[8px] uppercase tracking-[0.2em] font-mono">
              Navigation
            </span>
            <Link href="/collections" className="hover:opacity-50 transition">Collections</Link>
            <Link href="/house" className="hover:opacity-50 transition">The House</Link>
            <Link href="/atelier" className="hover:opacity-50 transition">Atelier</Link>
            <Link href="/archive" className="hover:opacity-50 transition">Archive</Link>
            <Link href="/journal" className="hover:opacity-50 transition">Journal</Link>
          </div>

          {/* Column 2: House */}
          <div className="flex flex-col gap-2">
            <span className="opacity-40 text-[8px] uppercase tracking-[0.2em] font-mono">
              About
            </span>
            <Link href="/about" className="hover:opacity-50 transition">About Us</Link>
            <Link href="/careers" className="hover:opacity-50 transition">Careers</Link>
            <Link href="/partners" className="hover:opacity-50 transition">Partners</Link>
          </div>

          {/* Column 3: Client Service */}
          <div className="flex flex-col gap-2">
            <span className="opacity-40 text-[8px] uppercase tracking-[0.2em] font-mono">
              Client Service
            </span>
            <Link href="/contact" className="hover:opacity-50 transition">Contact Us</Link>
            <Link href="/track" className="hover:opacity-50 transition">Track Order</Link>
            <Link href="/cart" className="hover:opacity-50 transition">Your Cart</Link>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-2">
            <span className="opacity-40 text-[8px] uppercase tracking-[0.2em] font-mono">
              Legal & Privacy
            </span>
            <Link href="/legal" className="hover:opacity-50 transition">Legal Notice</Link>
            <Link href="/terms" className="hover:opacity-50 transition">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:opacity-50 transition">Privacy Policy</Link>
          </div>

          {/* Column 5: Location */}
          <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
            <span className="opacity-40 text-[8px] uppercase tracking-[0.2em] font-mono">
              Location
            </span>
            <p>Bauchi / Worldwide</p>
            <p className="opacity-40 pt-6 font-mono text-[9px]">
              © {new Date().getFullYear()} ALN. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}