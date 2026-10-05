'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  type: 'product' | 'collection';
  subtitle?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      // Fetch active collections & products in parallel
      const [productsRes, collectionsRes] = await Promise.all([
        supabase.from('products').select('*').eq('is_active', true),
        supabase.from('collections').select('*').eq('is_active', true),
      ]);

      const combinedResults: SearchResult[] = [];

      // 1. Match Collections -> Links to /collections/[slug]
      if (collectionsRes.data) {
        collectionsRes.data.forEach((col) => {
          const nameMatch = col.name?.toLowerCase().includes(searchTerm);
          const descMatch = col.description?.toLowerCase().includes(searchTerm);

          if (nameMatch || descMatch) {
            combinedResults.push({
              id: col.id,
              title: col.name,
              slug: col.slug,
              type: 'collection',
              subtitle: 'Collection',
            });
          }
        });
      }

      // 2. Match Products -> Links to /products/[slug]
      if (productsRes.data) {
        productsRes.data.forEach((p) => {
          const titleMatch = p.title?.toLowerCase().includes(searchTerm);
          const fabricMatch = p.fabric?.toLowerCase().includes(searchTerm);
          const cutMatch = p.cut?.toLowerCase().includes(searchTerm);
          const categoryMatch = p.categories?.some((cat: string) =>
            cat.toLowerCase().includes(searchTerm)
          );
          const tagMatch = p.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchTerm)
          );
          const genderMatch = p.gender?.some((g: string) =>
            g.toLowerCase().includes(searchTerm)
          );

          if (
            titleMatch ||
            fabricMatch ||
            cutMatch ||
            categoryMatch ||
            tagMatch ||
            genderMatch
          ) {
            combinedResults.push({
              id: p.id,
              title: p.title,
              slug: p.slug,
              type: 'product',
              subtitle: p.price ? `$${p.price}` : 'Product',
            });
          }
        });
      }

      setResults(combinedResults.slice(0, 10));
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f2ea]/95 backdrop-blur-md p-8 md:p-16 flex flex-col justify-start">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-black/20">
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-60">
            Catalog Search
          </span>
          <button
            onClick={onClose}
            className="text-[10px] font-mono tracking-[0.2em] uppercase hover:underline"
          >
            [ Close ESC ]
          </button>
        </div>

        {/* Input */}
        <div className="py-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, collection, category, fabric..."
            autoFocus
            className="w-full bg-transparent font-serif-aln text-3xl md:text-5xl font-light focus:outline-none placeholder:opacity-30 tracking-tight"
          />
        </div>

        {/* Dynamic Link Results */}
        <div className="mt-4 space-y-4 max-h-[55vh] overflow-y-auto">
          {loading && (
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-40">
              Searching...
            </p>
          )}

          {!loading && query && results.length === 0 && (
            <p className="text-xl font-serif-aln opacity-40 italic">
              No results found matching "{query}"
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item) => {
              // Routes dynamically to /collections/[slug] or /products/[slug]
              const targetHref =
                item.type === 'collection'
                  ? `/collections/${item.slug}`
                  : `/products/${item.slug}`;

              return (
                <Link
                  key={item.id}
                  href={targetHref}
                  onClick={onClose}
                  className="p-4 border border-black/10 hover:border-black transition flex justify-between items-center group bg-black/[0.01]"
                >
                  <div>
                    <h4 className="text-sm uppercase tracking-wide font-medium group-hover:underline">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono opacity-60">
                      <span>[{item.type.toUpperCase()}]</span>
                      {item.subtitle && <span>— {item.subtitle}</span>}
                    </div>
                  </div>
                  <span className="text-xs opacity-40 group-hover:opacity-100 transition">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}