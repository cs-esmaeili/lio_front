'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import {
  createAttributeCSR,
  createAttributeValueCSR,
  deleteAttributeValueCSR,
  updateAttributeCSR,
  updateAttributeValueCSR,
  type AttributePayload,
} from '@/services/attribute.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';
import type { AdminAttribute, AdminAttributeValue } from '@/typescript/schemas/attribute.schema';

/** One editable value row in the attribute editor (`id === null` means "new"). */
export interface AttributeValueDraft {
  id: number | null;
  value: string;
}

interface SaveAttributeInput {
  mode: 'create' | 'edit';
  /** Required in edit mode. */
  id?: number;
  payload: AttributePayload;
  values: AttributeValueDraft[];
  /** Values as they were when the editor opened, used to diff in edit mode. */
  originalValues: AdminAttributeValue[];
}

/**
 * Saves an attribute together with its values.
 *
 * There is no single "attribute + values" endpoint, so in edit mode the values
 * are diffed and applied through the value endpoints (create / update / delete).
 */
export function useSaveAttribute() {
  const [saving, setSaving] = useState(false);

  const saveAttribute = useCallback(async (input: SaveAttributeInput): Promise<AdminAttribute | null> => {
    setSaving(true);

    try {
      if (input.mode === 'create') {
        let attribute = await createAttributeCSR(input.payload);
        for (const value of input.values) {
          attribute = await createAttributeValueCSR(attribute.id, { value: value.value });
        }
        toast.success('ویژگی ایجاد شد.');
        return attribute;
      }

      if (input.id === undefined) return null;

      let attribute = await updateAttributeCSR(input.id, input.payload);
      const originalById = new Map(input.originalValues.map((value) => [value.id, value]));
      const keptIds = new Set(input.values.filter((value) => value.id !== null).map((value) => value.id as number));

      for (const value of input.values) {
        if (value.id === null) {
          attribute = await createAttributeValueCSR(input.id, { value: value.value });
        } else if (originalById.get(value.id)?.value !== value.value) {
          attribute = await updateAttributeValueCSR(value.id, { value: value.value });
        }
      }

      for (const original of input.originalValues) {
        if (!keptIds.has(original.id)) {
          attribute = await deleteAttributeValueCSR(original.id);
        }
      }

      toast.success('ویژگی ذخیره شد.');
      return attribute;
    } catch (error) {
      if (isApiError(error) && error.handled) return null;
      if (isApiError(error) && error.status === 409) {
        toast.error('نام ویژگی یا مقدار تکراری است، یا مقدار در محصولی استفاده شده و حذف نمی‌شود.');
        return null;
      }
      toast.error(getApiErrorMessage(error, 'خطا در ذخیره ویژگی. دوباره تلاش کنید.'));
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  return { saveAttribute, saving } as const;
}
