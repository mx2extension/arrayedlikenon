'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

export default function NewJournalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', date: '', is_published: false,
  });
  const [coverImage, setCoverImage] = useState('');

  function updateForm(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'title') setForm((prev) => ({ ...prev, slug: slugify(value as string) }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    try { const res = await fetch('/api/upload', { method: 'POST', body: fd }); const data = await res.json(); if (data.url) setCoverImage(data.url); } catch { alert('Upload failed'); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('journal_entries').insert({
        title: form.title, slug: form.slug, excerpt: form.excerpt || null,
        content: form.content || null, cover_image: coverImage || null,
        date: form.date || null, is_published: form.is_published,
      });
      if (error) throw error;
      router.push('/admin/journal');
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif-aln text-3xl">New Journal Entry</h1>
        <Link href="/admin/journal" className="text-[9px] uppercase tracking-wider opacity-50 hover:opacity-100">← Back</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-black/10 p-6 space-y-4">
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Title *</label>
            <input type="text" required value={form.title} onChange={(e) => updateForm('title', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
          </div>
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => updateForm('slug', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
          </div>
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => updateForm('date', e.target.value)} className="border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
          </div>
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Excerpt</label>
            <textarea value={form.excerpt} onChange={(e) => updateForm('excerpt', e.target.value)} rows={2} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
          </div>
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Content</label>
            <textarea value={form.content} onChange={(e) => updateForm('content', e.target.value)} rows={12} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white font-mono" />
          </div>
          <label className="flex items-center gap-2 text-[10px]">
            <input type="checkbox" checked={form.is_published} onChange={(e) => updateForm('is_published', e.target.checked)} className="w-4 h-4" />
            Published (visible on site)
          </label>
        </div>

        <div className="border border-black/10 p-6 space-y-4">
          <div className="text-[9px] tracking-[0.16em] uppercase">Cover Image</div>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-[10px]" />
          {coverImage && <img src={coverImage} alt="Cover" className="w-32 h-40 object-cover" />}
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Or paste URL</label>
            <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white text-[9px] tracking-[0.2em] uppercase hover:bg-black/80 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Entry'}
        </button>
      </form>
    </div>
  );
}