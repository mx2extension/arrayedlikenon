'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, ProductImage, ProductColor, ProductSize } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

export default function ProductPage() {
  const { id } = useParams();
  const { dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase
        .from('products')
        .select('*, collection:collections(id, name, slug)')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (p) {
        setProduct(p);
        if (p.cover_image) setActiveImage(p.cover_image);
      }

      const { data: imgs } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('order_index');

      if (imgs && imgs.length > 0) {
        setImages(imgs);
        setActiveImage(imgs[0].image_url);
      } else if (p?.cover_image) {
        setActiveImage(p.cover_image);
      }

      const { data: cols } = await supabase
        .from('product_colors')
        .select('*')
        .eq('product_id', id)
        .order('order_index');

      if (cols && cols.length > 0) {
        setColors(cols);
        setSelectedColor(cols[0]);
        if (cols[0].image_url) setActiveImage(cols[0].image_url);
      }

      const { data: szs } = await supabase
        .from('product_sizes')
        .select('*')
        .eq('product_id', id);

      if (szs) setSizes(szs);
    })();
  }, [id]);

  const currentImage = selectedColor?.image_url || activeImage || product?.cover_image || '';

  const allImages: string[] = [];
  if (selectedColor?.image_url) {
    allImages.push(selectedColor.image_url);
  }
  images.forEach((img) => {
    if (img.image_url !== selectedColor?.image_url) {
      allImages.push(img.image_url);
    }
  });

  function handleAddToCart() {
    if (!product || !selectedColor || !selectedSize) return;

    const sizeStock = sizes.find((s) => s.size_name === selectedSize)?.stock || 0;
    if (sizeStock <= 0) return;

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        uid: `${product.id}-${selectedColor.color_name}-${selectedSize}`,
        productId: product.id,
        title: product.title,
        number: product.number,
        price: product.price,
        color: selectedColor.color_hex || '',
        colorName: selectedColor.color_name,
        size: selectedSize,
        quantity: 1,
        image: currentImage,
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const sizeStock = sizes.find((s) => s.size_name === selectedSize)?.stock || 0;
  const canAdd = selectedColor && selectedSize && sizeStock > 0;

  if (!product) {
    return (
      <div className="min-h-screen pt-32 px-[5vw] bg-[#f5f2ea]">
        <p className="font-hand-aln text-xl opacity-40">loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <div className="max-w-[1250px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-12 border-b border-black/20 pb-6">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase">
              {product.number || 'ALN'} / {product.collection?.name || 'Piece'}
            </div>
            <h1 className="font-serif-aln font-light text-[clamp(48px,7vw,100px)] leading-[0.75] tracking-[-0.05em] mt-2">
              {product.title}
            </h1>
          </div>
          <Link
            href={product.collection ? `/collections/${product.collection.slug}` : '/collections'}
            className="text-[9px] tracking-[0.18em] uppercase hover:underline pt-2"
          >
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

          {/* ── Left: Images ── */}
          <div className="space-y-3">
            <div className="aspect-[3/4] bg-neutral-300 overflow-hidden relative">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {/* Color swatch overlay on image */}
              {selectedColor?.color_hex && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full border-2 border-white/80 shadow-sm"
                    style={{ backgroundColor: selectedColor.color_hex }}
                  />
                  <span className="text-[8px] tracking-[0.14em] uppercase bg-white/80 backdrop-blur-sm px-2 py-1">
                    {selectedColor.color_name}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-20 flex-shrink-0 bg-neutral-300 overflow-hidden border-2 transition-all duration-200 ${
                      img === currentImage
                        ? 'border-[#151515] opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div className="space-y-8">

            {/* Price */}
            <div className="font-serif-aln text-3xl tracking-wide">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-serif-aln text-xl leading-[1.25] opacity-80 max-w-[440px]">
                {product.description}
              </p>
            )}

            {/* ── Color Selector ── */}
            {colors.length > 0 && (
              <div className="space-y-3">
                <div className="text-[9px] tracking-[0.2em] uppercase">
                  Color — <span className="opacity-60">{selectedColor?.color_name || 'Select'}</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedColor(c);
                        if (c.image_url) setActiveImage(c.image_url);
                        else setActiveImage(product.cover_image || images[0]?.image_url || '');
                        setAdded(false);
                      }}
                      className={`relative w-11 h-11 rounded-full border-2 transition-all duration-200 ${
                        c.id === selectedColor?.id
                          ? 'border-[#151515] scale-110 shadow-md'
                          : 'border-black/15 hover:border-black/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.color_hex || '#999' }}
                      title={c.color_name}
                    >
                      {c.id === selectedColor?.id && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-sm" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Size Selector ── */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <div className="text-[9px] tracking-[0.2em] uppercase">
                  Size{selectedSize && <span className="opacity-60"> — {selectedSize}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => {
                    const isSelected = s.size_name === selectedSize;
                    const isOut = s.stock <= 0;
                    return (
                      <button
                        key={s.id}
                        onClick={() => { if (!isOut) { setSelectedSize(s.size_name); setAdded(false); } }}
                        disabled={isOut}
                        className={`min-w-[52px] px-4 py-2.5 text-[9px] tracking-[0.14em] uppercase border transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#151515] text-[#f5f2ea] border-[#151515]'
                            : isOut
                            ? 'border-black/10 opacity-25 cursor-not-allowed line-through'
                            : 'border-black/20 hover:border-[#151515] hover:bg-black/[0.03]'
                        }`}
                      >
                        {s.size_name}
                        <span className="block text-[7px] mt-0.5 opacity-60">
                          {isOut ? 'Sold out' : `${s.stock} left`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Add to Cart ── */}
            <button
              onClick={handleAddToCart}
              disabled={!canAdd}
              className={`w-full py-4 text-[9px] tracking-[0.2em] uppercase transition-all duration-300 ${
                added
                  ? 'bg-green-800 text-[#f5f2ea]'
                  : !canAdd
                  ? 'bg-neutral-300 text-black/25 cursor-not-allowed'
                  : 'bg-[#151515] text-[#f5f2ea] hover:bg-black/80 active:scale-[0.99]'
              }`}
            >
              {!selectedColor
                ? 'Select a Color'
                : !selectedSize
                ? 'Select a Size'
                : sizeStock <= 0
                ? 'Sold Out'
                : added
                ? '✓ Added to Cart'
                : 'Add to Cart'}
            </button>

            {added && (
              <div className="text-center -mt-4">
                <Link href="/cart" className="text-[9px] tracking-[0.14em] uppercase underline underline-offset-4 opacity-60 hover:opacity-100 transition">
                  View Cart →
                </Link>
              </div>
            )}

            {/* ── Details Table ── */}
            <div className="border-t border-black/20 pt-6 space-y-0 text-[9px] tracking-[0.12em] uppercase">
              {product.cut && (
                <div className="flex justify-between border-b border-black/10 py-3">
                  <span className="opacity-40">Cut</span>
                  <span>{product.cut}</span>
                </div>
              )}
              {product.fabric && (
                <div className="flex justify-between border-b border-black/10 py-3">
                  <span className="opacity-40">Fabric</span>
                  <span>{product.fabric}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-black/10 py-3">
                <span className="opacity-40">Origin</span>
                <span>ALN Atelier</span>
              </div>
              {product.collection && (
                <div className="flex justify-between border-b border-black/10 py-3">
                  <span className="opacity-40">Collection</span>
                  <Link
                    href={`/collections/${product.collection.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {product.collection.name}
                  </Link>
                </div>
              )}
              {product.number && (
                <div className="flex justify-between py-3">
                  <span className="opacity-40">Reference</span>
                  <span>{product.number}</span>
                </div>
              )}
            </div>

            {/* ── Shipping Note ── */}
            <div className="pt-4 space-y-2 text-[9px] opacity-40 leading-[1.6]">
              <p>Each piece is made to order. Please allow 7–14 business days for production before dispatch.</p>
              <p>Shipping is calculated at checkout. Tracking ID provided upon payment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}