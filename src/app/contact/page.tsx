'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([{ full_name, email, subject, message }]);

      if (error) {
        console.error('Submission error:', error.message);
        setErrorMsg('Failed to transmit message. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-24 pb-32 px-[5vw]">
      {/* Top Breadcrumb Header */}
      <div className="max-w-[1250px] mx-auto border-b border-black/20 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-60">
            The House / Communication
          </span>
          <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,130px)] leading-[0.75] tracking-[-0.06em] mt-2">
            CONTACT
          </h1>
        </div>
        <Link
          href="/"
          className="text-[9px] font-mono tracking-[0.2em] uppercase hover:underline mb-2"
        >
          ← Return
        </Link>
      </div>

      <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mt-16">
        {/* Left Column: Direct Inquiries */}
        <div className="md:col-span-5 space-y-12">
          <p className="font-serif-aln text-2xl leading-[1.2]">
            For private appointments, general inquiries, or press relations, reach out to the Atelier directly.
          </p>

          <div className="space-y-6 text-[10px] font-mono tracking-[0.16em] uppercase">
            <div>
              <span className="opacity-50 block mb-1">General & Orders</span>
              <a href="mailto:atelier@aln.com" className="hover:underline text-sm font-sans tracking-normal font-medium">
                atelier@aln.com
              </a>
            </div>

            <div>
              <span className="opacity-50 block mb-1">Press & Editorial</span>
              <a href="mailto:press@aln.com" className="hover:underline text-sm font-sans tracking-normal font-medium">
                press@aln.com
              </a>
            </div>

            <div>
              <span className="opacity-50 block mb-1">Atelier Location</span>
              <p className="text-sm font-serif-aln tracking-normal font-normal opacity-90 leading-relaxed">
                Bauchi / Worldwide
              </p>
            </div>
          </div>

          <div className="font-hand-aln text-[22px] italic opacity-80 pt-4">
            responses delivered within 24 hours.
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7 border-t md:border-t-0 md:border-l border-black/20 pt-12 md:pt-0 md:pl-16">
          {submitted ? (
            <div className="py-20 text-center space-y-4">
              <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-50 block">
                [ Message Sent ]
              </span>
              <h3 className="font-serif-aln text-4xl">Thank you for writing.</h3>
              <p className="text-sm font-serif-aln opacity-70">
                Your note has been received by the house. We will be in touch shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 border-b border-black text-[9px] font-mono tracking-[0.2em] uppercase pb-1 hover:opacity-60 transition"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMsg && (
                <p className="text-xs font-mono text-red-600 tracking-wide uppercase">
                  {errorMsg}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-60 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    className="w-full bg-transparent border-b border-black/30 py-2 font-serif-aln text-lg focus:outline-none focus:border-black transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-60 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-b border-black/30 py-2 font-serif-aln text-lg focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-60 block">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Order Inquiry, Bespoke Request, Press, etc."
                  className="w-full bg-transparent border-b border-black/30 py-2 font-serif-aln text-lg focus:outline-none focus:border-black transition placeholder:opacity-30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-60 block">
                  Message *
                </label>
                <textarea
                  rows={4}
                  name="message"
                  required
                  className="w-full bg-transparent border-b border-black/30 py-2 font-serif-aln text-lg focus:outline-none focus:border-black transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 border border-black text-[10px] font-mono tracking-[0.24em] uppercase hover:bg-black hover:text-[#f5f2ea] transition duration-300 disabled:opacity-50"
              >
                {loading ? 'Transmitting...' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}