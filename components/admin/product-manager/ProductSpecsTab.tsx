'use client';

import { ListChecks } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import type { AdminAvailableAttribute } from '@/typescript/schemas/products/admin-product.schema';
import type { ProductFormState } from './product-manager.model';

interface ProductSpecsTabProps {
  state: ProductFormState;
  disabled: boolean;
  attributes: AdminAvailableAttribute[];
  onChange: (patch: Partial<ProductFormState>) => void;
  /** Whether the user may add/remove an attribute's values from here. */
  canManageValues: boolean;
  onManageValues: (attribute: AdminAvailableAttribute) => void;
}

export default function ProductSpecsTab({ state, disabled, attributes, onChange, canManageValues, onManageValues }: ProductSpecsTabProps) {
  const specAttributes = attributes.filter((attribute) => attribute.usage === 'SPEC');

  const toggleValue = (attribute: AdminAvailableAttribute, valueId: number, checked: boolean) => {
    const current = state.specValues[attribute.id] ?? [];
    const next = attribute.isMultiSelect
      ? checked
        ? Array.from(new Set([...current, valueId]))
        : current.filter((id) => id !== valueId)
      : checked
        ? [valueId]
        : [];

    onChange({ specValues: { ...state.specValues, [attribute.id]: next } });
  };

  if (specAttributes.length === 0) {
    return (
      <div className='rounded-2xl border border-dashed border-gray-2 py-16 text-center'>
        <p className='text-regular text-secondary-2'>
          برای دسته‌بندی‌های انتخاب‌شده ویژگی «مشخصه» تعریف نشده است. از صفحه «ویژگی‌ها» بسازید و به دسته‌بندی متصل کنید.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {specAttributes.map((attribute) => {
        const selected = state.specValues[attribute.id] ?? [];

        return (
          <div key={attribute.id} className='flex flex-col gap-3 rounded-xl border border-gray-1 p-4'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-sm font-medium text-secondary-black-3'>{attribute.title}</span>
              {attribute.isRequired && <span className='rounded-full bg-primary-4 px-2 py-0.5 text-caption text-primary-1'>اجباری</span>}
              <span className='text-caption text-secondary-3'>{attribute.isMultiSelect ? 'چند انتخابی' : 'تک انتخابی'}</span>

              {canManageValues && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='ms-auto h-8 rounded-lg text-primary-1 hover:bg-primary-4'
                  title='افزودن یا حذف مقادیر این ویژگی'
                  disabled={disabled}
                  onClick={() => onManageValues(attribute)}>
                  <ListChecks />
                  مقادیر
                </Button>
              )}
            </div>

            <div className='flex flex-wrap gap-x-6 gap-y-2'>
              {attribute.values.map((value) => {
                const checked = selected.includes(value.id);
                return (
                  <label key={value.id} className='flex cursor-pointer items-center gap-2 text-regular text-secondary-1'>
                    <Checkbox checked={checked} disabled={disabled} onCheckedChange={(next) => toggleValue(attribute, value.id, next === true)} />
                    {value.value}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
