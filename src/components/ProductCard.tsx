import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const image = product.cover_image || '/placeholder.jpg';
  const colorDots = product.colors?.slice(0, 5).map((c) => (
    <span key={c.id} className="inline-block w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: c.color_hex || '#999' }} title={c.color_name} />
  ));

  return (
    <Link href={`/product/${product.id}`} className="group block space-y-3">
      <div className="aspect-[4/5] bg-neutral-300 relative overflow-hidden">
        <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        <div className="absolute inset-2 border border-black/20 pointer-events-none" />
        {colorDots && colorDots.length > 0 && <div className="absolute bottom-3 left-3 flex gap-1.5">{colorDots}</div>}
      </div>
      <div className="flex justify-between items-center text-[9px] tracking-[0.14em] uppercase border-b border-black/28 pb-2">
        <span>{product.number || ''}</span>
        <span>{product.title}</span>
        <span>{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}