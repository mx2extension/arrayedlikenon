'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId?: string;
  title: string;
  price: number;
  image: string;
  color?: string | null;
  size?: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'SET_DRAWER'; payload: boolean }
  | { type: 'HYDRATE_CART'; payload: CartItem[] };

const STORAGE_KEYS = ['aln_cart', 'cart', 'shopping_cart', 'arrayed_cart'];

function saveToLocalStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  const serialized = JSON.stringify(items);
  STORAGE_KEYS.forEach((key) => localStorage.setItem(key, serialized));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE_CART': {
      return { ...state, items: action.payload };
    }

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );

      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity || 1;
      } else {
        newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }

      // Sync immediately to browser storage
      saveToLocalStorage(newItems);

      return {
        ...state,
        items: newItems,
        isDrawerOpen: true, // Automatically open drawer when adding item
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      saveToLocalStorage(newItems);
      return { ...state, items: newItems };
    }

    case 'CLEAR_CART': {
      if (typeof window !== 'undefined') {
        STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
      }
      return { ...state, items: [] };
    }

    case 'TOGGLE_DRAWER': {
      return { ...state, isDrawerOpen: !state.isDrawerOpen };
    }

    case 'SET_DRAWER': {
      return { ...state, isDrawerOpen: action.payload };
    }

    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  isDrawerOpen: boolean;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isDrawerOpen: false });

  // 1. Hydrate cart from localStorage as soon as component mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    for (const key of STORAGE_KEYS) {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const loadedItems = Array.isArray(parsed) ? parsed : parsed.items || [];
          if (loadedItems.length > 0) {
            dispatch({ type: 'HYDRATE_CART', payload: loadedItems });
            break;
          }
        } catch (err) {
          console.error('Failed parsing cart storage:', err);
        }
      }
    }
  }, []);

  const count = state.items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = state.items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        count,
        subtotal,
        isDrawerOpen: state.isDrawerOpen,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}