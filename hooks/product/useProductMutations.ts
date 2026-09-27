'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createProductCSR, deleteProductCSR, updateProductCSR } from '@/services/product.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminProduct, SaveProductPayload } from '@/typescript/schemas/products/admin-product.schema';

/** Owns the create/update/delete calls for `/admin/products`. */
export function useProductMutations() {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const createProduct = useCallback(async (payload: SaveProductPayload): Promise<AdminProduct | null> => {
    setSaving(true);
    try {
      return await createProductCSR(payload);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;
      if (isApiError(error) && error.status === 409) {
        toast.error('اسلاگ یا SKU وارد‌شده تکراری است. مقدار دیگری انتخاب کنید.');
        return null;
      }
      if (isApiError(error) && error.status === 400) {
        toast.error(getApiErrorMessage(error, 'اطلاعات محصول نامعتبر است.'));
        return null;
      }
      toast.error(getApiErrorMessage(error, 'خطا در ذخیره محصول. دوباره تلاش کنید.'));
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: number, payload: SaveProductPayload): Promise<AdminProduct | null> => {
    setSaving(true);
    try {
      return await updateProductCSR(id, payload);
    } catch (error) {
      if (isApiError(error) && error.handled) return null;
      if (isApiError(error) && error.status === 409) {
        toast.error('اسلاگ یا SKU وارد‌شده تکراری است. مقدار دیگری انتخاب کنید.');
        return null;
      }
      if (isApiError(error) && error.status === 400) {
        toast.error(getApiErrorMessage(error, 'اطلاعات محصول نامعتبر است.'));
        return null;
      }
      toast.error(getApiErrorMessage(error, 'خطا در ذخیره محصول. دوباره تلاش کنید.'));
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    setDeleting(true);
    try {
      await deleteProductCSR(id);
      toast.success('محصول حذف شد.');
      return true;
    } catch (error) {
      if (isApiError(error) && error.handled) return false;
      toast.error(getApiErrorMessage(error, 'خطا در حذف محصول. دوباره تلاش کنید.'));
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return { createProduct, updateProduct, deleteProduct, saving, deleting } as const;
}
