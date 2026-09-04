"use client";

import { useState } from "react";
import { toast } from "sonner";
import { removeFavoriteCSR } from "@/services/favorites.service";

export function useRemoveFavorite() {
  const [loading, setLoading] = useState(false);

  const removeFavorite = async (barcode: string, productId: number): Promise<boolean> => {
    setLoading(true);
    try {
      await removeFavoriteCSR(barcode, productId);
      toast.success("محصول با موفقیت از علاقه‌مندی‌ها حذف شد");
      return true;
    } catch {
      toast.error("خطا در حذف محصول از علاقه‌مندی‌ها. دوباره تلاش کنید.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { removeFavorite, loading };
}
