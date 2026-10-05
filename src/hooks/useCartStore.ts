'use client';

import { useState, useEffect } from 'react';

export interface CartItem {
  id?: string;
  productId?: string;
  title?: string;
  name?: string;
  price: number;
  image?: string;
  color?: string | null;
  size?: string | null;
  quantity: number;
}

const STORAGE_KEYS = ['aln_cart', 'cart', 'shopping_cart', 'arrayed_cart'];

/**
 * Safely reads cart data from browser local storage
 */
export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  for (const key of STORAGE_KEYS) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const items = Array.isArray(parsed) ? parsed : parsed.items || parsed.state?.cart || [];
        if (items.length > 0) return items;
      } catch (e) {
        console.error('Error parsing cart key:', key, e);
      }
    }
  }
  return [];
}

/**
 * Synchronously writes cart data across all recognized storage keys
 */
export function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  const serialized = JSON.stringify(items);
  STORAGE_KEYS.forEach((key) => localStorage.setItem(key, serialized));
}

/**
 * Custom React hook for subscribing to cart storage updates
 */
export function useCartStore() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial sync on mount
    const items = getStoredCart();
    setCart(items);
    setIsLoaded(true);

    // Listen for cross-tab or component storage events
    const handleStorageChange = () => {
      setCart(getStoredCart());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateCart = (newItems: CartItem[]) => {
    setCart(newItems);
    saveCartToStorage(newItems);
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  return {
    cart,
    isLoaded,
    subtotal,
    updateCart,
    clearCart,
  };
}