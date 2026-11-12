'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (uid: string) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Initial Load from LocalStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aln_cart') || localStorage.getItem('cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCart(Array.isArray(parsed) ? parsed : parsed.items || []);
      }
    } catch (err) {
      console.error('Error reading cart state on mount:', err);
    }
  }, []);

  // 2. Persist state to LocalStorage whenever cart updates
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('aln_cart', JSON.stringify(cart));
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const index = prev.findIndex((i) => i.uid === newItem.uid);

      let updated: CartItem[];
      if (index > -1) {
        updated = [...prev];
        updated[index].quantity += newItem.quantity || 1;
      } else {
        updated = [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
      }

      // Synchronous write to guarantee state persistence before navigation
      localStorage.setItem('aln_cart', JSON.stringify(updated));
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (uid: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.uid !== uid);
      localStorage.setItem('aln_cart', JSON.stringify(updated));
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('aln_cart');
    localStorage.removeItem('cart');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to consume Cart Context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}