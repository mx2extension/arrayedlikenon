'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/cart-context';

export default function CartDrawer() {
  const router = useRouter();
  const { items, subtotal, isDrawerOpen, dispatch } = useCart();

  const handleClose = () => {
    dispatch({ type: 'SET_DRAWER', payload: false });
  };

  const handleProceedToCheckout = () => {
    // Force immediate sync to browser storage before navigation
    if (typeof window !== 'undefined') {
      const serialized = JSON.stringify(items);
      ['aln_cart', 'cart', 'shopping_cart', 'arrayed_cart'].forEach((key) => {
        localStorage.setItem(key, serialized);
      });
    }

    // Close the drawer state
    dispatch({ type: 'SET_DRAWER', payload: false });

    // Navigate to checkout
    router.push('/checkout');
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdfbf7] border-l border-black/10 text-neutral-900 flex flex-col justify-between p-6 sm:p-8 shadow-xl">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">
                Shopping Bag ({items.reduce((acc, i) => acc + (i.quantity || 1), 0)})
              </span>
              <button
                onClick={handleClose}
                className="text-[10px] tracking-[0.2em] uppercase hover:opacity-50 transition-opacity p-1"
              >
                Close [✕]
              </button>
            </div>

            {/* Items List */}
            <div className="mt-6 space-y-6 max-h-[55vh] overflow-y-auto pr-2 divide-y divide-neutral-200/60">
              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs uppercase tracking-widest opacity-50">
                    Your bag is currently empty.
                  </p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.id}-${item.size}-${idx}`} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <div className="relative w-16 h-20 bg-neutral-100 border border-neutral-200 flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title || 'Product Image'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] opacity-40">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1 text-xs">
                      <p className="font-medium truncate uppercase tracking-wider">{item.title}</p>
                      <p className="text-[10px] opacity-60">
                        {item.size ? `Size: ${item.size}` : ''} {item.color ? `| ${item.color}` : ''}
                      </p>
                      <p className="text-xs font-semibold mt-1">
                        ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                      className="text-[9px] uppercase tracking-widest text-red-700/70 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer & Checkout Action */}
          <div className="border-t border-black/10 pt-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            <p className="text-[9px] opacity-50 tracking-wider uppercase">
              Shipping, taxes, and queue assignment calculated at checkout.
            </p>

            {items.length > 0 ? (
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#151515] text-[#f5f2ea] text-[10px] uppercase tracking-[0.25em] hover:bg-black transition-all"
              >
                Proceed to Checkout
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-4 border border-black/20 text-[10px] uppercase tracking-[0.25em] hover:bg-black/5 transition-all"
              >
                Continue Browsing
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}