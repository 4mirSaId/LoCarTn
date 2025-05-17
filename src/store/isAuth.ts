// src/store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserRole = 'ADMIN' | 'AGENCY' | 'CLIENT';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Add agency-specific fields if needed
  agencyId?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);