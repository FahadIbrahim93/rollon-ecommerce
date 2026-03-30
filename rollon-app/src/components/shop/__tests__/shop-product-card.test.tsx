import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ShopProductCard } from '@/components/shop/shop-product-card';

const product = {
  id: 'p1',
  name: 'Ceramic V2',
  slug: 'ceramic-v2',
  description: 'Premium accessory',
  price: 100,
  image: '/a.jpg',
  category: 'grinders',
  categoryId: 'c1',
  rating: 4.8,
  reviewCount: 10,
  inStock: true,
  stock: 5,
};

describe('ShopProductCard', () => {
  it('does not render nested anchors', () => {
    const { container } = render(
      <MemoryRouter>
        <ShopProductCard product={product} index={0} onAddToCart={vi.fn()} />
      </MemoryRouter>
    );

    expect(container.querySelectorAll('a a').length).toBe(0);
  });
});
