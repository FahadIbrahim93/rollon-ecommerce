import { describe, expect, it } from 'vitest';
import type { Category, Product } from '@/types';
import {
  filterProducts,
  getNextVisibleCount,
  getVisibleProducts,
  INITIAL_VISIBLE_PRODUCTS,
  LOAD_MORE_STEP,
  resolveCategoryIdFromSlug,
  sortProducts,
} from '../shop';

const categories: Category[] = [
  { id: '2', name: 'Grinders', slug: 'grinders', description: '', productCount: 10 },
  { id: '5', name: 'Lighters', slug: 'lighters', description: '', productCount: 12 },
];

const products: Product[] = [
  {
    id: '1',
    name: 'Alpha Grinder',
    slug: 'alpha-grinder',
    description: 'Metal grinder',
    price: 100,
    image: '/a.jpg',
    category: 'Grinders',
    categoryId: '2',
    rating: 4.2,
    reviewCount: 12,
    inStock: true,
    stock: 8,
    featured: true,
  },
  {
    id: '2',
    name: 'Omega Lighter',
    slug: 'omega-lighter',
    description: 'Windproof lighter',
    price: 200,
    image: '/b.jpg',
    category: 'Lighters',
    categoryId: '5',
    rating: 4.9,
    reviewCount: 20,
    inStock: true,
    stock: 5,
    featured: false,
  },
  {
    id: '3',
    name: 'Beta Grinder',
    slug: 'beta-grinder',
    description: 'Precision grinder',
    price: 80,
    image: '/c.jpg',
    category: 'Grinders',
    categoryId: '2',
    rating: 3.9,
    reviewCount: 5,
    inStock: true,
    stock: 3,
    featured: true,
  },
];

describe('shop utils', () => {
  it('resolves category id from slug', () => {
    expect(resolveCategoryIdFromSlug(categories, 'grinders')).toBe('2');
  });

  it('returns null when slug is all', () => {
    expect(resolveCategoryIdFromSlug(categories, 'all')).toBeNull();
  });

  it('filters by category id', () => {
    const result = filterProducts(products, '2', '');
    expect(result).toHaveLength(2);
  });

  it('filters by query in name and description', () => {
    expect(filterProducts(products, null, 'omega')).toHaveLength(1);
    expect(filterProducts(products, null, 'precision')).toHaveLength(1);
  });

  it('trims and normalizes query', () => {
    const result = filterProducts(products, null, '  ALPHA ');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('sorts by price low-high', () => {
    const result = sortProducts(products, 'price-low');
    expect(result.map((p) => p.id)).toEqual(['3', '1', '2']);
  });

  it('sorts by rating', () => {
    const result = sortProducts(products, 'rating');
    expect(result[0].id).toBe('2');
  });

  it('sorts by featured as default', () => {
    const result = sortProducts(products, 'featured');
    expect(result[0].featured).toBe(true);
  });

  it('paginates visible products safely', () => {
    expect(getVisibleProducts(products, 2)).toHaveLength(2);
    expect(getVisibleProducts(products, -1)).toHaveLength(0);
  });

  it('increments load-more count with expected constants', () => {
    expect(INITIAL_VISIBLE_PRODUCTS).toBe(12);
    expect(getNextVisibleCount(INITIAL_VISIBLE_PRODUCTS)).toBe(INITIAL_VISIBLE_PRODUCTS + LOAD_MORE_STEP);
  });
});
