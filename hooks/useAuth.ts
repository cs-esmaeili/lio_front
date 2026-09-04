"use client";

import { useEffect, useState } from "react";

/**
 * Check whether user is authenticated by looking for auth_token cookie.
 * Reads synchronously — safe to call in render or event handlers.
 */
export function getAuthToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function logout() {
  if (typeof document === "undefined") return;
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.dispatchEvent(new CustomEvent("auth:logout"));
}

export function useAuth() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isLoggedIn = !!getAuthToken();
  return { isHydrated, isLoggedIn, token: getAuthToken(), logout };
}
