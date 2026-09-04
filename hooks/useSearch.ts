'use client';

import { useState, useEffect, useRef } from 'react';
import { searchCSR } from '@/services/searchs.service';

// ── API response types ────────────────────────────────────
export type SearchProduct = {
  barcode: string;
  image: string;
  title: string;
  slug: string;
};
export type SearchBrand = {
  image: string;
  title: string;
  slug: string;
};

// TODO: define when API returns data for these
// type SearchCategory = { ... };
// type SearchBrand = { ... };
// type SearchBlog = { ... };

export type SearchResponse = {
  status: number;
  products: SearchProduct[];
  categories: SearchBrand[]; // TODO: type when API returns data
  brands: SearchBrand[]; // TODO: type when API returns data
  blogs: SearchProduct[]; // TODO: type when API returns data
};

// ── normalized display type ───────────────────────────────
export type SearchType = 'global' | 'article';

export type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  slug?: string;
  type: 'product' | 'category' | 'brand' | 'blog';
};

// ── response transformer ──────────────────────────────────
function mapResponseToItems(response: SearchResponse, type: SearchType): SearchItem[] {
  const items: SearchItem[] = [];

  // Products
  for (const p of response.products) {
    items.push({
      id: p.barcode,
      title: p.title,
      subtitle: 'محصول',
      image: p.image,
      slug: p.slug,
      type: 'product',
    });
  }

  // TODO: map response.categories when API returns data
  for (const c of response.categories) {
    items.push({
      id: c.slug,
      title: c.title,
      subtitle: "دسته‌بندی",
      image: c.image,
      slug: c.slug,
      type: "category",
    });
  }

  // [HIDDEN] brands temporarily disabled in search
  // TODO: map response.brands when API returns data
  // for (const b of response.brands) {
  //   items.push({
  //     id: b.slug,
  //     title: b.title,
  //     subtitle: "برند",
  //     image: b.image,
  //     slug: b.slug,
  //     type: "brand",
  //   });
  // }

  // TODO: map response.blogs when API returns data (used for type="article")
  for (const b of response.blogs) {
    items.push({
      id: b.slug,
      title: b.title,
      subtitle: 'مقاله',
      image: b.image,
      slug: b.slug,
      type: 'blog',
    });
  }

  // client-side filter by type
  if (type === 'article') {
    return items.filter((item) => item.type === 'blog');
  }

  return items;
}

// ── hook ───────────────────────────────────────────────────
export const useSearch = (type: SearchType) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
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

      searchCSR(query.trim())
        .then((response) => {
          if (!cancelled && id === reqRef.current) {
            const data: SearchResponse = response.data;
            setResults(mapResponseToItems(data, type));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type]);

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
