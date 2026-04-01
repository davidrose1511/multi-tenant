"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  size?: string | null;
  color?: string | null;
};

type CartEntry = CartItem & { quantity: number };

type CartContextType = {
  items: CartEntry[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
  mounted: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const storageKey = `cart-${slug}`;
  const [items, setItems] = useState<CartEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  // load from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
    setMounted(true);
  }, [storageKey]);

  // persist to localStorage on every change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey, mounted]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        totalItems,
        mounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
