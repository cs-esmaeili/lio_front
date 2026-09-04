'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface SortOption {
  id: number;
  key: string;
  title: string;
}

interface ShopContextValue {
  liveParams: URLSearchParams;
  onUrlChange: (params: URLSearchParams) => void;
  serverFilters: any; // normalized Filter[] from convertFilters
  sortOptions: SortOption[];
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: ShopContextValue;
}) {
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShopContext() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShopContext must be used inside <ShopProvider>');
  return ctx;
}
