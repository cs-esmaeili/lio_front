import { createStore } from 'zustand/vanilla';
import type { AuthUser } from '@/typescript/schemas/auth.schema';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'guest';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  /** Permissions granted to the signed-in user (`/auth/me`), e.g. `file:manage`. */
  permissions: string[];
  /** Whether the signed-in user may open the admin dashboard panel. */
  showAdminPanel: boolean;

  setLoading: () => void;
  setUser: (user: AuthUser, showAdminPanel: boolean, permissions?: string[]) => void;
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
  permissions: [],
  showAdminPanel: false,

  setLoading: () => set({ status: 'loading' }),
  setUser: (user, showAdminPanel, permissions = []) =>
    set({ status: 'authenticated', user, permissions, showAdminPanel }),
  clear: () => set({ status: 'guest', user: null, permissions: [], showAdminPanel: false }),
}));
