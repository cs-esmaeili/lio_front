import { createStore } from 'zustand/vanilla';
import type { AuthUser } from '@/typescript/schemas/auth.schema';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'guest';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;

  setLoading: () => void;
  setUser: (user: AuthUser) => void;
  clear: () => void;
}

/**
 * Vanilla auth store — the single source of truth for session state.
 * `useAuth` is the only hook that reads/writes it, so auth status is resolved
 * once for the whole app (the session cookie is HttpOnly, so it can only be
 * known through `GET /auth/me`).
 */
export const authStore = createStore<AuthState>()((set) => ({
  status: 'idle',
  user: null,

  setLoading: () => set({ status: 'loading' }),
  setUser: (user) => set({ status: 'authenticated', user }),
  clear: () => set({ status: 'guest', user: null }),
}));
