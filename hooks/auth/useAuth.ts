'use client';

import { useCallback } from 'react';
import { useStore } from 'zustand';
import { authStore } from '@/stores/authStore';
import { useAuthRequest } from '@/hooks/auth/useAuthRequest';

/** Shared in-flight guard so concurrent mounts only trigger one `/auth/me`. */
let refreshInFlight: Promise<void> | null = null;

/**
 * Single auth-state hook. It reads the global `authStore` and owns the two
 * side effects: resolving the session once via `GET /auth/me`, and logging out.
 * Every component shares the same state, so the session is fetched only once.
 */
export function useAuth() {
  const status = useStore(authStore, (state) => state.status);
  const user = useStore(authStore, (state) => state.user);
  const showAdminPanel = useStore(authStore, (state) => state.showAdminPanel);

  const { getMe, logout: logoutRequest } = useAuthRequest();

  const refresh = useCallback((): Promise<void> => {
    if (refreshInFlight) return refreshInFlight;

    authStore.getState().setLoading();
    refreshInFlight = getMe()
      .then((me) => {
        if (me.authenticated && me.user) authStore.getState().setUser(me.user, me.showAdminPanel);
        else authStore.getState().clear();
      })
      .catch(() => {
        authStore.getState().clear();
      })
      .finally(() => {
        refreshInFlight = null;
      });

    return refreshInFlight;
  }, [getMe]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutRequest();
    } catch {
      // The session is gone either way — clearing locally is always correct.
    }
    authStore.getState().clear();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('auth:logout'));
  }, [logoutRequest]);

  return {
    /** True once the session has been resolved (so UI can avoid a wrong flash). */
    isHydrated: status === 'authenticated' || status === 'guest',
    isLoading: status === 'idle' || status === 'loading',
    isLoggedIn: status === 'authenticated',
    user,
    showAdminPanel,
    refresh,
    logout,
  } as const;
}
