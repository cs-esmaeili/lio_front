'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import type { SelectedFile } from '@/components/admin/file-manager/file-manager.model';
import ImagePickerField from '@/components/admin/sections/ImagePickerField';
import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Spinner } from '@/components/shadcn/spinner';
import { useCreateCategory } from '@/hooks/category/useCreateCategory';
import { useUpdateCategory } from '@/hooks/category/useUpdateCategory';
import { CATEGORY_SLUG_PATTERN, type AdminCategory } from '@/typescript/schemas/category.schema';
import CategoryPickerField from './CategoryPickerField';
import { getDescendantIds, slugify } from './category-manager.model';

interface CategoryEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  /** Flat category list, used by the parent picker. */
  categories: AdminCategory[];
  /** Existing category when editing; `null` when creating. */
  initial: AdminCategory | null;
  /** Pre-selected parent when creating a subcategory. */
  defaultParentId?: number | null;
  onSaved: (category: AdminCategory) => void;
}

export default function CategoryEditorModal({
  open,
  onOpenChange,
  mode,
  categories,
  initial,
  defaultParentId,
  onSaved,
}: CategoryEditorModalProps) {
  const { createCategory, loading: creating } = useCreateCategory();
  const { updateCategory, loading: updating } = useUpdateCategory();

  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  // Existing categories keep their slug unless the user edits it explicitly.
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [parentId, setParentId] = useState<number | null>(initial?.parentId ?? defaultParentId ?? null);
  const [image, setImage] = useState<SelectedFile | null>(
    initial?.imageUrl
      ? { id: initial.imageId ?? undefined, name: initial.name, path: '', url: initial.imageUrl }
      : null,
  );
  const [error, setError] = useState<string | null>(null);

  const loading = mode === 'create' ? creating : updating;
  const parent = parentId !== null ? (categories.find((category) => category.id === parentId) ?? null) : null;
  // A category can never be moved under itself or one of its descendants.
  const disabledParentIds = initial ? [initial.id, ...getDescendantIds(categories, initial.id)] : [];

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
    if (error) setError(null);
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugTouched(true);
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) {
      setError('نام دسته‌بندی را وارد کنید.');
      return;
    }
    if (!trimmedSlug) {
      setError('اسلاگ دسته‌بندی را وارد کنید.');
      return;
    }
    if (!CATEGORY_SLUG_PATTERN.test(trimmedSlug)) {
      setError('اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و «-» باشد.');
      return;
    }

    const payload = {
      name: trimmedName,
      slug: trimmedSlug,
      parentId,
      imageId: image?.id ?? null,
    };

    const saved =
      mode === 'create' ? await createCategory(payload) : initial ? await updateCategory(initial.id, payload) : null;

    if (!saved) return;

    toast.success(mode === 'create' ? 'دسته‌بندی ایجاد شد.' : 'دسته‌بندی ذخیره شد.');
    onSaved(saved);
    onOpenChange(false);
  };

  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button
        type='button'
        variant='outline'
        className='h-11 rounded-xl border-gray-2'
        disabled={loading}
        onClick={() => onOpenChange(false)}>
        انصراف
      </Button>

      <Button type='button' className='h-11 rounded-xl px-6' disabled={loading} onClick={() => void handleSubmit()}>
        {loading && <Spinner />}
        {mode === 'create' ? 'ایجاد دسته‌بندی' : 'ذخیره تغییرات'}
      </Button>
    </div>
  );

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === 'create' ? 'دسته‌بندی جدید' : `ویرایش «${initial?.name ?? ''}»`}
      footer={footer}
      size='lg'>
      <div className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {/* Name */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='category-name' className='text-sm text-secondary-1'>
              نام
            </Label>
            <Input
              id='category-name'
              value={name}
              placeholder='مثلا پوشاک'
              className='h-11'
              onChange={(event) => handleNameChange(event.target.value)}
            />
          </div>

          {/* Slug */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='category-slug' className='text-sm text-secondary-1'>
              اسلاگ
            </Label>
            <Input
              id='category-slug'
              dir='ltr'
              value={slug}
              placeholder='clothing'
              className='h-11 font-medium'
              onChange={(event) => handleSlugChange(event.target.value)}
            />
            <p className='text-caption text-secondary-3'>حروف انگلیسی کوچک، عدد و «-».</p>
          </div>
        </div>

        {/* Parent */}
        <CategoryPickerField
          label='دسته‌بندی والد'
          value={parent}
          onChange={(category) => setParentId(category?.id ?? null)}
          categories={categories}
          disabledIds={disabledParentIds}
          allowRootOption
          pickerTitle='انتخاب دسته‌بندی والد'
        />

        {/* Image */}
        <ImagePickerField label='تصویر دسته‌بندی' value={image} onChange={setImage} disabled={loading} />

        {error && <p className='text-sm text-custom-red'>{error}</p>}
      </div>
    </ReusableModal>
  );
}
