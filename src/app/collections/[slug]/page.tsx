'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import { Product } from '../../../lib/types';

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [collection, setCollection] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Taxonomy Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // 1. Fetch Collection
      const { data: colData } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!colData) {
        setLoading(false);
        return;
      }

      setCollection(colData);

      // 2. Fetch Products in Collection
      const { data: prodData } = await supabase
        .from('products')
        .select('*, colors:product_colors(*)')
        .eq('collection_id', colData.id)
        .eq('is_active', true)
        .order('order_index');

      setAllProducts((prodData as Product[]) || []);
      setLoading(false);
    }

    fetchData();
  }, [slug]);

  if (!loading && !collection) {
    notFound();
  }

  // Extract unique filter options present in this collection
  const availableCategories = Array.from(
    new Set(allProducts.flatMap((p: any) => p.categories || []))
  );
  const availableGenders = Array.from(
    new Set(allProducts.flatMap((p: any) => p.gender || []))
  );
  const availableTags = Array.from(
    new Set(allProducts.flatMap((p: any) => p.tags || []))
  );

  // Client-side filtering logic
  const filteredProducts = allProducts.filter((p: any) => {
    const matchCategory =
      selectedCategory === 'all' || p.categories?.includes(selectedCategory);
    const matchGender =
      selectedGender === 'all' || p.gender?.includes(selectedGender);
    const matchTag =
      selectedTag === 'all' || p.tags?.includes(selectedTag);

    return matchCategory && matchGender && matchTag;
  });

  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <main className="max-w-[1250px] mx-auto">
        <div className="border-b border-black/20 pb-8 flex justify-between items-start mb-12">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase">
              Collection / {collection?.year || ''}
            </div>
            <h1 className="font-serif-aln font-light text-[clamp(60px,9vw,140px)] leading-[0.72] tracking-[-0.06em] mt-3">
              {collection?.name?.toUpperCase()}
            </h1>
          </div>
          <Link
            href="/collections"
            className="text-[9px] tracking-[0.18em] uppercase hover:underline pt-2"
          >
            ← All Collections
          </Link>
        </div>

        {collection?.description && (
          <p className="font-serif-aln text-2xl leading-[1.15] max-w-[600px] mb-12 opacity-80">
            {collection.description}
          </p>
        )}

        {/* Minimal Taxonomy Filter Navigation Bar */}
        {!loading && allProducts.length > 0 && (
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-black/10 pb-6 mb-12 text-[9px] tracking-[0.2em] uppercase font-mono">
            {/* Gender Filter */}
            {availableGenders.length > 0 && (
              <div className="flex gap-2">
                <span className="opacity-40">Audience:</span>
                <button
                  onClick={() => setSelectedGender('all')}
                  className={selectedGender === 'all' ? 'underline font-bold' : 'opacity-60 hover:opacity-100'}
                >
                  All
                </button>
                {availableGenders.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={selectedGender === g ? 'underline font-bold' : 'opacity-60 hover:opacity-100'}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            {/* Category Filter */}
            {availableCategories.length > 0 && (
              <div className="flex gap-2">
                <span className="opacity-40">Category:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'underline font-bold' : 'opacity-60 hover:opacity-100'}
                >
                  All
                </button>
                {availableCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={selectedCategory === c ? 'underline font-bold' : 'opacity-60 hover:opacity-100'}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Tag Filter */}
            {availableTags.length > 0 && (
              <div className="flex gap-2">
                <span className="opacity-40">Tag:</span>
                <button
                  onClick={() => setSelectedTag('all')}
                  className={selectedTag === 'all' ? 'underline font-bold' : 'opacity-60 hover:opacity-100'}
                >
                  All
                </button>
                {availableTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTag(t)}
                    className={selectedTag === t ? 'underline font-bold' : 'opacity-60 hover:opacity-100'}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Display Grid */}
        {loading ? (
          <p className="text-center font-hand-aln text-xl opacity-40 py-20">
            loading collection...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="text-center font-hand-aln text-xl opacity-40 py-20">
                no pieces match selected filters
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}