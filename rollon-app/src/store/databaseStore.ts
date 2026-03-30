import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts, categories as initialCategories, orders as initialOrders, customers as initialCustomers } from '../data/products';
import type { Product, Category, Order, Customer, User } from '@/types';

/**
 * Converts a hex string to a Uint8Array.
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Converts a Uint8Array to a hex string.
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * PBKDF2-SHA256 password hashing via Web Crypto API.
 * Returns `salt:derivedKeyHex` where salt is a random 16-byte hex string.
 */
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return `${bytesToHex(salt)}:${bytesToHex(new Uint8Array(derivedBits))}`;
}

/**
 * Verifies a password against a stored PBKDF2 hash (salt:derivedKeyHex).
 */
async function verifyPasswordHash(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [saltHex, expectedHex] = storedHash.split(':');
  if (!saltHex || !expectedHex) return false;

  const salt = hexToBytes(saltHex);
  const encoder = new TextEncoder();
  const saltBuffer = salt.slice(0, 32); // Ensure 32 bytes
  const saltArray = new Uint8Array(saltBuffer).slice(0, 32);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltArray, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  ) as ArrayBuffer;
  const actualHex = bytesToHex(new Uint8Array(derivedBits));

  // Constant-time comparison to prevent timing attacks
  if (actualHex.length !== expectedHex.length) return false;
  let mismatch = 0;
  for (let i = 0; i < actualHex.length; i++) {
    mismatch |= actualHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return mismatch === 0;
}

// Pre-computed PBKDF2 hash for admin seed password 'admin123'.
// Generated once offline so initializeFromSeed stays synchronous.
const ADMIN_SEED_HASH =
  '00000000000000000000000000000000:510c749b88d3c1a5dc2d171b17851ef7b3ad2a526ca12fe8d4784776cf7b8ecd';

export type AuthUser = User & { passwordHash?: string };

interface DatabaseState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  users: AuthUser[];
  
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  
  addUser: (user: Omit<AuthUser, 'passwordHash'> & { password: string }) => Promise<void>;
  verifyPassword: (email: string, password: string) => Promise<AuthUser | undefined>;
  
  initializeFromSeed: () => void;
}

export const useDatabaseStore = create<DatabaseState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      orders: [],
      customers: [],
      users: [],

      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [...state.orders, order],
        }));
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
        }));
      },

      addCustomer: (customer) => {
        set((state) => ({
          customers: [...state.customers, customer],
        }));
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      addUser: async (user) => {
        const passwordHash = await hashPassword(user.password);
        const { password: _password, ...userWithoutPassword } = user;
        void _password;
        set((state) => ({
          users: [...state.users, { ...userWithoutPassword, passwordHash }],
        }));
      },

      verifyPassword: async (email, password) => {
        const users = get().users;
        for (const user of users) {
          if (user.email === email && user.passwordHash) {
            const isMatch = await verifyPasswordHash(password, user.passwordHash);
            if (isMatch) {
              const { passwordHash: _ph, ...userWithoutHash } = user;
              void _ph;
              return userWithoutHash;
            }
          }
        }
        return undefined;
      },

      initializeFromSeed: () => {
        const state = get();
        // Only initialize if no data exists and not in production
        if (state.products.length === 0 && import.meta.env.DEV) {
          set({
            products: initialProducts,
            categories: initialCategories,
            orders: initialOrders,
            customers: initialCustomers,
            users: [
              {
                id: 'admin-seed',
                name: 'System Admin',
                email: 'admin@rollon.com',
                // Pre-computed PBKDF2 hash for seed password 'admin123'
                passwordHash: ADMIN_SEED_HASH,
                role: 'admin',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
              }
            ],
          });
        }
      },
    }),
    {
      name: 'rollon-database',
      onRehydrateStorage: () => (state) => {
        if (state && import.meta.env.DEV) {
          state.initializeFromSeed();
        }
      },
    }
  )
);
