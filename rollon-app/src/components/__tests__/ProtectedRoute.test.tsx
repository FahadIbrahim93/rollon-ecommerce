import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { useAuthStore } from '@/store';

function renderWithRoutes(initialEntry: string, role?: 'admin' | 'user') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route
          path="/admin"
          element={<ProtectedRoute role={role}><div>Admin Dashboard</div></ProtectedRoute>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('redirects unauthenticated users to login', () => {
    renderWithRoutes('/admin', 'admin');
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('allows authenticated admin users', () => {
    useAuthStore.setState({
      user: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithRoutes('/admin', 'admin');
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('redirects authenticated non-admin users to home', () => {
    useAuthStore.setState({
      user: { id: '2', name: 'Customer', email: 'customer@example.com', role: 'user' },
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithRoutes('/admin', 'admin');
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
