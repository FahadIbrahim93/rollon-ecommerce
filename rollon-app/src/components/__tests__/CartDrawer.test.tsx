import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartDrawer } from '../CartDrawer';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';

const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 100,
    image: '/test.jpg',
    slug: 'test-product',
    description: 'Test description',
    category: 'Test',
    categoryId: '1',
    rating: 4,
    reviewCount: 10,
    stock: 5,
    inStock: true,
};

const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CartDrawer', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
        useCartStore.getState().setCartOpen(true);
    });

    it('should render empty cart message when no items', () => {
        renderWithRouter(<CartDrawer />);
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should render cart items when items exist', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<CartDrawer />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should display correct item count in header', () => {
        useCartStore.getState().addItem(mockProduct);
        useCartStore.getState().addItem({ ...mockProduct, id: '2', price: 200 });

        renderWithRouter(<CartDrawer />);

        expect(screen.getByText('2 items')).toBeInTheDocument();
    });

    it('should display correct total price', async () => {
        useCartStore.getState().addItem(mockProduct);
        useCartStore.getState().addItem({ ...mockProduct, id: '2', price: 200 });

        renderWithRouter(<CartDrawer />);

        await waitFor(() => {
            const prices = document.querySelectorAll('.tabular-nums');
            expect(prices.length).toBeGreaterThan(0);
        });
    });

    it('should have settle manifest button', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<CartDrawer />);

        expect(screen.getByText('Settle Manifest')).toBeInTheDocument();
    });

    it('should have purge case button', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<CartDrawer />);

        expect(screen.getByText('PURGE CASE')).toBeInTheDocument();
    });

    it('should display trust badges when items exist', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<CartDrawer />);

        expect(screen.getByText('Secure Protocol')).toBeInTheDocument();
        expect(screen.getByText('Elite Dispatch')).toBeInTheDocument();
    });

    it('should link to checkout', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<CartDrawer />);

        const checkoutLink = screen.getByRole('link', { name: /settle manifest/i });
        expect(checkoutLink).toHaveAttribute('href', '/checkout');
    });

    it('should show quantity badge on item', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<CartDrawer />);

        expect(screen.getByText('x1')).toBeInTheDocument();
    });
});
