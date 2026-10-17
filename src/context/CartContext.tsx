'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';

export interface CartToastData {
  id: string;
  productId: string;
  name: string;
  brandName?: string;
  price: number;
  imageUrl?: string;
  size?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>, options?: { openDrawer?: boolean; showToast?: boolean }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toast: CartToastData | null;
  showToast: (data: CartToastData) => void;
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [toast, setToast] = useState<CartToastData | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('lumera_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('lumera_cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const showToast = (data: CartToastData) => {
    setToast(data);
  };

  const hideToast = () => {
    setToast(null);
  };

  const addItem = (
    item: Omit<CartItem, 'id'>,
    options?: { openDrawer?: boolean; showToast?: boolean }
  ) => {
    const id = `${item.productId}_${item.variantId || item.size || 'default'}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });

    if (options?.openDrawer) {
      setIsDrawerOpen(true);
    }

    if (options?.showToast !== false) {
      setToast({
        id: `${id}_${Date.now()}`,
        productId: item.productId,
        name: item.name,
        brandName: item.brandName,
        price: item.price,
        imageUrl: item.imageUrl,
        size: item.size,
        quantity: item.quantity,
      });
    }
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Free complimentary shipping across Saudi Arabia
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shippingFee,
        total,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
