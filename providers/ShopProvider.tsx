'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { CategoryFilterView } from '@/typescript/schemas/products/category-filters.schema';
import type { ProductSortOption } from '@/typescript/schemas/products/product-options.schema';

interface ShopContextValue {
  liveParams: URLSearchParams;
  onUrlChange: (params: URLSearchParams) => void;
  serverFilters: CategoryFilterView[];
  sortOptions: ProductSortOption[];
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
