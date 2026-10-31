import { STORAGE_KEYS } from '../data/site';
import type { Order } from '../types';
import { readJSON, writeJSON } from './storage';

export const getOrders = (): Order[] => {
  const data = readJSON<unknown>(STORAGE_KEYS.orders, []);
  return Array.isArray(data) ? (data as Order[]) : [];
};

export const getOrderById = (id: string | undefined) => getOrders().find((o) => o.id === id);

export const saveOrder = (order: Order) => writeJSON(STORAGE_KEYS.orders, [order, ...getOrders()]);

/** e.g. THR-261028-7K3Q, checked against saved orders so it is always unique */
export function generateOrderId(): string {
  const existing = new Set(getOrders().map((o) => o.id));
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  do {
    let suffix = '';
    for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    id = `THR-${stamp}-${suffix}`;
  } while (existing.has(id));
  return id;
}
