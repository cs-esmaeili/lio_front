'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import {
  createAttributeValueCSR,
  deleteAttributeValueCSR,
  updateAttributeValueCSR,
  type AttributeValuePayload,
} from '@/services/attribute.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminAttribute } from '@/typescript/schemas/attribute.schema';

/**
 * Owns the value mutations. Each call returns the whole updated attribute so the
 * caller can replace it without a refetch.
 */
export function useAttributeValueMutations() {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const run = useCallback(async (request: () => Promise<AdminAttribute>, fallback: string, success: string): Promise<AdminAttribute | null> => {
    setSaving(true);
    try {
      const updated = await request();
      toast.success(success);
      return updated;
    } catch (error) {
      if (isApiError(error) && error.handled) return null;
      if (isApiError(error) && error.status === 409) {
        toast.error('این مقدار قبلاً برای ویژگی ثبت شده است.');
        return null;
      }
      toast.error(getApiErrorMessage(error, fallback));
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const createValue = useCallback(
    (attributeId: number, payload: AttributeValuePayload) => run(() => createAttributeValueCSR(attributeId, payload), 'خطا در افزودن مقدار', 'مقدار افزوده شد.'),
    [run],
  );

  const updateValue = useCallback(
    (valueId: number, payload: Partial<AttributeValuePayload>) => run(() => updateAttributeValueCSR(valueId, payload), 'خطا در ذخیره مقدار', 'مقدار ذخیره شد.'),
    [run],
  );

  const deleteValue = useCallback(
    async (valueId: number): Promise<AdminAttribute | null> => {
      setDeleting(true);
      try {
        const updated = await deleteAttributeValueCSR(valueId);
        toast.success('مقدار حذف شد.');
        return updated;
      } catch (error) {
        if (isApiError(error) && error.handled) return null;
        if (isApiError(error) && error.status === 409) {
          toast.error('این مقدار در چند محصول استفاده شده است؛ ابتدا آن را از محصولات حذف کنید.');
          return null;
        }
        toast.error(getApiErrorMessage(error, 'خطا در حذف مقدار'));
        return null;
      } finally {
        setDeleting(false);
      }
    },
    [],
  );

  return { createValue, updateValue, deleteValue, saving, deleting } as const;
}
