import type { Category, Gender } from '../types';

const make = (gender: Gender, label: string): Category => ({
  gender,
  label,
  slug: `${gender}-${label.toLowerCase().replace(/\s+/g, '-')}`,
});

export const MEN_CATEGORIES: Category[] = [
  'T-Shirts', 'Shirts', 'Hoodies', 'Sweaters', 'Jackets', 'Jeans', 'Trousers', 'Shorts', 'Accessories',
].map((l) => make('men', l));

export const WOMEN_CATEGORIES: Category[] = [
  'Crop Tops', 'Tops', 'T-Shirts', 'Sweaters', 'Hoodies', 'Cardigans', 'Jackets', 'Jeans', 'Trousers', 'Skirts', 'Dresses', 'Shawls', 'Accessories',
].map((l) => make('women', l));

export const CATEGORIES: Category[] = [...WOMEN_CATEGORIES, ...MEN_CATEGORIES];

export const getCategory = (slug: string | undefined) => CATEGORIES.find((c) => c.slug === slug);

export const categoriesFor = (gender: Gender) => (gender === 'men' ? MEN_CATEGORIES : WOMEN_CATEGORIES);

export const GENDER_LABEL: Record<Gender, string> = { men: 'Men', women: 'Women' };
