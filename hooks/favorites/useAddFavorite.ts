"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addFavoriteCSR } from "@/services/favorites.service";

export function useAddFavorite() {
  const [loading, setLoading] = useState(false);

  const addFavorite = async (barcode: string, productId: number): Promise<boolean> => {
    setLoading(true);
    try {
      await addFavoriteCSR(barcode, productId);
      toast.success("محصول با موفقیت به علاقه‌مندی‌ها اضافه شد");
      return true;
    } catch {
      toast.error("خطا در افزودن محصول به علاقه‌مندی‌ها. دوباره تلاش کنید.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addFavorite, loading };
}
