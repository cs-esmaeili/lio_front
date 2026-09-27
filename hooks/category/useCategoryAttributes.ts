'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { listCategoryAttributesCSR, setCategoryAttributesCSR, type CategoryAttributePayload } from '@/services/category.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminCategoryAttribute } from '@/typescript/schemas/category.schema';

/**
 * Owns the category↔attribute assignment (`/admin/categories/{id}/attributes`).
 * Pass `categoryId: null` while no category is selected.
 */
export function useCategoryAttributes(categoryId: number | null) {
  const [attributes, setAttributes] = useState<AdminCategoryAttribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<AdminCategoryAttribute[] | null> => {
    if (categoryId === null) {
      setAttributes([]);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const list = await listCategoryAttributesCSR(categoryId);
      setAttributes(list);
      return list;
    } catch (requestError) {
      if (isApiError(requestError) && requestError.handled) {
        setError(requestError.message);
        return null;
      }
      const message = getApiErrorMessage(requestError, 'خطا در دریافت ویژگی‌های دسته‌بندی');
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId === null) return;
    let active = true;

    void (async () => {
      try {
        const list = await listCategoryAttributesCSR(categoryId);
        if (!active) return;
        setAttributes(list);
        setError(null);
      } catch (requestError) {
        if (!active) return;
        if (isApiError(requestError) && requestError.handled) {
          setError(requestError.message);
          return;
        }
        const message = getApiErrorMessage(requestError, 'خطا در دریافت ویژگی‌های دسته‌بندی');
        setError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [categoryId]);

  const save = useCallback(
    async (payload: CategoryAttributePayload[]): Promise<boolean> => {
      if (categoryId === null) return false;

      setSaving(true);
      try {
        const updated = await setCategoryAttributesCSR(categoryId, payload);
        setAttributes(updated);
        toast.success('ویژگی‌های دسته‌بندی ذخیره شد.');
        return true;
      } catch (requestError) {
        if (isApiError(requestError) && requestError.handled) return false;
        toast.error(getApiErrorMessage(requestError, 'خطا در ذخیره ویژگی‌های دسته‌بندی'));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [categoryId],
  );

  return { attributes, loading, saving, error, refetch, save } as const;
}
