import { describe, expect, it } from 'vitest';
import { isAdminLinkActive } from '@/lib/adminNav';

describe('isAdminLinkActive', () => {
  it('matches dashboard only on exact /admin route', () => {
    expect(isAdminLinkActive('/admin', '/admin')).toBe(true);
    expect(isAdminLinkActive('/admin/orders', '/admin')).toBe(false);
  });

  it('matches admin sub-routes for non-dashboard links', () => {
    expect(isAdminLinkActive('/admin/orders', '/admin/orders')).toBe(true);
    expect(isAdminLinkActive('/admin/orders/ord-123', '/admin/orders')).toBe(true);
  });

  it('does not match unrelated admin links', () => {
    expect(isAdminLinkActive('/admin/customers', '/admin/orders')).toBe(false);
    expect(isAdminLinkActive('/admin-products', '/admin/products')).toBe(false);
  });
});
