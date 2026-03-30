import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { Shop } from '@/pages/Shop';

const mockProducts = [
  {
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
    tags: ['ceramic'],
  },
  {
    id: 'p2',
    name: 'Titanium Trucks',
    slug: 'titanium-trucks',
    description: 'High strength',
    price: 200,
    image: '/b.jpg',
    category: 'grinders',
    categoryId: 'c1',
    rating: 4.6,
    reviewCount: 8,
    inStock: true,
    stock: 3,
    tags: ['titanium'],
  },
];

vi.mock('@/hooks/useApi', () => ({
  useProducts: () => ({ data: mockProducts, isLoading: false }),
  useCategories: () => ({ data: [{ id: 'c1', slug: 'grinders', name: 'Grinders' }] }),
}));

vi.mock('@/store/cartStore', () => ({
  useCartStore: (selector: (state: { addItem: () => void }) => unknown) => selector({ addItem: vi.fn() }),
}));

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
}

describe('Shop search params sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hydrates search input from URL query param', () => {
    render(
      <MemoryRouter initialEntries={['/shop?search=ceramic']}>
        <LocationProbe />
        <Shop />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Find your aesthetic...')).toHaveValue('ceramic');
  });

  it('writes search query back into URL when user types', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/shop']}>
        <LocationProbe />
        <Shop />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Find your aesthetic...');
    await user.type(input, 'alpha');

    expect(screen.getByTestId('location')).toHaveTextContent('/shop?search=alpha');
  });
});
