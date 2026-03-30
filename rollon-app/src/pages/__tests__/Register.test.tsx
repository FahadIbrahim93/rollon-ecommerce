import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Register } from '../Register';

vi.mock('@/store', () => ({
  useAuthStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector({
        register: vi.fn().mockResolvedValue(true),
        isAuthenticated: false,
      });
    }
    return {
      register: vi.fn().mockResolvedValue(true),
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
  };
});

describe('Register', () => {
  const renderRegister = () => {
    return render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders register form heading', () => {
      renderRegister();
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('renders name input field', () => {
      renderRegister();
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    });

    it('renders email input field', () => {
      renderRegister();
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });

    it('renders password input field', () => {
      renderRegister();
      const passwords = screen.getAllByPlaceholderText('••••••••');
      expect(passwords[0]).toBeInTheDocument();
    });

    it('renders confirm password input field', () => {
      renderRegister();
      const passwords = screen.getAllByPlaceholderText('••••••••');
      expect(passwords[1]).toBeInTheDocument();
    });

    it('renders create account button', () => {
      renderRegister();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('renders sign in link', () => {
      renderRegister();
      expect(screen.getByText('Sign in')).toBeInTheDocument();
    });

    it('renders terms and privacy links', () => {
      renderRegister();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('shows error for short name', async () => {
      const user = userEvent.setup();
      renderRegister();

      const nameInput = screen.getByPlaceholderText('John Doe');
      await user.type(nameInput, 'a');
      await user.tab();
      
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('shows error for invalid email', async () => {
      const user = userEvent.setup();
      renderRegister();

      const nameInput = screen.getByPlaceholderText('John Doe');
      await user.type(nameInput, 'John Doe');
      await user.tab();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      await user.type(emailInput, 'invalid-email');
      await user.tab();
      
      const passwords = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwords[0], 'password123');
      await user.type(passwords[1], 'password123');
      await user.tab();
      
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it('shows error for short password', async () => {
      const user = userEvent.setup();
      renderRegister();

      const nameInput = screen.getByPlaceholderText('John Doe');
      await user.type(nameInput, 'John Doe');
      await user.tab();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      await user.type(emailInput, 'test@example.com');
      await user.tab();
      
      const passwords = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwords[0], 'short');
      await user.type(passwords[1], 'short');
      await user.tab();
      
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('shows error for password mismatch', async () => {
      const user = userEvent.setup();
      renderRegister();

      const nameInput = screen.getByPlaceholderText('John Doe');
      await user.type(nameInput, 'John Doe');
      await user.tab();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      await user.type(emailInput, 'test@example.com');
      await user.tab();
      
      const passwords = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwords[0], 'password123');
      await user.tab();
      await user.type(passwords[1], 'password456');
      await user.tab();
      
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
      });
    });

    it('shows error for empty name', async () => {
      const user = userEvent.setup();
      renderRegister();

      const nameInput = screen.getByPlaceholderText('John Doe');
      await user.click(nameInput);
      await user.tab();

      const emailInput = screen.getByPlaceholderText('you@example.com');
      await user.type(emailInput, 'test@example.com');
      await user.tab();
      
      const passwords = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwords[0], 'password123');
      await user.type(passwords[1], 'password123');
      await user.tab();
      
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('password visibility', () => {
    it('toggles password visibility', async () => {
      const user = userEvent.setup();
      renderRegister();

      const passwords = screen.getAllByPlaceholderText('••••••••') as HTMLInputElement[];
      expect(passwords[0].type).toBe('password');
      expect(passwords[1].type).toBe('password');

      const toggleButton = screen.getByRole('button', { name: /show password/i });
      await user.click(toggleButton);

      expect(passwords[0].type).toBe('text');
      expect(passwords[1].type).toBe('text');
    });
  });

  describe('social register buttons', () => {
    it('renders Google register button', () => {
      renderRegister();
      expect(screen.getAllByRole('button', { name: /google/i })[0]).toBeInTheDocument();
    });

    it('renders Facebook register button', () => {
      renderRegister();
      expect(screen.getAllByRole('button', { name: /facebook/i })[0]).toBeInTheDocument();
    });
  });
});
