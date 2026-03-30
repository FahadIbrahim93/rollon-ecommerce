import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Checkout } from '../Checkout';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useCreateOrder } from '@/hooks/useApi';

// Mock dependencies
vi.mock('@/store/cartStore', () => ({
  useCartStore: vi.fn(),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/hooks/useApi', () => ({
  useCreateOrder: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockMutateAsync = vi.fn();

const renderCheckout = () => {
  return render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  );
};

describe('Checkout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks
    (useAuthStore as any).mockImplementation((selector: any) => selector({ user: { id: 'u1', name: 'Test User' } }));
    (useCreateOrder as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it('renders empty cart message when no items', () => {
    (useCartStore as any).mockImplementation((selector: any) => selector({
      items: [],
      totalPrice: 0,
      clearCart: vi.fn(),
    }));

    renderCheckout();
    expect(screen.getByText('Your Vault is Empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore collection/i })).toBeInTheDocument();
  });

  it('renders step 1 form when cart has items', () => {
    (useCartStore as any).mockImplementation((selector: any) => selector({
      items: [{ productId: 'p1', name: 'Item 1', quantity: 1, price: 100, image: '/img.png' }],
      totalPrice: 100,
      clearCart: vi.fn(),
    }));

    renderCheckout();
    expect(screen.getByText('Shipping Architecture')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it('validates step 1 form and proceeds to step 2', async () => {
    const user = userEvent.setup();
    (useCartStore as any).mockImplementation((selector: any) => selector({
      items: [{ productId: 'p1', name: 'Item 1', quantity: 1, price: 100, image: '/img.png' }],
      totalPrice: 100,
      clearCart: vi.fn(),
    }));

    renderCheckout();
    
    // Fill out the form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/secure email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '01711000000');
    await user.type(screen.getByLabelText(/precise address/i), '123 Test St');
    await user.type(screen.getByLabelText(/city hub/i), 'Dhaka');
    await user.type(screen.getByLabelText(/postal code/i), '1212');

    // Click Next Phase
    await user.click(screen.getByRole('button', { name: /next phase/i }));

    // Should render Payment Protocol screen
    await waitFor(() => {
      expect(screen.getByText('Payment Protocol')).toBeInTheDocument();
    });
  });

  it('validates step 2 and proceeds to step 3', async () => {
    const user = userEvent.setup();
    (useCartStore as any).mockImplementation((selector: any) => selector({
      items: [{ productId: 'p1', name: 'Item 1', quantity: 1, price: 100, image: '/img.png' }],
      totalPrice: 100,
      clearCart: vi.fn(),
    }));

    renderCheckout();
    
    // Step 1
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/secure email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '01711000000');
    await user.type(screen.getByLabelText(/precise address/i), '123 St');
    await user.type(screen.getByLabelText(/city hub/i), 'Dhaka');
    await user.type(screen.getByLabelText(/postal code/i), '1212');
    await user.click(screen.getByRole('button', { name: /next phase/i }));

    // Step 2
    await waitFor(() => expect(screen.getByText('Payment Protocol')).toBeInTheDocument());
    
    // Select bKash
    await user.click(screen.getByText(/bKash Merchant/i));
    await user.click(screen.getByRole('button', { name: /next phase/i }));

    // Step 3
    await waitFor(() => {
      expect(screen.getByText('Final Verification')).toBeInTheDocument();
    });
  });

    it.skip('submits the order successfully', async () => {
    const user = userEvent.setup();
    const mockClearCart = vi.fn();
    (useCartStore as any).mockImplementation((selector: any) => selector({
      items: [{ productId: 'p1', name: 'Item 1', quantity: 1, price: 100, image: '/img.png' }],
      totalPrice: 100,
      clearCart: mockClearCart,
    }));
    mockMutateAsync.mockResolvedValueOnce({ id: 'order-123' });

    renderCheckout();
    
    // Quickly fill step 1
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/secure email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/phone number/i), '12345678901');
    await user.type(screen.getByLabelText(/precise address/i), 'Addy');
    await user.type(screen.getByLabelText(/city hub/i), 'Dhaka');
    await user.type(screen.getByLabelText(/postal code/i), '1234');
    await user.click(screen.getByRole('button', { name: /next phase/i }));

    // Step 2
    await waitFor(() => expect(screen.getByText('Payment Protocol')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /next phase/i }));

    // Step 3
    await waitFor(() => expect(screen.getByText('Final Verification')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /authorize transaction/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(mockClearCart).toHaveBeenCalled();
      expect(screen.getByText('Order Confirmed')).toBeInTheDocument();
    });
  });
});
