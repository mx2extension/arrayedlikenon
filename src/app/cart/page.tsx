'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const ctx = useCart() as any;

  // Handles both state.items and direct cart array structures
  const items: any[] = ctx?.state?.items || ctx?.cart || [];
  const totalAmount: number = ctx?.total ?? ctx?.subtotal ?? 0;
  const itemCount: number = ctx?.count ?? items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleUpdateQty = (item: any, newQty: number) => {
    const itemKey = item.uid || item.id || item.productId;
    if (newQty <= 0) {
      handleRemove(itemKey);
      return;
    }

    if (ctx?.dispatch) {
      ctx.dispatch({ type: 'UPDATE_QTY', payload: { uid: itemKey, quantity: newQty } });
    } else if (ctx?.addToCart) {
      ctx.addToCart({ ...item, quantity: newQty - item.quantity });
    }
  };

  const handleRemove = (id: string) => {
    if (ctx?.dispatch) {
      ctx.dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else if (ctx?.removeFromCart) {
      ctx.removeFromCart(id);
    }
  };

  const handleClear = () => {
    if (ctx?.dispatch) {
      ctx.dispatch({ type: 'CLEAR_CART' });
      ctx.dispatch({ type: 'CLEAR' });
    } else if (ctx?.clearCart) {
      ctx.clearCart();
    }
  };

  return (
    <div className="bg-[#f5f2ea] text-[#151515] min-h-screen pt-32 pb-24 px-[5vw]">
      <main className="max-w-[900px] mx-auto">
        <div className="border-b border-black/20 pb-8 mb-12">
          <div className="text-[9px] tracking-[0.24em] uppercase">
            Your Cart ({itemCount})
          </div>
          <h1 className="font-serif-aln font-light text-[clamp(48px,7vw,100px)] leading-[0.75] tracking-[-0.05em] mt-2">
            CART
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <p className="font-hand-aln text-2xl opacity-40">your cart is empty</p>
            <Link
              href="/collections"
              className="inline-block border-b border-black pb-1 text-[9px] tracking-[0.2em] uppercase hover:opacity-60 transition-opacity"
            >
              Browse Collections →
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-0 divide-y divide-black/15 mb-8">
              {items.map((item: any, idx: number) => {
                const itemKey = item.uid || item.id || item.productId || `cart-item-${idx}`;
                return (
                  <div key={itemKey} className="flex gap-6 py-6">
                    <div className="w-24 h-32 bg-neutral-300 flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale mix-blend-multiply"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {item.number && (
                        <div className="text-[9px] tracking-[0.14em] uppercase opacity-50">
                          {item.number}
                        </div>
                      )}
                      <div className="font-serif-aln text-xl">{item.title}</div>
                      <div className="text-[9px] tracking-[0.12em] uppercase mt-1 opacity-60">
                        {item.colorName || item.color || 'Standard'} / {item.size || 'OS'}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 text-[9px] tracking-[0.14em]">
                          <button
                            onClick={() => handleUpdateQty(item, item.quantity - 1)}
                            className="w-7 h-7 border border-black/20 flex items-center justify-center hover:bg-black/5 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQty(item, item.quantity + 1)}
                            className="w-7 h-7 border border-black/20 flex items-center justify-center hover:bg-black/5 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-serif-aln text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(itemKey)}
                      className="text-[8px] uppercase tracking-[0.15em] opacity-40 hover:opacity-100 self-start transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-black/20 pt-6 flex justify-between items-center">
              <div>
                <div className="text-[9px] tracking-[0.2em] uppercase opacity-50">Subtotal</div>
                <div className="font-serif-aln text-3xl mt-1">{formatPrice(totalAmount)}</div>
              </div>

              <div className="space-y-3 text-right">
                <Link
                  href="/checkout"
                  className="block px-8 py-3 bg-[#151515] text-[#f5f2ea] text-[9px] tracking-[0.2em] uppercase hover:bg-black/80 transition-colors"
                >
                  Checkout →
                </Link>
                <button
                  onClick={handleClear}
                  className="block text-[9px] tracking-[0.14em] uppercase opacity-40 hover:opacity-100 transition-opacity ml-auto"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}