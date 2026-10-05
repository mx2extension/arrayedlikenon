'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Collection {
  id: string;
  name: string;
  slug: string;
  year: string;
  is_active: boolean;
  products_count?: number;
}

export default function CollectionsListPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    setLoading(true);
    try {
      // Fetch collections along with their associated product IDs
      const { data, error } = await supabase
        .from('collections')
        .select('*, products(id)')
        .order('order_index', { ascending: true });

      if (error) throw error;

      const formatted = (data || []).map((c: any) => ({
        ...c,
        products_count: c.products ? c.products.length : 0,
      }));

      setCollections(formatted);
    } catch (err: any) {
      console.error('Error loading collections:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${name}"? Products inside will not be deleted, but will become unassigned.`
    );
    if (!confirm) return;

    try {
      const { error } = await supabase.from('collections').delete().eq('id', id);
      if (error) throw error;
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error('Error deleting collection:', err.message || err);
      alert('Failed to delete collection.');
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f2ea] text-[#151515] p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-black/20 pb-4">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase opacity-60">Admin Panel</div>
            <h1 className="font-serif-aln text-3xl font-light">Collections</h1>
          </div>
          <Link
            href="/admin/collections/new"
            className="bg-[#151515] text-[#f5f2ea] px-4 py-2 text-[9px] tracking-[0.18em] uppercase hover:bg-black/80 transition"
          >
            + New Collection
          </Link>
        </div>

        {loading ? (
          <p className="text-xs uppercase opacity-50">Loading collections...</p>
        ) : collections.length === 0 ? (
          <p className="text-xs opacity-50 py-8 border border-dashed border-black/20 text-center">
            No collections found. Create your first collection above.
          </p>
        ) : (
          <div className="border border-black/20 divide-y divide-black/10 bg-black/[0.01]">
            {collections.map((col) => (
              <div
                key={col.id}
                className="flex items-center justify-between p-5 hover:bg-black/[0.02] transition"
              >
                <div>
                  <Link
                    href={`/admin/collections/${col.id}`}
                    className="text-base font-medium hover:underline font-serif-aln"
                  >
                    {col.name}
                  </Link>
                  <p className="text-[10px] opacity-60 font-mono mt-0.5">
                    {col.slug} — {col.products_count} Product(s) {col.year && `(${col.year})`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/collections/${col.id}`}
                    className="text-[9px] tracking-[0.18em] uppercase border border-black/30 px-3 py-1.5 hover:bg-black hover:text-[#f5f2ea] transition"
                  >
                    Manage / View Products →
                  </Link>
                  <button
                    onClick={() => handleDeleteCollection(col.id, col.name)}
                    className="text-red-700 text-[9px] tracking-[0.18em] uppercase hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}