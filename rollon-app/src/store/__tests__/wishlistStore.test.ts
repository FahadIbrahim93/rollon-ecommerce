import { describe, it, expect, beforeEach } from 'vitest';
import { useWishlistStore } from '../wishlistStore';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 100,
  image: 'test.jpg',
  slug: 'test-product',
  description: 'Test description',
  category: 'Test',
  categoryId: '1',
  rating: 4,
  reviewCount: 10,
  stock: 5,
  inStock: true,
};

describe('wishlistStore', () => {
  beforeEach(() => {
    useWishlistStore.getState().clearWishlist();
  });

  describe('initial state', () => {
    it('should have empty wishlist initially', () => {
      const { items } = useWishlistStore.getState();
      expect(items).toHaveLength(0);
    });
  });

  describe('addItem', () => {
    it('should add product to wishlist', () => {
      const { addItem } = useWishlistStore.getState();
      
      addItem(mockProduct);
      
      const items = useWishlistStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe('1');
    });

    it('should not add duplicate product', () => {
      const { addItem } = useWishlistStore.getState();
      
      addItem(mockProduct);
      addItem(mockProduct);
      
      const items = useWishlistStore.getState().items;
      expect(items).toHaveLength(1);
    });

    it('should add date when item is added', () => {
      const { addItem } = useWishlistStore.getState();
      
      addItem(mockProduct);
      
      const items = useWishlistStore.getState().items;
      expect(items[0].addedAt).toBeInstanceOf(Date);
    });
  });

  describe('removeItem', () => {
    it('should remove product from wishlist', () => {
      const { addItem, removeItem } = useWishlistStore.getState();
      
      addItem(mockProduct);
      removeItem('1');
      
      const items = useWishlistStore.getState().items;
      expect(items).toHaveLength(0);
    });

    it('should not affect other items', () => {
      const { addItem, removeItem } = useWishlistStore.getState();
      
      addItem(mockProduct);
      addItem({ ...mockProduct, id: '2' });
      removeItem('1');
      
      const items = useWishlistStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe('2');
    });
  });

  describe('toggleItem', () => {
    it('should add item if not in wishlist', () => {
      const { toggleItem } = useWishlistStore.getState();
      
      toggleItem(mockProduct);
      
      const items = useWishlistStore.getState().items;
      expect(items).toHaveLength(1);
    });

    it('should remove item if already in wishlist', () => {
      const { toggleItem } = useWishlistStore.getState();
      
      toggleItem(mockProduct);
      toggleItem(mockProduct);
      
      const items = useWishlistStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe('isInWishlist', () => {
    it('should return true for item in wishlist', () => {
      const { addItem, isInWishlist } = useWishlistStore.getState();
      
      addItem(mockProduct);
      
      expect(isInWishlist('1')).toBe(true);
    });

    it('should return false for item not in wishlist', () => {
      const { isInWishlist } = useWishlistStore.getState();
      
      expect(isInWishlist('999')).toBe(false);
    });
  });

  describe('clearWishlist', () => {
    it('should remove all items from wishlist', () => {
      const { addItem, clearWishlist } = useWishlistStore.getState();
      
      addItem(mockProduct);
      addItem({ ...mockProduct, id: '2' });
      clearWishlist();
      
      const items = useWishlistStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });
});
