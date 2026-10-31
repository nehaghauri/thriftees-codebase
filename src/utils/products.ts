import { PRODUCTS } from '../data/products';
import { CATEGORIES, getCategory } from '../data/categories';
import { COLLECTIONS } from '../data/collections';
import type { Gender, Product } from '../types';

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export interface Filters {
  sizes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
}

export const EMPTY_FILTERS: Filters = { sizes: [], minPrice: null, maxPrice: null, inStockOnly: false };

export const isSortKey = (v: string | null): v is SortKey => SORT_OPTIONS.some((o) => o.value === v);

export const getProductById = (id: string | undefined) => PRODUCTS.find((p) => p.id === id);

export const getProductsByCategory = (slug: string) => PRODUCTS.filter((p) => p.categorySlug === slug);

export const getProductsByGender = (g: Gender) => PRODUCTS.filter((p) => p.gender === g);

const byNewest = (a: Product, b: Product) => b.dateAdded.localeCompare(a.dateAdded);

export const getNewArrivals = (count: number, gender?: Gender) =>
  PRODUCTS.filter((p) => !gender || p.gender === gender).sort(byNewest).slice(0, count);

export const getFeatured = (count: number) =>
  PRODUCTS.filter((p) => p.featured && p.stock > 0).sort(byNewest).slice(0, count);

/** The 8 newest products get a "New" badge. */
const NEW_IDS = new Set(getNewArrivals(8).map((p) => p.id));
export const isNewArrival = (p: Product) => NEW_IDS.has(p.id) && p.stock > 0;

export const countInCategory = (slug: string) => getProductsByCategory(slug).length;

export const getRelated = (product: Product, count = 4) => {
  const same = PRODUCTS.filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug);
  const others = PRODUCTS.filter((p) => p.id !== product.id && p.gender === product.gender && p.categorySlug !== product.categorySlug && p.stock > 0);
  return [...same, ...others].slice(0, count);
};

export const getCollectionProducts = (id: string) => {
  const c = COLLECTIONS.find((x) => x.id === id);
  return c ? c.productIds.map((pid) => getProductById(pid)).filter((p): p is Product => Boolean(p)) : [];
};

// ---------- search ----------
export function searchProducts(query: string, pool: Product[] = PRODUCTS): Product[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return pool;
  return pool
    .map((p) => {
      const cat = getCategory(p.categorySlug)?.label.toLowerCase() ?? '';
      const name = p.name.toLowerCase();
      const hay = `${name} ${cat} ${p.gender} ${p.condition.toLowerCase()} ${p.description.toLowerCase()}`;
      if (!tokens.every((t) => hay.includes(t))) return null;
      const score = tokens.reduce((s, t) => s + (name.includes(t) ? 2 : cat.includes(t) ? 1 : 0), 0);
      return { p, score };
    })
    .filter((x): x is { p: Product; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

export const searchCategories = (query: string) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return CATEGORIES.filter((c) => `${c.gender} ${c.label.toLowerCase()}`.includes(q) || c.label.toLowerCase().includes(q)).slice(0, 4);
};

// ---------- filters + sorting ----------
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const sizeRank = (s: string) => {
  const i = SIZE_ORDER.indexOf(s);
  if (i >= 0) return i;
  const n = Number(s);
  return Number.isNaN(n) ? 100 : 20 + n;
};

export const getSizeOptions = (products: Product[]) =>
  Array.from(new Set(products.flatMap((p) => p.sizes))).sort((a, b) => sizeRank(a) - sizeRank(b));

export const getPriceBounds = (products: Product[]) => {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export const countActiveFilters = (f: Filters) =>
  f.sizes.length + (f.minPrice !== null ? 1 : 0) + (f.maxPrice !== null ? 1 : 0) + (f.inStockOnly ? 1 : 0);

export function applyFilters(products: Product[], f: Filters): Product[] {
  return products.filter((p) => {
    if (f.inStockOnly && p.stock <= 0) return false;
    if (f.minPrice !== null && p.price < f.minPrice) return false;
    if (f.maxPrice !== null && p.price > f.maxPrice) return false;
    if (f.sizes.length > 0 && !p.sizes.some((s) => f.sizes.includes(s))) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  const soldLast = (a: Product, b: Product) => Number(a.stock <= 0) - Number(b.stock <= 0);
  switch (sort) {
    case 'newest':
      return list.sort((a, b) => soldLast(a, b) || byNewest(a, b));
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    default:
      return list.sort((a, b) => soldLast(a, b) || Number(b.featured) - Number(a.featured) || byNewest(a, b));
  }
}
