"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getFavoritesCSR } from "@/services/favorites.service";

export interface FavoriteProduct {
  id: number;
  title: string;
  slug: string;
  barcode: string;
  brand: string;
  image: string;
  labels: string[];
  is_favorite: boolean;
  default_variant: {
    id: number;
    barcode: string;
    amount: number;
    final_amount: number;
    discount_percent: number;
    currency_symbol: string;
    attributes: string;
    is_available: boolean;
    zero_price: string;
  };
}

export interface PaginationLinks {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export function useGetFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationLinks | null>(null);

  const fetchFavorites = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await getFavoritesCSR(page);
      const body = res.data;
      setFavorites(body.data ?? []);
      setPagination({
        current_page: body.links?.current_page ?? 1,
        last_page: body.links?.last_page ?? 1,
        total: body.links?.total ?? 0,
        per_page: body.links?.per_page ?? 8,
      });
    } catch {
      toast.error("خطا در دریافت لیست علاقه‌مندی‌ها. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { favorites, loading, pagination, fetchFavorites, setFavorites };
}
