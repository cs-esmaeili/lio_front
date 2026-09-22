'use client';

import { useState, useEffect, useRef } from 'react';
import { searchProductsCSR } from '@/services/searchs.service';
import type { ProductSearchItem } from '@/typescript/schemas/products/product-search.schema';

// ── hook ───────────────────────────────────────────────────
export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductSearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const reqRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const id = ++reqRef.current;

    const handler = setTimeout(() => {
      setLoading(true);

      searchProductsCSR(query)
        .then((products) => {
          if (!cancelled && id === reqRef.current) {
            setResults(products);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled && id === reqRef.current) {
            setResults([]);
            setLoading(false);
          }
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    clearSearch,
  };
};
