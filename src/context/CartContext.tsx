import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SHIPPING, STORAGE_KEYS } from '../data/site';
import type { CartItem, CartLine, Product } from '../types';
import { getProductById } from '../utils/products';
import { readJSON, writeJSON } from '../utils/storage';

export type AddResult = { ok: true } | { ok: false; reason: string };

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (product: Product, size: string, quantity?: number) => AddResult;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  /** Pieces of this product already in the cart (all sizes) */
  quantityInCart: (productId: string) => number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const lineKey = (productId: string, size: string) => `${productId}__${size}`;

export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= SHIPPING.freeOver ? 0 : SHIPPING.flatFee;

/** Drops anything invalid or over stock, so a stale/edited cart can never break the app. */
function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<string, CartItem>();
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue;
    const { productId, size, quantity } = r as Partial<CartItem>;
    if (typeof productId !== 'string' || typeof size !== 'string' || !Number.isInteger(quantity) || (quantity as number) < 1) continue;
    const product = getProductById(productId);
    if (!product || product.stock <= 0 || !product.sizes.includes(size)) continue;
    const key = lineKey(productId, size);
    const prev = merged.get(key);
    merged.set(key, { productId, size, quantity: (prev?.quantity ?? 0) + (quantity as number) });
  }
  const used = new Map<string, number>();
  const result: CartItem[] = [];
  for (const item of merged.values()) {
    const product = getProductById(item.productId)!;
    const left = product.stock - (used.get(item.productId) ?? 0);
    const quantity = Math.min(item.quantity, left);
    if (quantity < 1) continue;
    used.set(item.productId, (used.get(item.productId) ?? 0) + quantity);
    result.push({ ...item, quantity });
  }
  return result;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => sanitize(readJSON<unknown>(STORAGE_KEYS.cart, [])));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Persist
  useEffect(() => {
    writeJSON(STORAGE_KEYS.cart, items);
  }, [items]);

  // Keep other open tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.cart) setItems(sanitize(readJSON<unknown>(STORAGE_KEYS.cart, [])));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((i) => {
        const product = getProductById(i.productId);
        return product ? [{ key: lineKey(i.productId, i.size), product, size: i.size, quantity: i.quantity }] : [];
      }),
    [items],
  );

  const quantityInCart = useCallback(
    (productId: string) => items.filter((i) => i.productId === productId).reduce((n, i) => n + i.quantity, 0),
    [items],
  );

  const addItem = useCallback(
    (product: Product, size: string, quantity = 1): AddResult => {
      if (product.stock <= 0) return { ok: false, reason: 'This piece has sold out.' };
      if (!product.sizes.includes(size)) return { ok: false, reason: 'Please choose a size.' };
      const inCart = items.filter((i) => i.productId === product.id).reduce((n, i) => n + i.quantity, 0);
      const available = product.stock - inCart;
      if (available <= 0) {
        return { ok: false, reason: product.stock === 1 ? 'This one-of-a-kind piece is already in your cart.' : `You already have all ${product.stock} in your cart.` };
      }
      if (quantity > available) return { ok: false, reason: `Only ${available} more available.` };
      setItems((prev) => {
        const found = prev.find((i) => i.productId === product.id && i.size === size);
        return found
          ? prev.map((i) => (i === found ? { ...i, quantity: i.quantity + quantity } : i))
          : [...prev, { productId: product.id, size, quantity }];
      });
      setDrawerOpen(true);
      return { ok: true };
    },
    [items],
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => lineKey(i.productId, i.size) !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) => {
      const target = prev.find((i) => lineKey(i.productId, i.size) === key);
      if (!target) return prev;
      if (quantity < 1) return prev.filter((i) => i !== target);
      const product = getProductById(target.productId);
      if (!product) return prev;
      const others = prev.filter((i) => i !== target && i.productId === target.productId).reduce((n, i) => n + i.quantity, 0);
      const capped = Math.max(1, Math.min(quantity, product.stock - others));
      return prev.map((i) => (i === target ? { ...i, quantity: capped } : i));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
    const shipping = shippingFor(subtotal);
    return {
      lines,
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      quantityInCart,
      drawerOpen,
      openDrawer,
      closeDrawer,
    };
  }, [lines, addItem, removeItem, updateQuantity, clearCart, quantityInCart, drawerOpen, openDrawer, closeDrawer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
