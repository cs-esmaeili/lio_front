'use client';

import { ImageOff, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { resolveFileUrl } from '@/utils/fileUrl';
import { cn } from '@/lib/utils';
import type { SliderSlide } from '@/typescript/schemas/page-section.schema';

interface SliderSlideCardProps {
  slide: SliderSlide;
  index: number;
  deleting?: boolean;
  onEdit: (slide: SliderSlide) => void;
  onDelete: (slide: SliderSlide) => void;
}

function Thumb({ url, label }: { url: string | null; label: string }) {
  const src = resolveFileUrl(url);

  return (
    <div className='flex flex-col items-center gap-1'>
      <div className='grid size-10 place-content-center overflow-hidden rounded-md border border-gray-2 bg-gray-1'>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={label} className='h-full w-full object-cover' />
        ) : (
          <ImageOff className='text-secondary-3' size={14} aria-hidden='true' />
        )}
      </div>
      <span className='text-caption text-secondary-3'>{label}</span>
    </div>
  );
}

export default function SliderSlideCard({ slide, index, deleting = false, onEdit, onDelete }: SliderSlideCardProps) {
  const desktop = resolveFileUrl(slide.desktopFileUrl);

  return (
    <div className={cn('flex flex-col overflow-hidden rounded-xl border border-gray-1 bg-custom-white transition-colors hover:border-primary-3', deleting && 'pointer-events-none opacity-60')}>
      {/* Desktop preview */}
      <div className='relative flex h-36 items-center justify-center overflow-hidden bg-gray-1/60'>
        {desktop ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={desktop} alt={`اسلاید ${index + 1}`} className='h-full w-full object-cover' />
        ) : (
          <ImageOff className='text-secondary-3' size={32} aria-hidden='true' />
        )}

        <span className='absolute top-2 end-2 rounded-full bg-secondary-black-3/70 px-2 py-0.5 text-[10px] font-medium text-custom-white'>
          {(index + 1).toLocaleString('fa-IR')}
        </span>

        {deleting && (
          <div className='absolute inset-0 grid place-content-center bg-custom-white/60'>
            <Spinner className='text-primary-1' />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className='flex min-w-0 flex-col gap-2 p-3'>
        <div className='flex min-w-0 flex-col gap-1'>
          <span className='text-caption text-secondary-2'>لینک اسلاید</span>
          <span className='truncate text-sm font-medium text-secondary-black-3' dir='ltr' title={slide.url ?? '—'}>
            {slide.url || '—'}
          </span>
        </div>

        <div className='flex items-center gap-3'>
          <Thumb url={slide.tabletFileUrl} label='تبلت' />
          <Thumb url={slide.mobileFileUrl} label='موبایل' />
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center justify-end gap-1 border-t border-gray-1 px-2 py-1.5'>
        <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:text-primary-1' title='ویرایش' onClick={() => onEdit(slide)}>
          <Pencil />
        </Button>
        <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red' title='حذف' onClick={() => onDelete(slide)}>
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
