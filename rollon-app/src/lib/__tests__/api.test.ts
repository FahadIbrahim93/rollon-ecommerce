import { describe, it, expect } from 'vitest';
import { api } from '../../lib/api';

describe('api', () => {
  describe('products', () => {
    it('should get all products', async () => {
      const products = await api.products.getAll();
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
    });

    it('should get product by id', async () => {
      const product = await api.products.getById('fb-1');
      expect(product).toBeDefined();
      expect(product?.id).toBe('fb-1');
    });

    it('should get product by slug', async () => {
      const product = await api.products.getBySlug('hb109-hot-silicon-bong');
      expect(product).toBeDefined();
      expect(product?.slug).toBe('hb109-hot-silicon-bong');
    });

    it('should return undefined for non-existent product', async () => {
      const product = await api.products.getById('999');
      expect(product).toBeUndefined();
    });

    it('should get products by category', async () => {
      const products = await api.products.getByCategory('3');
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      products.forEach(p => expect(p.categoryId).toBe('3'));
    });

    it('should get featured products', async () => {
      const products = await api.products.getFeatured();
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
    });

    it('should search products', async () => {
      const products = await api.products.search('grinder');
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
    });
  });

  describe('categories', () => {
    it('should get all categories', async () => {
      const categories = await api.categories.getAll();
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should get category by id', async () => {
      const category = await api.categories.getById('1');
      expect(category).toBeDefined();
      expect(category?.id).toBe('1');
    });

    it('should get category by slug', async () => {
      const category = await api.categories.getBySlug('vaporizers');
      expect(category).toBeDefined();
      expect(category?.slug).toBe('vaporizers');
    });
  });

  describe('testimonials', () => {
    it('should get all testimonials', async () => {
      const testimonials = await api.testimonials.getAll();
      expect(testimonials).toBeDefined();
      expect(Array.isArray(testimonials)).toBe(true);
    });
  });

  describe('orders', () => {
    it('should get all orders', async () => {
      const orders = await api.orders.getAll();
      expect(orders).toBeDefined();
      expect(Array.isArray(orders)).toBe(true);
    });

    it('should get order by id', async () => {
      const order = await api.orders.getById('fb-order-1');
      expect(order).toBeDefined();
    });

    it('should create new order', async () => {
      const newOrder = await api.orders.create({
        customerId: 'fb-customer-1',
        customerName: 'Test User',
        items: [],
        total: 1000,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'cod',
        shippingAddress: {
          name: 'Test',
          address: 'Test',
          city: 'Dhaka',
          phone: '0123456789',
        },
      });
      expect(newOrder).toBeDefined();
      expect(newOrder.orderNumber).toBeDefined();
      expect(newOrder.id).toBeDefined();
    });
  });

  describe('customers', () => {
    it('should get all customers', async () => {
      const customers = await api.customers.getAll();
      expect(customers).toBeDefined();
      expect(Array.isArray(customers)).toBe(true);
    });

    it('should get customer by id', async () => {
      const customer = await api.customers.getById('fb-customer-1');
      expect(customer).toBeDefined();
    });
  });

  describe('payment', () => {
    it('should get payment methods', async () => {
      const methods = await api.payment.getMethods();
      expect(methods).toBeDefined();
      expect(Array.isArray(methods)).toBe(true);
    });
  });
});
