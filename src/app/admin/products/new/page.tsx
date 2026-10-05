'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface CollectionOption {
  id: string;
  name: string;
}

interface ColorOption {
  color_name: string;
  color_hex: string;
  image_url: string;
}

interface SizeStock {
  size: string;
  quantity: number;
}

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];

// Taxonomy Options
const CATEGORY_OPTIONS = [
  'tops', 'bottoms', 'outerwear', 'headwear', 'accessories', 'skirts', 
  'footwear', 't-shirt', 'hoodie', 'jacket', 'pants', 'shorts', 'cap', 'hat', 'bag'
];

const GENDER_OPTIONS = ['unisex', 'men', 'women'];
const TAG_OPTIONS = ['new-arrival', 'archive', 'essential', 'limited-edition'];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<CollectionOption[]>([]);

  // 1. Base Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [orderIndex, setOrderIndex] = useState('0');

  // 2. Taxonomy & Tagging State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>(['unisex']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 3. Size Inventory State
  const [sizeInventory, setSizeInventory] = useState<SizeStock[]>(
    DEFAULT_SIZES.map((size) => ({ size, quantity: 0 }))
  );

  // 4. Color Variant State
  const [colors, setColors] = useState<ColorOption[]>([
    { color_name: 'Black', color_hex: '#000000', image_url: '' },
  ]);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const { data, error } = await supabase.from('collections').select('id, name');
    if (error) {
      console.error('Error fetching collections:', error.message || JSON.stringify(error));
    } else if (data && data.length > 0) {
      setCollections(data);
      setCollectionId(data[0].id);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  // Toggle taxonomy values
  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Size Inventory Handlers
  const handleQuantityChange = (size: string, quantity: number) => {
    setSizeInventory((prev) =>
      prev.map((item) => (item.size === size ? { ...item, quantity } : item))
    );
  };

  // Color Variant Handlers
  const addColorRow = () => {
    setColors([...colors, { color_name: '', color_hex: '#000000', image_url: '' }]);
  };

  const removeColorRow = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColorField = (index: number, field: keyof ColorOption, value: string) => {
    const updated = [...colors];
    updated[index][field] = value;
    setColors(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Derive primary cover image from first populated color URL
      const primaryImage = colors.find((c) => c.image_url.trim() !== '')?.image_url || null;

      // Extract non-zero size selections for array column
      const selectedSizesArray = sizeInventory
        .filter((s) => s.quantity > 0)
        .map((s) => s.size);

      // 1. Insert Base Product (mapped 'name' to 'title')
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([
          {
            title: name,
            slug,
            description,
            price: parseFloat(price) || 0,
            collection_id: collectionId || null,
            cover_image: primaryImage,
            is_active: isActive,
            order_index: parseInt(orderIndex, 10) || 0,
            sizes: selectedSizesArray,
            categories: selectedCategories,
            gender: selectedGender,
            tags: selectedTags,
          },
        ])
        .select('id')
        .single();

      if (productError) throw productError;

      const productId = productData.id;

      // 2. Insert Color Variants
      const validColors = colors.filter((c) => c.color_name.trim() !== '');
      if (validColors.length > 0) {
        const colorPayloads = validColors.map((c) => ({
          product_id: productId,
          color_name: c.color_name,
          color_hex: c.color_hex,
          image_url: c.image_url,
        }));

        const { error: colorsError } = await supabase
          .from('product_colors')
          .insert(colorPayloads);

        if (colorsError) throw colorsError;
      }

      // 3. Insert Size Quantities into Inventory Table
      const validSizes = sizeInventory.filter((s) => s.quantity > 0);
      if (validSizes.length > 0) {
        const variantPayloads = validSizes.map((s) => ({
          product_id: productId,
          size: s.size,
          stock_quantity: s.quantity,
        }));

        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantPayloads);

        if (variantsError) throw variantsError;
      }

      router.push('/admin/products');
    } catch (err: any) {
      console.error('Error creating product:', err.message || JSON.stringify(err));
      alert('Failed to create product. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f2ea] text-[#151515] p-8 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-black/20 pb-4">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase opacity-60">Admin Panel</div>
            <h1 className="font-serif-aln text-3xl font-light">New Product</h1>
          </div>
          <Link href="/admin/products" className="text-[9px] tracking-[0.18em] uppercase hover:underline">
            ← Back to Products
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Base Overview */}
          <div className="space-y-4">
            <h2 className="text-xs tracking-[0.2em] uppercase border-b border-black/10 pb-2">1. Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[9px] tracking-[0.18em] uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Oversized Linen Shirt"
                  className="w-full bg-transparent border border-black/30 p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] tracking-[0.18em] uppercase">Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-transparent border border-black/30 p-3 text-sm focus:outline-none focus:border-black font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[9px] tracking-[0.18em] uppercase">Collection</label>
                <select
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                  className="w-full bg-transparent border border-black/30 p-3 text-sm focus:outline-none focus:border-black"
                >
                  {collections.length === 0 ? (
                    <option value="">No collections found</option>
                  ) : (
                    collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] tracking-[0.18em] uppercase">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250.00"
                  className="w-full bg-transparent border border-black/30 p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] tracking-[0.18em] uppercase">Order Index</label>
                <input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(e.target.value)}
                  className="w-full bg-transparent border border-black/30 p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] tracking-[0.18em] uppercase">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent border border-black/30 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Section 2: Taxonomy & Tagging */}
          <div className="space-y-4">
            <h2 className="text-xs tracking-[0.2em] uppercase border-b border-black/10 pb-2">2. Taxonomy & Badges</h2>

            <div className="space-y-2">
              <label className="block text-[9px] tracking-[0.18em] uppercase opacity-70">Categories</label>
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
              <label className="block text-[9px] tracking-[0.18em] uppercase opacity-70">Audience / Gender</label>
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
              <label className="block text-[9px] tracking-[0.18em] uppercase opacity-70">Tags & Badges</label>
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
          </div>

          {/* Section 3: Size & Stock Quantity */}
          <div className="space-y-4">
            <h2 className="text-xs tracking-[0.2em] uppercase border-b border-black/10 pb-2">3. Inventory by Size</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sizeInventory.map((item) => (
                <div key={item.size} className="border border-black/20 p-3 bg-black/[0.02] space-y-1">
                  <label className="block text-[9px] tracking-[0.18em] uppercase font-bold">{item.size}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.size, parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-transparent border border-black/30 p-2 text-xs focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Color Variants */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-black/10 pb-2">
              <h2 className="text-xs tracking-[0.2em] uppercase">4. Colors & Images</h2>
              <button
                type="button"
                onClick={addColorRow}
                className="text-[9px] tracking-[0.18em] uppercase underline hover:opacity-70"
              >
                + Add Color Variant
              </button>
            </div>

            <div className="space-y-3">
              {colors.map((col, idx) => (
                <div key={idx} className="flex gap-3 items-center border border-black/20 p-3 bg-black/[0.02]">
                  <input
                    type="color"
                    value={col.color_hex}
                    onChange={(e) => updateColorField(idx, 'color_hex', e.target.value)}
                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Color Name (e.g. Olive Green)"
                    value={col.color_name}
                    onChange={(e) => updateColorField(idx, 'color_name', e.target.value)}
                    className="w-1/3 bg-transparent border border-black/30 p-2 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Image URL (Cloudinary / Unsplash)"
                    value={col.image_url}
                    onChange={(e) => updateColorField(idx, 'image_url', e.target.value)}
                    className="flex-1 bg-transparent border border-black/30 p-2 text-xs focus:outline-none"
                  />
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColorRow(idx)}
                      className="text-red-700 text-xs px-2 hover:underline"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-black"
            />
            <label htmlFor="isActive" className="text-[10px] tracking-[0.18em] uppercase">
              Active / Visible on Storefront
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#151515] text-[#f5f2ea] p-4 text-[10px] tracking-[0.2em] uppercase hover:bg-black/80 transition disabled:opacity-50"
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </form>
      </div>
    </main>
  );
}