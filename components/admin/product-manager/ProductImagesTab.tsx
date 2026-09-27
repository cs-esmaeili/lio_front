'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Star, Trash2 } from 'lucide-react';

import FileManagerDialog from '@/components/admin/file-manager/FileManagerDialog';
import { Button } from '@/components/shadcn/button';
import type { ProductFormState, ProductImageDraft } from './product-manager.model';

interface ProductImagesTabProps {
  state: ProductFormState;
  disabled: boolean;
  onChange: (patch: Partial<ProductFormState>) => void;
}

function withPrimary(images: ProductImageDraft[], primaryIndex: number): ProductImageDraft[] {
  return images.map((image, index) => ({ ...image, isPrimary: index === primaryIndex }));
}

export default function ProductImagesTab({ state, disabled, onChange }: ProductImagesTabProps) {
  const [open, setOpen] = useState(false);

  const setImages = (images: ProductImageDraft[]) => onChange({ images });

  const handleAdd = (files: { id?: number; url: string }[]) => {
    const existingIds = new Set(state.images.map((image) => image.fileId));
    const added = files
      .filter((file): file is { id: number; url: string } => typeof file.id === 'number' && !existingIds.has(file.id))
      .map((file) => ({ fileId: file.id, url: file.url, isPrimary: false, isThumbnail: false }));

    if (added.length === 0) return;

    const next = [...state.images, ...added];
    setImages(state.images.length === 0 ? withPrimary(next, 0) : next);
  };

  const removeImage = (index: number) => {
    const next = state.images.filter((_, imageIndex) => imageIndex !== index);
    setImages(next.length > 0 && !next.some((image) => image.isPrimary) ? withPrimary(next, 0) : next);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= state.images.length) return;
    const next = [...state.images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-3'>
        <p className='text-regular text-secondary-2'>تصویر اصلی در کارت محصول و تصویر بندانگشتی در فهرست‌ها استفاده می‌شود.</p>
        {!disabled && (
          <Button type='button' variant='outline' className='h-10 shrink-0 rounded-lg border-gray-2' onClick={() => setOpen(true)}>
            <ImagePlus />
            افزودن تصویر
          </Button>
        )}
      </div>

      {state.images.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 py-16 text-center'>
          <ImagePlus className='text-secondary-3' size={34} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>هنوز تصویری برای محصول انتخاب نشده است.</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
          {state.images.map((image, index) => (
            <div key={`${image.fileId}-${index}`} className='flex flex-col overflow-hidden rounded-xl border border-gray-1'>
              <div className='relative aspect-square bg-gray-1'>
                {image.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.url} alt='' className='h-full w-full object-cover' />
                ) : (
                  <div className='grid h-full place-content-center text-secondary-3'>
                    <ImagePlus size={22} aria-hidden='true' />
                  </div>
                )}

                <div className='absolute start-1.5 top-1.5 flex flex-col gap-1'>
                  {image.isPrimary && <span className='rounded-full bg-primary-1 px-2 py-0.5 text-[10px] text-custom-white'>اصلی</span>}
                  {image.isThumbnail && <span className='rounded-full bg-secondary-black-3 px-2 py-0.5 text-[10px] text-custom-white'>بندانگشتی</span>}
                </div>
              </div>

              <div className='flex items-center justify-between gap-1 px-2 py-2'>
                <div className='flex items-center gap-0.5'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className='rounded-lg text-secondary-2'
                    title='حرکت به راست'
                    disabled={disabled || index === 0}
                    onClick={() => moveImage(index, -1)}>
                    <ArrowRight />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className='rounded-lg text-secondary-2'
                    title='حرکت به چپ'
                    disabled={disabled || index === state.images.length - 1}
                    onClick={() => moveImage(index, 1)}>
                    <ArrowLeft />
                  </Button>
                </div>

                <div className='flex items-center gap-0.5'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className={`rounded-lg ${image.isPrimary ? 'text-primary-1' : 'text-secondary-2'}`}
                    title='انتخاب به عنوان تصویر اصلی'
                    disabled={disabled || image.isPrimary}
                    onClick={() => setImages(withPrimary(state.images, index))}>
                    <Star />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className={`rounded-lg ${image.isThumbnail ? 'text-primary-1' : 'text-secondary-2'}`}
                    title='تصویر بندانگشتی'
                    disabled={disabled}
                    onClick={() => setImages(state.images.map((item, imageIndex) => (imageIndex === index ? { ...item, isThumbnail: !item.isThumbnail } : item)))}>
                    <span className='text-[11px] font-bold'>ت</span>
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className='rounded-lg text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                    title='حذف تصویر'
                    disabled={disabled}
                    onClick={() => removeImage(index)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FileManagerDialog
        open={open}
        onOpenChange={setOpen}
        title='انتخاب تصاویر محصول'
        accept='image/*'
        multiple
        onSelect={(files) => handleAdd(files)}
      />
    </div>
  );
}
