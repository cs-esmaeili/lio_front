'use client';

import { useState } from 'react';
import { FolderTree, X } from 'lucide-react';

import CategoryPickerDialog from '@/components/admin/category-manager/CategoryPickerDialog';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import { useCategoryList } from '@/hooks/category/useCategoryList';
import { slugify } from '@/components/admin/category-manager/category-manager.model';
import { PRODUCT_SLUG_PATTERN } from '@/typescript/schemas/products/admin-product.schema';
import type { ProductFormState } from './product-manager.model';

interface ProductBasicTabProps {
  state: ProductFormState;
  disabled: boolean;
  slugTouched: boolean;
  onSlugTouched: (touched: boolean) => void;
  onChange: (patch: Partial<ProductFormState>) => void;
}

export default function ProductBasicTab({ state, disabled, slugTouched, onSlugTouched, onChange }: ProductBasicTabProps) {
  const { categories } = useCategoryList();
  const [pickerOpen, setPickerOpen] = useState(false);

  const selectedCategories = state.categoryIds
    .map((id) => categories.find((category) => category.id === id))
    .filter((category): category is NonNullable<typeof category> => category !== undefined);

  const handleNameChange = (value: string) => {
    const patch: Partial<ProductFormState> = { name: value };
    if (!slugTouched) patch.slug = slugify(value);
    onChange(patch);
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='product-name' className='text-sm text-secondary-1'>
            نام محصول
          </Label>
          <Input
            id='product-name'
            value={state.name}
            placeholder='مثلا کمل کامپکت آبی ایرانی'
            className='h-11'
            disabled={disabled}
            onChange={(event) => handleNameChange(event.target.value)}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='product-slug' className='text-sm text-secondary-1'>
            اسلاگ
          </Label>
          <Input
            id='product-slug'
            dir='ltr'
            value={state.slug}
            placeholder='kamel-compact-abi'
            className='h-11 font-medium'
            disabled={disabled}
            onChange={(event) => {
              onSlugTouched(true);
              onChange({ slug: event.target.value });
            }}
          />
          <p className='text-caption text-secondary-3'>
            {PRODUCT_SLUG_PATTERN.test(state.slug) ? 'حروف انگلیسی کوچک، عدد و «-».' : 'اسلاگ باید فقط شامل حروف انگلیسی کوچک، عدد و «-» باشد.'}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='product-description' className='text-sm text-secondary-1'>
          توضیحات
        </Label>
        <Textarea
          id='product-description'
          value={state.description}
          placeholder='توضیحات محصول...'
          className='min-h-32'
          disabled={disabled}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-sm text-secondary-1'>دسته‌بندی‌ها</Label>

        <div className='flex flex-wrap items-center gap-2'>
          {selectedCategories.length === 0 ? (
            <span className='text-regular text-secondary-3'>دسته‌بندی‌ای انتخاب نشده است.</span>
          ) : (
            selectedCategories.map((category) => (
              <span key={category.id} className='inline-flex items-center gap-1.5 rounded-full bg-primary-4 px-3 py-1 text-caption text-primary-1'>
                {category.name}
                {!disabled && (
                  <button
                    type='button'
                    aria-label={`حذف ${category.name}`}
                    onClick={() => onChange({ categoryIds: state.categoryIds.filter((id) => id !== category.id) })}>
                    <X size={13} />
                  </button>
                )}
              </span>
            ))
          )}

          {!disabled && (
            <Button type='button' variant='outline' size='sm' className='h-8 rounded-lg border-gray-2' onClick={() => setPickerOpen(true)}>
              <FolderTree />
              انتخاب دسته‌بندی
            </Button>
          )}
        </div>

        <p className='text-caption text-secondary-3'>ویژگی‌های قابل استفاده در محصول از روی دسته‌بندی‌های انتخابی تعیین می‌شوند.</p>
      </div>

      <CategoryPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title='انتخاب دسته‌بندی‌های محصول'
        multiple
        selectedIds={state.categoryIds}
        onSelect={(picked) => onChange({ categoryIds: picked.map((category) => category.id) })}
      />
    </div>
  );
}
