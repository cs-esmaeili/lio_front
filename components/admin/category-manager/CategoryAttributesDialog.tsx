'use client';

import { useMemo, useState } from 'react';
import { CircleAlert, Layers } from 'lucide-react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Spinner } from '@/components/shadcn/spinner';
import { useAttributeList } from '@/hooks/attribute/useAttributeList';
import { useCategoryAttributes } from '@/hooks/category/useCategoryAttributes';
import type { AdminCategory } from '@/typescript/schemas/category.schema';
import { ATTRIBUTE_USAGE_LABELS } from '@/typescript/schemas/attribute.schema';

interface CategoryAttributesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: AdminCategory | null;
}

interface SelectionEntry {
  isRequired: boolean;
  isFilterable: boolean;
}

/**
 * Assigns attributes to a category. The product editor derives the available
 * spec/variant attributes from these links, so a category with no attributes
 * cannot build products with specifications or variants.
 */
export default function CategoryAttributesDialog({ open, onOpenChange, category }: CategoryAttributesDialogProps) {
  const { attributes: allAttributes, loading: loadingAll, error: allError, refetch: refetchAll } = useAttributeList({ enabled: open });
  const { attributes: assigned, loading: loadingAssigned, saving, error: assignedError, save } = useCategoryAttributes(open ? (category?.id ?? null) : null);

  const [selection, setSelection] = useState<Map<number, SelectionEntry>>(new Map());
  const [syncedKey, setSyncedKey] = useState<string | null>(null);

  const loading = loadingAll || loadingAssigned;

  // Rebuild the local selection whenever the open category's assignment changes,
  // using the render-phase "adjust state on prop change" pattern instead of an effect.
  const assignedKey = `${category?.id ?? 'none'}#${assigned
    .map((item) => `${item.attributeId}:${item.isRequired ? 1 : 0}:${item.isFilterable ? 1 : 0}`)
    .join(',')}`;
  if (!open && syncedKey !== null) {
    setSyncedKey(null);
  }
  if (open && !loadingAssigned && syncedKey !== assignedKey) {
    setSyncedKey(assignedKey);
    setSelection(new Map(assigned.map((item) => [item.attributeId, { isRequired: item.isRequired, isFilterable: item.isFilterable }])));
  }

  const toggleIncluded = (attributeId: number) => {
    setSelection((prev) => {
      const next = new Map(prev);
      if (next.has(attributeId)) next.delete(attributeId);
      else next.set(attributeId, { isRequired: false, isFilterable: false });
      return next;
    });
  };

  const updateEntry = (attributeId: number, patch: Partial<SelectionEntry>) => {
    setSelection((prev) => {
      const current = prev.get(attributeId);
      if (!current) return prev;
      const next = new Map(prev);
      next.set(attributeId, { ...current, ...patch });
      return next;
    });
  };

  const payload = useMemo(
    () =>
      allAttributes
        .map((attribute, index) => ({ attribute, index }))
        .filter(({ attribute }) => selection.has(attribute.id))
        .map(({ attribute, index }) => ({
          attributeId: attribute.id,
          isRequired: selection.get(attribute.id)?.isRequired ?? false,
          isFilterable: selection.get(attribute.id)?.isFilterable ?? false,
          sortOrder: index,
        })),
    [allAttributes, selection],
  );

  const handleSave = async () => {
    const ok = await save(payload);
    if (ok) onOpenChange(false);
  };

  const footer = (
    <div className='flex flex-row items-center justify-between gap-3'>
      <span className='text-caption text-secondary-2'>
        {payload.length.toLocaleString('fa-IR')} ویژگی انتخاب شده
      </span>
      <div className='flex flex-row items-center gap-3'>
        <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={saving} onClick={() => onOpenChange(false)}>
          انصراف
        </Button>
        <Button type='button' className='h-11 rounded-xl px-6' disabled={saving || loading} onClick={() => void handleSave()}>
          {saving && <Spinner />}
          ذخیره
        </Button>
      </div>
    </div>
  );

  const error = allError ?? assignedError;

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={category ? `ویژگی‌های «${category.name}»` : 'ویژگی‌های دسته‌بندی'} footer={footer} size='lg'>
      {error ? (
        <div className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
          <CircleAlert className='text-custom-red' size={30} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetchAll()}>
            تلاش دوباره
          </Button>
        </div>
      ) : loading && allAttributes.length === 0 ? (
        <div className='grid min-h-[30vh] place-content-center'>
          <Spinner className='size-7 text-primary-1' />
        </div>
      ) : allAttributes.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 py-12 text-center'>
          <Layers className='text-secondary-3' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>هنوز ویژگی‌ای ثبت نشده است. ابتدا از صفحه «ویژگی‌ها» یکی بسازید.</p>
        </div>
      ) : (
        <ul className='flex flex-col gap-2'>
          {allAttributes.map((attribute) => {
            const entry = selection.get(attribute.id);
            const included = entry !== undefined;
            const isVariant = attribute.usage === 'VARIANT';

            return (
              <li key={attribute.id} className={`flex flex-col gap-3 rounded-xl border px-3 py-3 ${included ? 'border-primary-3 bg-primary-4/30' : 'border-gray-1'}`}>
                <div className='flex items-center gap-3'>
                  <Checkbox checked={included} onCheckedChange={() => toggleIncluded(attribute.id)} />
                  <div className='flex min-w-0 flex-1 flex-col'>
                    <span className='truncate text-sm font-medium text-secondary-black-3'>{attribute.title}</span>
                    <span className='truncate text-caption text-secondary-3' dir='ltr'>
                      {attribute.name}
                    </span>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-caption font-medium ${isVariant ? 'bg-primary-4 text-primary-1' : 'bg-gray-1 text-secondary-1'}`}>
                    {ATTRIBUTE_USAGE_LABELS[attribute.usage]}
                  </span>
                </div>

                {included && (
                  <div className='flex flex-wrap items-center gap-5 ps-7'>
                    <label className='flex items-center gap-2 text-sm text-secondary-1'>
                      <Checkbox checked={entry.isRequired} onCheckedChange={(value) => updateEntry(attribute.id, { isRequired: value === true })} />
                      اجباری در محصول
                    </label>
                    <label className='flex items-center gap-2 text-sm text-secondary-1'>
                      <Checkbox checked={entry.isFilterable} onCheckedChange={(value) => updateEntry(attribute.id, { isFilterable: value === true })} />
                      قابل فیلتر در فروشگاه
                    </label>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </ReusableModal>
  );
}
