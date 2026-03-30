import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../Login';

vi.mock('@/store', () => ({
  useAuthStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector({
        login: vi.fn().mockResolvedValue(true),
        isAuthenticated: false,
      });
    }
    return {
      login: vi.fn().mockResolvedValue(true),
      isAuthenticated: false,
    };
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: null }),
  };
});

describe('Login', () => {
  const renderLogin = () => {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders login form heading', () => {
      renderLogin();
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });

    it('renders email input field', () => {
      renderLogin();
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });

    it('renders password input field', () => {
      renderLogin();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('renders sign in button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders forgot password link', () => {
      renderLogin();
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    it('renders sign up link', () => {
      renderLogin();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('shows error for invalid email', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      await user.type(emailInput, 'invalid-email');
      await user.tab();
      
      const passwordInput = screen.getByPlaceholderText('••••••••');
      await user.type(passwordInput, 'password123');
      await user.tab();
      
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it('shows error for short password', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      await user.type(emailInput, 'test@example.com');
      await user.tab();
      
      const passwordInput = screen.getByPlaceholderText('••••••••');
      await user.type(passwordInput, 'short');
      await user.tab();
      
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('shows error for empty email', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      await user.click(emailInput);
      await user.tab();
      
      const passwordInput = screen.getByPlaceholderText('••••••••');
      await user.type(passwordInput, 'password123');
      await user.tab();
      
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it('shows error for empty password', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      await user.type(emailInput, 'test@example.com');
      await user.tab();
      
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('password visibility', () => {
    it('toggles password visibility', async () => {
      const user = userEvent.setup();
      renderLogin();

      const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');

      const toggleButton = screen.getByRole('button', { name: /show password/i });
      await user.click(toggleButton);

      expect(passwordInput.type).toBe('text');
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
    });
  });

  describe('social login buttons', () => {
    it('renders Google login button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    });

    it('renders Facebook login button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /facebook/i })).toBeInTheDocument();
    });
  });
});
