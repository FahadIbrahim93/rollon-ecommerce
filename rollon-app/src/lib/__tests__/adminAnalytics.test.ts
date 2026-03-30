import { describe, expect, it } from 'vitest';
import type { Order } from '@/types';
import { buildAdminAnalytics } from '@/lib/adminAnalytics';

const makeOrder = (overrides: Partial<Order> = {}): Order => ({
  id: overrides.id ?? '1',
  orderNumber: overrides.orderNumber ?? 'ORD-1',
  customerId: overrides.customerId ?? 'c-1',
  customerName: overrides.customerName ?? 'Customer One',
  total: overrides.total ?? 1000,
  status: overrides.status ?? 'pending',
  paymentStatus: overrides.paymentStatus ?? 'completed',
  paymentMethod: overrides.paymentMethod ?? 'cod',
  createdAt: overrides.createdAt ?? new Date().toISOString(),
  updatedAt: overrides.updatedAt,
  items: overrides.items ?? [
    { name: 'Grinder X', quantity: 1, price: 1000, image: '/g.png' },
  ],
  shippingAddress: overrides.shippingAddress ?? {
    name: 'Customer One',
    address: 'Road 1',
    city: 'Dhaka',
    phone: '000',
  },
});

describe('buildAdminAnalytics', () => {
  it('creates a 6-month timeline even with zero orders', () => {
    const snapshot = buildAdminAnalytics([]);
    expect(snapshot.monthlyRevenue).toHaveLength(6);
    expect(snapshot.monthlyRevenue.every((m) => m.revenue === 0 && m.orders === 0)).toBe(true);
  });

  it('aggregates monthly revenue and order count only in visible month window', () => {
    const now = new Date();
    const visibleDate = new Date(now.getFullYear(), now.getMonth(), 2).toISOString();
    const oldDate = new Date(now.getFullYear() - 1, now.getMonth(), 2).toISOString();

    const snapshot = buildAdminAnalytics([
      makeOrder({ id: 'a', createdAt: visibleDate, total: 500 }),
      makeOrder({ id: 'b', createdAt: oldDate, total: 9999 }),
    ]);

    const total = snapshot.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
    expect(total).toBe(500);
  });

  it('segments customers by accumulated spend across multiple orders', () => {
    const now = new Date().toISOString();
    const snapshot = buildAdminAnalytics([
      makeOrder({ id: 'a', customerId: 'vip', total: 21000, createdAt: now }),
      makeOrder({ id: 'b', customerId: 'loyal', total: 9000, createdAt: now }),
      makeOrder({ id: 'c', customerId: 'growing', total: 2500, createdAt: now }),
      makeOrder({ id: 'd', customerId: 'new', total: 500, createdAt: now }),
      makeOrder({ id: 'e', customerId: 'new', total: 1000, createdAt: now }),
    ]);

    const asMap = Object.fromEntries(snapshot.segmentedCustomers.map((segment) => [segment.name, segment.value]));
    expect(asMap['VIP (৳20k+)']).toBe(1);
    expect(asMap['Loyal (৳8k-20k)']).toBe(1);
    expect(asMap['Growing (৳2k-8k)']).toBe(1);
    expect(asMap['New (<৳2k)']).toBe(1);
  });

  it('builds best-seller list by units sold with max 5 items', () => {
    const now = new Date().toISOString();
    const items = ['A', 'B', 'C', 'D', 'E', 'F'].map((name, index) =>
      makeOrder({
        id: name,
        createdAt: now,
        items: [{ name, quantity: index + 1, price: 100, image: '/p.png' }],
      }),
    );

    const snapshot = buildAdminAnalytics(items);
    expect(snapshot.bestSellers).toHaveLength(5);
    expect(snapshot.bestSellers[0].name).toBe('F');
  });

  it('uses revenue as tie-breaker when units are equal', () => {
    const now = new Date().toISOString();
    const snapshot = buildAdminAnalytics([
      makeOrder({ id: 'a', createdAt: now, items: [{ name: 'High Revenue', quantity: 2, price: 500, image: '/a.png' }] }),
      makeOrder({ id: 'b', createdAt: now, items: [{ name: 'Low Revenue', quantity: 2, price: 100, image: '/b.png' }] }),
    ]);

    expect(snapshot.bestSellers[0].name).toBe('High Revenue');
  });

  it('supports custom month window length', () => {
    const snapshot = buildAdminAnalytics([], 3);
    expect(snapshot.monthlyRevenue).toHaveLength(3);
  });

  it('aggregates same product name across different orders', () => {
    const now = new Date().toISOString();
    const snapshot = buildAdminAnalytics([
      makeOrder({ id: '1', createdAt: now, items: [{ name: 'Shared', quantity: 1, price: 200, image: '/a.png' }] }),
      makeOrder({ id: '2', createdAt: now, items: [{ name: 'Shared', quantity: 3, price: 200, image: '/b.png' }] }),
    ]);

    expect(snapshot.bestSellers[0].name).toBe('Shared');
    expect(snapshot.bestSellers[0].units).toBe(4);
    expect(snapshot.bestSellers[0].revenue).toBe(800);
  });

  it('returns empty timeline when month window is zero', () => {
    const snapshot = buildAdminAnalytics([], 0);
    expect(snapshot.monthlyRevenue).toEqual([]);
  });

});
