'use client';

import { useState } from 'react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Spinner } from '@/components/shadcn/spinner';
import type { AdminAvailableAttribute } from '@/typescript/schemas/products/admin-product.schema';

interface AddVariantCombinationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The product's variant attributes and their values. */
  attributes: AdminAvailableAttribute[];
  /** Receives one value per axis when the user confirms. */
  onAdd: (values: Array<{ attributeId: number; attributeValueId: number }>) => void;
  /** Whether the attribute list is currently being refreshed. */
  refreshing: boolean;
  onRefresh: () => void;
}

/**
 * Lets the user build one specific combination by picking a value for every
 * variant axis (e.g. size: اکبر), so a combination can be added directly
 * instead of only through the axis checkboxes.
 */
export default function AddVariantCombinationModal({ open, onOpenChange, attributes, onAdd, refreshing, onRefresh }: AddVariantCombinationModalProps) {
  const [selection, setSelection] = useState<Record<number, number>>({});
  const [prevOpen, setPrevOpen] = useState(open);

  // Reset the transient selection each time the dialog opens.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setSelection({});
  }

  const selectableAttributes = attributes.filter((attribute) => attribute.values.length > 0);
  const canConfirm = selectableAttributes.length > 0 && selectableAttributes.every((attribute) => (selection[attribute.id] ?? attribute.values[0]?.id) !== undefined);

  const handleConfirm = () => {
    if (!canConfirm) return;
    const values = selectableAttributes.map((attribute) => ({
      attributeId: attribute.id,
      attributeValueId: selection[attribute.id] ?? attribute.values[0].id,
    }));
    onAdd(values);
    onOpenChange(false);
  };

  const footer = (
    <div className='flex flex-row items-center justify-between gap-3'>
      <Button type='button' variant='ghost' className='h-11 rounded-xl text-secondary-2' disabled={refreshing} onClick={onRefresh}>
        {refreshing ? <Spinner /> : null}
        به‌روزرسانی ویژگی‌ها
      </Button>
      <div className='flex flex-row items-center gap-3'>
        <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' onClick={() => onOpenChange(false)}>
          انصراف
        </Button>
        <Button type='button' className='h-11 rounded-xl px-6' disabled={!canConfirm} onClick={handleConfirm}>
          افزودن ترکیب
        </Button>
      </div>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title='افزودن ترکیب تنوع' footer={footer} size='lg'>
      {selectableAttributes.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 py-10 text-center'>
          <p className='text-regular text-secondary-2'>برای این ویژگی‌ها مقداری ثبت نشده است. ابتدا از دکمه «مقادیر» مقدار اضافه کنید.</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={onRefresh} disabled={refreshing}>
            {refreshing && <Spinner />}
            به‌روزرسانی ویژگی‌ها
          </Button>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <p className='text-caption text-secondary-3'>برای هر محور یک مقدار انتخاب کنید تا آن ترکیب ساخته شود.</p>

          {selectableAttributes.map((attribute) => (
            <div key={attribute.id} className='flex flex-col gap-2'>
              <Label className='text-sm text-secondary-1'>{attribute.title}</Label>
              <Select
                value={String(selection[attribute.id] ?? attribute.values[0].id)}
                onValueChange={(value) => setSelection((prev) => ({ ...prev, [attribute.id]: Number(value) }))}>
                <SelectTrigger className='h-11 w-full rounded-lg border-gray-2'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {attribute.values.map((value) => (
                    <SelectItem key={value.id} value={String(value.id)}>
                      {value.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </ReusableModal>
  );
}
