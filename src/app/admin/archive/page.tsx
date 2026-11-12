'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabase';

export default function AdminArchivePage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', slug: '', description: '', year: '', cover_image: '' });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    if (!supabaseAdmin) return;
    const { data } = await supabaseAdmin.from('archive_items').select('*').order('order_index');
    if (data) setItems(data);
  }

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'title') setForm((prev) => ({ ...prev, slug: prev.title ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    try { const res = await fetch('/api/upload', { method: 'POST', body: fd }); const data = await res.json(); if (data.url) updateForm('cover_image', data.url); } catch { alert('Upload failed'); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseAdmin) {
      alert('Supabase admin client is not configured.');
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await supabaseAdmin.from('archive_items').update({ title: form.title, slug: form.slug, description: form.description || null, year: form.year || null, cover_image: form.cover_image || null }).eq('id', editing);
      } else {
        await supabaseAdmin.from('archive_items').insert({ title: form.title, slug: form.slug, description: form.description || null, year: form.year || null, cover_image: form.cover_image || null });
      }
      setForm({ title: '', slug: '', description: '', year: '', cover_image: '' });
      setEditing(null);
      await loadItems();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  }

  function startEdit(item: any) {
    setEditing(item.id);
    setForm({ title: item.title, slug: item.slug, description: item.description || '', year: item.year || '', cover_image: item.cover_image || '' });
  }

  async function deleteItem(id: string) {
    if (!supabaseAdmin) return;
    if (!confirm('Delete this archive item?')) return;
    await supabaseAdmin.from('archive_items').delete().eq('id', id);
    await loadItems();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif-aln text-3xl">Archive Items</h1>

      <form onSubmit={handleSave} className="border border-black/10 p-6 space-y-4">
        <div className="text-[9px] tracking-[0.16em] uppercase">{editing ? 'Edit Item' : 'Add New Item'}</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Title *</label>
            <input type="text" required value={form.title} onChange={(e) => updateForm('title', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
          </div>
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => updateForm('slug', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
          </div>
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Year</label>
            <input type="text" value={form.year} onChange={(e) => updateForm('year', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
          </div>
          <div>
            <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Cover Image URL</label>
            <input type="text" value={form.cover_image} onChange={(e) => updateForm('cover_image', e.target.value)} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
          </div>
        </div>
        <div>
          <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={3} className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/40 bg-white" />
        </div>
        <div className="flex gap-2 items-center">
          <input type="file" accept="image/*" onChange={handleUpload} className="text-[10px]" />
          {form.cover_image && <img src={form.cover_image} alt="" className="w-12 h-16 object-cover" />}
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white text-[9px] tracking-[0.16em] uppercase hover:bg-black/80 disabled:opacity-50">
            {loading ? '...' : editing ? 'Update' : 'Add Item'}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: '', slug: '', description: '', year: '', cover_image: '' }); }} className="px-4 py-2 border border-black/20 text-[9px] uppercase hover:bg-black/5">Cancel</button>}
        </div>
      </form>

      <div className="border border-black/10 divide-y divide-black/10">
        {items.length === 0 && <div className="p-4 text-[10px] opacity-40">No archive items</div>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 text-[10px]">
            {item.cover_image && <img src={item.cover_image} alt="" className="w-10 h-14 object-cover" />}
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              <div className="opacity-40 text-[9px]">{item.year || 'No year'} · {item.slug}</div>
            </div>
            <button onClick={() => startEdit(item)} className="px-3 py-1 border border-black/20 hover:bg-black/5 text-[9px] uppercase tracking-wider">Edit</button>
            <button onClick={() => deleteItem(item.id)} className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 text-[9px] uppercase tracking-wider">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}