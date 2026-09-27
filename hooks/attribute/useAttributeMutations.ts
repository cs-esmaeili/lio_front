'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createAttributeCSR, deleteAttributeCSR, updateAttributeCSR, type AttributePayload } from '@/services/attribute.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminAttribute } from '@/typescript/schemas/attribute.schema';

/** Owns the create/update/delete calls for `/admin/attributes`. */
export function useAttributeMutations() {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const createAttribute = useCallback(async (payload: AttributePayload): Promise<AdminAttribute | null> => {
    setCreating(true);
    try {
      const created = await createAttributeCSR(payload);
      toast.success('ویژگی ایجاد شد.');
      return created;
    } catch (error) {
      if (isApiError(error) && error.handled) return null;
      if (isApiError(error) && error.status === 409) {
        toast.error('ویژگی‌ای با این نام فنی وجود دارد. نام دیگری انتخاب کنید.');
        return null;
      }
      toast.error(getApiErrorMessage(error, 'خطا در ایجاد ویژگی. دوباره تلاش کنید.'));
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  const updateAttribute = useCallback(async (id: number, payload: Partial<AttributePayload>): Promise<AdminAttribute | null> => {
    setUpdating(true);
    try {
      const updated = await updateAttributeCSR(id, payload);
      toast.success('ویژگی ذخیره شد.');
      return updated;
    } catch (error) {
      if (isApiError(error) && error.handled) return null;
      if (isApiError(error) && error.status === 409) {
        toast.error('ویژگی‌ای با این نام فنی وجود دارد. نام دیگری انتخاب کنید.');
        return null;
      }
      toast.error(getApiErrorMessage(error, 'خطا در ذخیره ویژگی. دوباره تلاش کنید.'));
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deleteAttribute = useCallback(async (id: number): Promise<boolean> => {
    setDeleting(true);
    try {
      await deleteAttributeCSR(id);
      toast.success('ویژگی حذف شد.');
      return true;
    } catch (error) {
      if (isApiError(error) && error.handled) return false;
      if (isApiError(error) && error.status === 409) {
        toast.error('این ویژگی در چند محصول استفاده شده است؛ ابتدا آن را از محصولات حذف کنید.');
        return false;
      }
      toast.error(getApiErrorMessage(error, 'خطا در حذف ویژگی. دوباره تلاش کنید.'));
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return { createAttribute, updateAttribute, deleteAttribute, creating, updating, deleting } as const;
}
