/**
 * @file src/lib/stores/cart.ts
 * @description Zustand cart store for managing shopping cart state.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  beatId: string;
  licenseId: string;
  title: string;
  price: number;
  producerId: string;
  producerName: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (beatId: string, licenseId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        set((state) => {
          // Check if item already exists
          const exists = state.items.some(
            (i) => i.beatId === item.beatId && i.licenseId === item.licenseId
          );

          if (!exists) {
            return { items: [...state.items, item] };
          }

          return state;
        });
      },

      removeItem: (beatId: string, licenseId: string) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.beatId === beatId && i.licenseId === licenseId)
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0);
      },
    }),
    {
      name: 'beatforge-cart',
      version: 1,
    }
  )
);
