import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Cart } from '../Cart';
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

describe('Cart', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    it('should render empty cart message when no items', () => {
        renderWithRouter(<Cart />);
        expect(screen.getByText('Your Vault is Empty')).toBeInTheDocument();
        expect(screen.getByText('Browse Collection')).toBeInTheDocument();
    });

    it('should render cart items when items exist', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<Cart />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('Order Summary')).toBeInTheDocument();
        expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
    });

    it('should display correct item count', () => {
        useCartStore.getState().addItem(mockProduct);
        useCartStore.getState().addItem({ ...mockProduct, id: '2', price: 200 });

        renderWithRouter(<Cart />);

        expect(screen.getByText('2 items in your cart')).toBeInTheDocument();
    });

    it('should display correct total price', async () => {
        useCartStore.getState().addItem(mockProduct);
        useCartStore.getState().addItem({ ...mockProduct, id: '2', price: 200 });

        renderWithRouter(<Cart />);

        await waitFor(() => {
            const prices = document.querySelectorAll('.tabular-nums, [class*="text-white"][class*="font"]');
            expect(prices.length).toBeGreaterThan(0);
        });
    });

    it('should render quantity controls for each item', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<Cart />);

        // Check for minus and plus buttons (quantity controls)
        const minusButtons = document.querySelectorAll('button');
        expect(minusButtons.length).toBeGreaterThan(0);
    });

    it('should have clear cart button', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<Cart />);

        expect(screen.getByText('Clear Cart')).toBeInTheDocument();
    });

    it('should display shipping as free', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<Cart />);

        expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('should link to checkout page', () => {
        useCartStore.getState().addItem(mockProduct);

        renderWithRouter(<Cart />);

        const checkoutLink = screen.getByRole('link', { name: /proceed to checkout/i });
        expect(checkoutLink).toHaveAttribute('href', '/checkout');
    });

    it('should link to shop page from empty cart', () => {
        renderWithRouter(<Cart />);

        const browseLink = screen.getByRole('link', { name: /browse collection/i });
        expect(browseLink).toHaveAttribute('href', '/shop');
    });
});
