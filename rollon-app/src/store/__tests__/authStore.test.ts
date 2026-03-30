import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';

type MockLoginPayload = {
  user: { id: string; name: string; email: string; role: 'admin' | 'user' };
  token: string;
};

const createFetchResponse = (ok: boolean, payload: unknown = {}) => ({
  ok,
  json: async () => payload,
}) as Response;

describe('authStore', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.getState().logout();
  });

  describe('initial state', () => {
    it('should have null user initially', () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it('should not be authenticated initially', () => {
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it('should not be loading initially', () => {
      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('should login with valid admin credentials from API', async () => {
      const payload: MockLoginPayload = {
        user: { id: '1', name: 'Admin User', email: 'admin@rollon.com', role: 'admin' },
        token: 'token-admin',
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(createFetchResponse(true, payload));

      const { login } = useAuthStore.getState();
      const result = await login('admin@rollon.com', 'admin123');

      expect(result).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.role).toBe('admin');
    });

    it('should login with valid user credentials from API', async () => {
      const payload: MockLoginPayload = {
        user: { id: '2', name: 'Test Customer', email: 'customer@example.com', role: 'user' },
        token: 'token-user',
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(createFetchResponse(true, payload));

      const { login } = useAuthStore.getState();
      const result = await login('customer@example.com', 'password123');

      expect(result).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.role).toBe('user');
    });

    it('should fail login with invalid credentials', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network failure'));

      const { login } = useAuthStore.getState();
      const result = await login('invalid@example.com', 'wrongpassword');

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const payload: MockLoginPayload = {
        user: { id: '3', name: 'New User', email: 'new@example.com', role: 'user' },
        token: 'token-register',
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(createFetchResponse(true, payload));

      const { register } = useAuthStore.getState();
      const result = await register('New User', 'new@example.com', 'password123');

      expect(result).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.name).toBe('New User');
      expect(useAuthStore.getState().user?.role).toBe('user');
    });

    it('should register locally when API fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network failure'));

      const { register } = useAuthStore.getState();
      const result = await register('New Local User', 'local@example.com', 'password123');

      expect(result).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.name).toBe('New Local User');
      expect(useAuthStore.getState().user?.email).toBe('local@example.com');
    });

    it('should fail registration locally if email already exists', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network failure'));
      const { register, logout } = useAuthStore.getState();
      await register('First User', 'duplicate@example.com', 'password123');
      logout();
      const result = await register('Second User', 'duplicate@example.com', 'password123');
      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout and clear user data', async () => {
      const payload: MockLoginPayload = {
        user: { id: '1', name: 'Admin User', email: 'admin@rollon.com', role: 'admin' },
        token: 'token-admin',
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(createFetchResponse(true, payload));

      const { login, logout } = useAuthStore.getState();

      await login('admin@rollon.com', 'admin123');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      logout();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const payload: MockLoginPayload = {
        user: { id: '1', name: 'Admin User', email: 'admin@rollon.com', role: 'admin' },
        token: 'token-admin',
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(createFetchResponse(true, payload));

      const { login, updateProfile } = useAuthStore.getState();

      await login('admin@rollon.com', 'admin123');
      updateProfile({ name: 'Updated Name' });

      expect(useAuthStore.getState().user?.name).toBe('Updated Name');
    });

    it('should not update when user is null', () => {
      const { updateProfile } = useAuthStore.getState();

      updateProfile({ name: 'Updated Name' });

      expect(useAuthStore.getState().user).toBeNull();
    });
  });
});
