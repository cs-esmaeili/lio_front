'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import CategoryPickerField from '@/components/admin/category-manager/CategoryPickerField';
import type { SelectedFile } from '@/components/admin/file-manager/file-manager.model';
import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Spinner } from '@/components/shadcn/spinner';
import { Textarea } from '@/components/shadcn/textarea';
import { useCategoryList } from '@/hooks/category/useCategoryList';
import { useCreateFooterItem } from '@/hooks/page-sections/useCreateFooterItem';
import { useUpdateFooterItem } from '@/hooks/page-sections/useUpdateFooterItem';
import { resolveFileUrl } from '@/utils/fileUrl';
import ImagePickerField from '../ImagePickerField';
import type { FooterEditorInit, FooterItemType } from '@/typescript/schemas/page-section.schema';

interface FooterItemFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: number;
  mode: 'create' | 'edit';
  initial: FooterEditorInit | null;
  /** Type preselected when creating a new item. */
  defaultType: FooterItemType;
  onSaved: () => void;
}

export default function FooterItemFormModal({ open, onOpenChange, sectionId, mode, initial, defaultType, onSaved }: FooterItemFormModalProps) {
  const { createFooterItem, loading: creating } = useCreateFooterItem();
  const { updateFooterItem, loading: updating } = useUpdateFooterItem();
  const submitting = creating || updating;

  const { categories } = useCategoryList();

  const [type, setType] = useState<FooterItemType>(initial?.type ?? defaultType);
  const [label, setLabel] = useState(initial?.type === 'LINK' ? initial.label : '');
  const [url, setUrl] = useState(initial?.type === 'LINK' ? (initial.url ?? '') : '');
  const [description, setDescription] = useState(initial?.type === 'LINK' ? (initial.description ?? '') : '');
  const [file, setFile] = useState<SelectedFile | null>(() =>
    initial?.type === 'LINK' && initial.fileId !== null
      ? { id: initial.fileId, name: 'تصویر', path: '', url: resolveFileUrl(initial.fileUrl) ?? '', mimeType: 'image/*' }
      : null,
  );
  const [categoryId, setCategoryId] = useState<number | null>(initial?.categoryId ?? null);
  const [error, setError] = useState<string | null>(null);

  const selectedCategory = categoryId !== null ? (categories.find((category) => category.id === categoryId) ?? null) : null;

  // --------------------------------------------------------

  const handleTypeChange = (value: FooterItemType) => {
    setType(value);
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (type === 'LINK') {
      if (!label.trim() || !url.trim()) {
        setError('برای آیتم لینک، عنوان و آدرس الزامی است.');
        return;
      }
    } else if (categoryId === null) {
      setError('برای آیتم دسته‌بندی، انتخاب دسته‌بندی الزامی است.');
      return;
    }

    const payload =
      type === 'LINK'
        ? { type, label: label.trim(), url: url.trim(), description: description.trim() || null, fileId: file?.id ?? null, categoryId: null }
        : { type, label: null, url: null, description: null, fileId: null, categoryId };

    const saved =
      mode === 'edit' && initial
        ? await updateFooterItem(sectionId, { id: initial.id, ...payload })
        : await createFooterItem(sectionId, payload);
    if (!saved) return;

    toast.success(mode === 'edit' ? 'آیتم فوتر ذخیره شد.' : 'آیتم فوتر ایجاد شد.');
    onSaved();
    onOpenChange(false);
  };

  // --------------------------------------------------------

  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={submitting} onClick={() => onOpenChange(false)}>
        انصراف
      </Button>

      <Button type='button' className='h-11 rounded-xl px-6' disabled={submitting} onClick={() => void handleSubmit()}>
        {submitting && <Spinner />}
        {mode === 'edit' ? 'ذخیره تغییرات' : 'افزودن آیتم'}
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={mode === 'edit' ? 'ویرایش آیتم فوتر' : 'افزودن آیتم فوتر'} footer={footer} size='md'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <Label className='text-sm text-secondary-1'>نوع آیتم</Label>
          <Select value={type} onValueChange={(value) => handleTypeChange(value as FooterItemType)} disabled={mode === 'edit'}>
            <SelectTrigger className='!h-11 w-full' dir='rtl'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position='popper' dir='rtl' className='z-50'>
              <SelectItem value='LINK'>لینک</SelectItem>
              <SelectItem value='CATEGORY'>دسته‌بندی</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === 'LINK' ? (
          <>
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-secondary-1'>عنوان</label>
              <Input value={label} placeholder='مثلا درباره ما' className='h-11' onChange={(event) => setLabel(event.target.value)} />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm text-secondary-1'>آدرس</label>
              <Input dir='ltr' value={url} placeholder='/about' className='h-11' onChange={(event) => setUrl(event.target.value)} />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm text-secondary-1'>توضیح (اختیاری)</label>
              <Textarea rows={3} value={description} placeholder='توضیح کوتاه' className='resize-none' onChange={(event) => setDescription(event.target.value)} />
            </div>

            <ImagePickerField label='تصویر (اختیاری)' value={file} onChange={setFile} disabled={submitting} />
          </>
        ) : (
          <CategoryPickerField
            label='دسته‌بندی'
            value={selectedCategory}
            onChange={(category) => {
              setCategoryId(category?.id ?? null);
              if (error) setError(null);
            }}
            categories={categories}
            pickerTitle='انتخاب دسته‌بندی فوتر'
          />
        )}

        {error && <p className='text-sm text-custom-red'>{error}</p>}
      </div>
    </ReusableModal>
  );
}
