'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

interface ColorItem {
  color_name: string;
  color_hex: string;
  image_url: string;
}

interface SizeItem {
  size_name: string;
  stock: number;
}

// Taxonomy & Tag Options
const CATEGORY_OPTIONS = [
  'tops', 'bottoms', 'outerwear', 'headwear', 'accessories', 
  'footwear', 't-shirt', 'hoodie', 'jacket', 'pants', 'shorts', 'cap', 'hat', 'bag'
];
const GENDER_OPTIONS = ['unisex', 'men', 'women'];
const TAG_OPTIONS = ['new-arrival', 'archive', 'essential', 'limited-edition'];

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    number: '',
    description: '',
    cut: '',
    fabric: '',
    price: '',
    collection_id: '',
    is_active: true,
  });

  // Taxonomy & Tag State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>(['unisex']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [colors, setColors] = useState<ColorItem[]>([]);
  const [newColor, setNewColor] = useState<ColorItem>({
    color_name: '',
    color_hex: '#000000',
    image_url: '',
  });

  const [sizes, setSizes] = useState<SizeItem[]>([]);
  const [newSize, setNewSize] = useState<SizeItem>({
    size_name: '',
    stock: 0,
  });

  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function loadProductData() {
      if (!id) return;

      const [colRes, prodRes, imgRes, colorRes, sizeRes] = await Promise.all([
        supabase.from('collections').select('id, name').order('name'),
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('product_images').select('*').eq('product_id', id).order('order_index'),
        supabase.from('product_colors').select('*').eq('product_id', id).order('order_index'),
        supabase.from('product_sizes').select('*').eq('product_id', id),
      ]);

      if (colRes.data) setCollections(colRes.data);

      if (prodRes.data) {
        const p = prodRes.data;
        setForm({
          title: p.title || p.name || '',
          slug: p.slug || '',
          number: p.number || '',
          description: p.description || '',
          cut: p.cut || '',
          fabric: p.fabric || '',
          price: String(p.price || ''),
          collection_id: p.collection_id || '',
          is_active: p.is_active ?? true,
        });
        setCoverImage(p.cover_image || '');

        // Populate Taxonomy & Tags from Database
        setSelectedCategories(p.categories || []);
        setSelectedGender(p.gender || ['unisex']);
        setSelectedTags(p.tags || []);
      }

      if (imgRes.data) setImages(imgRes.data.map((i) => i.image_url));
      if (colorRes.data) {
        setColors(
          colorRes.data.map((c) => ({
            color_name: c.color_name,
            color_hex: c.color_hex || '#000000',
            image_url: c.image_url || '',
          }))
        );
      }
      if (sizeRes.data) {
        setSizes(
          sizeRes.data.map((s) => ({
            size_name: s.size_name,
            stock: s.stock || 0,
          }))
        );
      }

      setReady(true);
    }

    loadProductData();
  }, [id]);

  function updateForm(field: string, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && typeof value === 'string') {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  // Toggle taxonomy selections
  function toggleArrayItem(list: string[], setList: (val: string[]) => void, item: string) {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  }

  function addImage() {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  }

  function removeImage(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  function addColor() {
    if (newColor.color_name.trim()) {
      setColors([...colors, { ...newColor }]);
      setNewColor({ color_name: '', color_hex: '#000000', image_url: '' });
    }
  }

  function removeColor(idx: number) {
    setColors(colors.filter((_, i) => i !== idx));
  }

  function addSize() {
    if (newSize.size_name.trim()) {
      setSizes([...sizes, { ...newSize }]);
      setNewSize({ size_name: '', stock: 0 });
    }
  }

  function removeSize(idx: number) {
    setSizes(sizes.filter((_, i) => i !== idx));
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setCoverImage(data.url);
    } catch {
      alert('Cover image upload failed');
    }
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setImages([...images, data.url]);
    } catch {
      alert('Gallery image upload failed');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: prodErr } = await supabase
        .from('products')
        .update({
          title: form.title,
          slug: form.slug,
          number: form.number || null,
          description: form.description || null,
          cut: form.cut || null,
          fabric: form.fabric || null,
          price: parseFloat(form.price) || 0,
          collection_id: form.collection_id || null,
          cover_image: coverImage || null,
          is_active: form.is_active,
          categories: selectedCategories,
          gender: selectedGender,
          tags: selectedTags,
        })
        .eq('id', id);

      if (prodErr) throw prodErr;

      // Update Gallery Images
      await supabase.from('product_images').delete().eq('product_id', id);
      if (images.length > 0) {
        await supabase.from('product_images').insert(
          images.map((url, i) => ({
            product_id: id,
            image_url: url,
            order_index: i,
          }))
        );
      }

      // Update Product Colors
      await supabase.from('product_colors').delete().eq('product_id', id);
      if (colors.length > 0) {
        await supabase.from('product_colors').insert(
          colors.map((c, i) => ({
            product_id: id,
            color_name: c.color_name,
            color_hex: c.color_hex || null,
            image_url: c.image_url || null,
            order_index: i,
          }))
        );
      }

      // Update Product Sizes
      await supabase.from('product_sizes').delete().eq('product_id', id);
      if (sizes.length > 0) {
        await supabase.from('product_sizes').insert(
          sizes.map((s) => ({
            product_id: id,
            size_name: s.size_name,
            stock: s.stock,
          }))
        );
      }

      router.push('/admin/products');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Error saving changes: ${err.message}`);
      } else {
        alert('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (confirm('Delete this product permanently?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert(error.message);
      } else {
        router.push('/admin/products');
      }
    }
  }

  if (!ready) {
    return (
      <div className="p-8 font-mono text-[10px] tracking-[0.2em] uppercase opacity-40">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 font-sans text-neutral-900">
      <div className="flex justify-between items-end border-b border-black/10 pb-6">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-50 block mb-1">
            Catalogue Edit
          </span>
          <h1 className="font-serif text-3xl font-light">{form.title || 'Edit Product'}</h1>
        </div>
        <Link
          href="/admin/products"
          className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity"
        >
          ← Return to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <fieldset className="border border-black/10 p-6 space-y-4 bg-white/50">
          <legend className="text-[9px] font-mono tracking-[0.2em] uppercase px-2 bg-[#f5f2ea]">
            Basic Specifications
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[8px] font-mono tracking-[0.14em] uppercase opacity-50 block mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-[8px] font-mono tracking-[0.14em] uppercase opacity-50 block mb-1">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateForm('slug', e.target.value)}
                className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-[8px] font-mono tracking-[0.14em] uppercase opacity-50 block mb-1">
                Number Code (e.g. ALN / 001)
              </label>
              <input
                type="text"
                value={form.number}
                onChange={(e) => updateForm('number', e.target.value)}
                className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-[8px] font-mono tracking-[0.14em] uppercase opacity-50 block mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => updateForm('price', e.target.value)}
                className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-[8px] font-mono tracking-[0.14em] uppercase opacity-50 block mb-1">
                Cut
              </label>
              <input
                type="text"
                value={form.cut}
                onChange={(e) => updateForm('cut', e.target.value)}
                className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-[8px] font-mono tracking-[0.14em] uppercase opacity-50 block mb-1">
                Fabric Specification
              </label>
              <input
                type="text"
                value={form.fabric}
                onChange={(e) => updateForm('fabric', e.target.value)}
                className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[8px] font-mono tracking-[0.14em] uppercase opacity-50 block mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={3}
              className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-[8px] font-mono tracking-[0.14em] uppercase opacity-50 block mb-1">
                Collection
              </label>
              <select
                value={form.collection_id}
                onChange={(e) => updateForm('collection_id', e.target.value)}
                className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
              >
                <option value="">None / Standalone</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateForm('is_active', e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                Active Store Visibility
              </label>
            </div>
          </div>
        </fieldset>

        {/* Taxonomy & Badges Section */}
        <fieldset className="border border-black/10 p-6 space-y-4 bg-white/50">
          <legend className="text-[9px] font-mono tracking-[0.2em] uppercase px-2 bg-[#f5f2ea]">
            Taxonomy & Badges
          </legend>

          <div className="space-y-2">
            <label className="block text-[8px] font-mono tracking-[0.14em] uppercase opacity-50">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleArrayItem(selectedCategories, setSelectedCategories, cat)}
                    className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider border transition-colors ${
                      active
                        ? 'bg-black text-[#f5f2ea] border-black'
                        : 'bg-transparent text-black border-black/20 hover:border-black'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[8px] font-mono tracking-[0.14em] uppercase opacity-50">
              Audience / Gender
            </label>
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((g) => {
                const active = selectedGender.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleArrayItem(selectedGender, setSelectedGender, g)}
                    className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider border transition-colors ${
                      active
                        ? 'bg-black text-[#f5f2ea] border-black'
                        : 'bg-transparent text-black border-black/20 hover:border-black'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[8px] font-mono tracking-[0.14em] uppercase opacity-50">
              Tags & Badges
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleArrayItem(selectedTags, setSelectedTags, tag)}
                    className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider border transition-colors ${
                      active
                        ? 'bg-black text-[#f5f2ea] border-black'
                        : 'bg-transparent text-black border-black/20 hover:border-black'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </fieldset>

        {/* Cover Image */}
        <fieldset className="border border-black/10 p-6 space-y-4 bg-white/50">
          <legend className="text-[9px] font-mono tracking-[0.2em] uppercase px-2 bg-[#f5f2ea]">
            Cover Image
          </legend>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="space-y-3 flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="text-xs font-mono"
              />
              <div>
                <label className="text-[8px] font-mono tracking-[0.14em] uppercase opacity-50 block mb-1">
                  Or Direct Asset URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
                />
              </div>
            </div>

            {coverImage && (
              <div className="relative w-32 h-40 border border-black/10 overflow-hidden bg-neutral-100 flex-shrink-0">
                <Image src={coverImage} alt="Cover Preview" fill className="object-cover" />
              </div>
            )}
          </div>
        </fieldset>

        {/* Gallery Images */}
        <fieldset className="border border-black/10 p-6 space-y-4 bg-[#f5f2ea]/30">
          <legend className="text-[9px] font-mono tracking-[0.2em] uppercase px-2 bg-[#f5f2ea]">
            Gallery Media
          </legend>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-xs font-mono"
            />
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Or paste asset URL"
              className="flex-1 min-w-[200px] border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white font-mono"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 border border-black/20 text-[9px] font-mono uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Add Asset
            </button>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            {images.map((url, i) => (
              <div
                key={i}
                className="relative w-20 h-28 border border-black/10 bg-neutral-100 overflow-hidden group"
              >
                <Image src={url} alt={`Gallery ${i}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black text-white text-xs flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Colors */}
        <fieldset className="border border-black/10 p-6 space-y-4 bg-white/50">
          <legend className="text-[9px] font-mono tracking-[0.2em] uppercase px-2 bg-[#f5f2ea]">
            Color Variants
          </legend>
          <div className="flex gap-3 flex-wrap items-end font-mono">
            <div>
              <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={newColor.color_name}
                onChange={(e) => setNewColor({ ...newColor, color_name: e.target.value })}
                className="border border-black/10 px-3 py-2 text-sm w-32 focus:outline-none focus:border-black bg-white"
              />
            </div>
            <div>
              <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">
                Hex Code
              </label>
              <div className="flex gap-1 items-center">
                <input
                  type="color"
                  value={newColor.color_hex}
                  onChange={(e) => setNewColor({ ...newColor, color_hex: e.target.value })}
                  className="w-9 h-9 border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={newColor.color_hex}
                  onChange={(e) => setNewColor({ ...newColor, color_hex: e.target.value })}
                  className="border border-black/10 px-2 py-2 text-sm w-24 focus:outline-none focus:border-black bg-white"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">
                Swatch Asset URL (Optional)
              </label>
              <input
                type="text"
                value={newColor.image_url}
                onChange={(e) => setNewColor({ ...newColor, image_url: e.target.value })}
                className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
              />
            </div>
            <button
              type="button"
              onClick={addColor}
              className="px-4 py-2 border border-black/20 text-[9px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Add Color
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {colors.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2 border border-black/10 px-3 py-1.5 text-xs font-mono bg-white"
              >
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.color_name}
                    className="w-4 h-4 rounded-full border border-black/20 object-cover"
                  />
                ) : (
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 inline-block"
                    style={{ backgroundColor: c.color_hex }}
                  />
                )}
                <span>{c.color_name}</span>
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="opacity-40 hover:opacity-100 ml-1 text-sm font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Sizes */}
        <fieldset className="border border-black/10 p-6 space-y-4 bg-white/50">
          <legend className="text-[9px] font-mono tracking-[0.2em] uppercase px-2 bg-[#f5f2ea]">
            Sizes & Inventory Allocation
          </legend>
          <div className="flex gap-3 items-end font-mono">
            <div>
              <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">
                Size Label
              </label>
              <input
                type="text"
                value={newSize.size_name}
                onChange={(e) => setNewSize({ ...newSize, size_name: e.target.value })}
                placeholder="S, M, L, XL"
                className="border border-black/10 px-3 py-2 text-sm w-32 focus:outline-none focus:border-black bg-white"
              />
            </div>
            <div>
              <label className="text-[8px] tracking-[0.14em] uppercase opacity-50 block mb-1">
                Stock Unit Count
              </label>
              <input
                type="number"
                value={newSize.stock}
                onChange={(e) =>
                  setNewSize({ ...newSize, stock: parseInt(e.target.value) || 0 })
                }
                className="border border-black/10 px-3 py-2 text-sm w-24 focus:outline-none focus:border-black bg-white"
              />
            </div>
            <button
              type="button"
              onClick={addSize}
              className="px-4 py-2 border border-black/20 text-[9px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Add Size
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {sizes.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 border border-black/10 px-3 py-1.5 text-xs font-mono bg-white"
              >
                <span className="font-bold">{s.size_name}</span>
                <span className="opacity-40">({s.stock} in stock)</span>
                <button
                  type="button"
                  onClick={() => removeSize(i)}
                  className="opacity-40 hover:opacity-100 ml-1 text-sm font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Action Buttons */}
        <div className="flex gap-4 font-mono">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-[#151515] text-[#f5f2ea] text-[10px] tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? 'Committing Changes...' : 'Save Product Record'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-8 py-4 border border-red-200 text-red-700 text-[10px] tracking-[0.2em] uppercase hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}