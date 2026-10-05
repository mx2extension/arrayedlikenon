'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  is_active: boolean;
  cut?: string;
  fabric?: string;
}

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [collectionName, setCollectionName] = useState('');
  const [assignedProducts, setAssignedProducts] = useState<Product[]>([]);
  const [unassignedProducts, setUnassignedProducts] = useState<Product[]>([]);
  const [selectedUnassignedId, setSelectedUnassignedId] = useState('');

  useEffect(() => {
    if (collectionId) {
      loadData();
    }
  }, [collectionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch collection name
      const { data: col, error: colErr } = await supabase
        .from('collections')
        .select('name')
        .eq('id', collectionId)
        .single();

      if (colErr) throw colErr;
      setCollectionName(col.name);

      // 2. Fetch products inside this collection
      const { data: assigned, error: assErr } = await supabase
        .from('products')
        .select('id, title, slug, price, is_active, cut, fabric')
        .eq('collection_id', collectionId)
        .order('order_index', { ascending: true });

      if (assErr) throw assErr;
      setAssignedProducts(assigned || []);

      // 3. Fetch products NOT assigned to any collection
      const { data: unassigned, error: unassErr } = await supabase
        .from('products')
        .select('id, title, slug, price, is_active, cut, fabric')
        .is('collection_id', null);

      if (unassErr) throw unassErr;
      setUnassignedProducts(unassigned || []);
    } catch (err: any) {
      console.error('Error loading collection details:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Remove product from collection (sets collection_id to null)
  const handleRemoveFromCollection = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ collection_id: null })
        .eq('id', productId);

      if (error) throw error;

      const removed = assignedProducts.find((p) => p.id === productId);
      setAssignedProducts((prev) => prev.filter((p) => p.id !== productId));
      if (removed) setUnassignedProducts((prev) => [...prev, removed]);
    } catch (err: any) {
      console.error('Error removing product from collection:', err.message || err);
    }
  };

  // Completely delete product from DB
  const handleDeleteProductPermanently = async (productId: string, title: string) => {
    const confirm = window.confirm(`Permanently delete "${title}" from the database?`);
    if (!confirm) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;

      setAssignedProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err: any) {
      console.error('Error deleting product:', err.message || err);
    }
  };

  // Add an existing unassigned product to this collection
  const handleAddExistingProduct = async () => {
    if (!selectedUnassignedId) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ collection_id: collectionId })
        .eq('id', selectedUnassignedId);

      if (error) throw error;

      const added = unassignedProducts.find((p) => p.id === selectedUnassignedId);
      setUnassignedProducts((prev) => prev.filter((p) => p.id !== selectedUnassignedId));
      if (added) setAssignedProducts((prev) => [...prev, added]);
      setSelectedUnassignedId('');
    } catch (err: any) {
      console.error('Error adding product to collection:', err.message || err);
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-[#f5f2ea] p-8 text-xs uppercase">Loading collection...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f5f2ea] text-[#151515] p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-black/20 pb-4">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase opacity-60">Collection Details</div>
            <h1 className="font-serif-aln text-3xl font-light">{collectionName}</h1>
          </div>
          <Link
            href="/admin/collections"
            className="text-[9px] tracking-[0.18em] uppercase hover:underline"
          >
            ← Back to Collections
          </Link>
        </div>

        {/* Add Unassigned Product Control */}
        {unassignedProducts.length > 0 && (
          <div className="p-4 border border-black/20 bg-black/[0.02] flex flex-col md:flex-row gap-3 items-center justify-between">
            <span className="text-[10px] tracking-[0.18em] uppercase font-bold">Add Unassigned Product:</span>
            <div className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
              <select
                value={selectedUnassignedId}
                onChange={(e) => setSelectedUnassignedId(e.target.value)}
                className="bg-transparent border border-black/30 p-2 text-xs flex-1 focus:outline-none"
              >
                <option value="">Select a product...</option>
                {unassignedProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (${p.price})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddExistingProduct}
                disabled={!selectedUnassignedId}
                className="bg-black text-[#f5f2ea] px-4 py-2 text-[9px] tracking-[0.18em] uppercase disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* List of Products inside Collection */}
        <div className="space-y-4">
          <h2 className="text-xs tracking-[0.2em] uppercase">
            Products in Collection ({assignedProducts.length})
          </h2>

          {assignedProducts.length === 0 ? (
            <p className="text-xs opacity-50 py-8 border border-dashed border-black/20 text-center">
              No products currently in {collectionName}.
            </p>
          ) : (
            <div className="border border-black/20 divide-y divide-black/10 bg-black/[0.01]">
              {assignedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 hover:bg-black/[0.02]">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wide">{product.title}</p>
                    <p className="text-[10px] opacity-60 font-mono mt-0.5">
                      {product.slug} — ${product.price.toFixed(2)}
                      {product.fabric && ` | Fabric: ${product.fabric}`}
                      {product.cut && ` | Cut: ${product.cut}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View / Edit Product Link */}
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-[9px] tracking-[0.18em] uppercase border border-black/30 px-3 py-1.5 hover:bg-black hover:text-[#f5f2ea] transition"
                    >
                      Edit Product
                    </Link>

                    {/* Detach from Collection */}
                    <button
                      onClick={() => handleRemoveFromCollection(product.id)}
                      className="text-[9px] tracking-[0.18em] uppercase border border-black/30 px-3 py-1.5 hover:bg-black hover:text-[#f5f2ea] transition"
                    >
                      Remove from Collection
                    </button>

                    {/* Permanent Delete */}
                    <button
                      onClick={() => handleDeleteProductPermanently(product.id, product.title)}
                      className="text-red-700 text-[9px] tracking-[0.18em] uppercase hover:underline px-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}