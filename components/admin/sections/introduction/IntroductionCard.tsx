'use client';

import { ImageOff, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { cn } from '@/lib/utils';
import { resolveFileUrl } from '@/utils/fileUrl';
import type { IntroductionSection } from '@/typescript/schemas/page-section.schema';

interface IntroductionCardProps {
  section: IntroductionSection;
  deleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function Thumb({ url, label }: { url: string | null; label: string }) {
  const src = resolveFileUrl(url);

  return (
    <div className='flex flex-col items-center gap-1'>
      <div className='grid size-12 place-content-center overflow-hidden rounded-md border border-gray-2 bg-gray-1'>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={label} className='h-full w-full object-cover' />
        ) : (
          <ImageOff className='text-secondary-3' size={16} aria-hidden='true' />
        )}
      </div>
      <span className='text-caption text-secondary-3'>{label}</span>
    </div>
  );
}

export default function IntroductionCard({ section, deleting = false, onEdit, onDelete }: IntroductionCardProps) {
  const desktop = resolveFileUrl(section.data.desktopFileUrl);
  const titles = Object.entries(section.data.titles);

  return (
    <div className={cn('flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-1 bg-custom-white p-5 md:flex-row', deleting && 'pointer-events-none opacity-60')}>
      {/* Desktop preview */}
      <div className='relative flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-1/60 md:w-72'>
        {desktop ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={desktop} alt='تصویر معرفی' className='h-full w-full object-cover' />
        ) : (
          <ImageOff className='text-secondary-3' size={32} aria-hidden='true' />
        )}

        {deleting && (
          <div className='absolute inset-0 grid place-content-center bg-custom-white/60'>
            <Spinner className='text-primary-1' />
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex min-w-0 flex-1 flex-col gap-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Thumb url={section.data.tabletFileUrl} label='تبلت' />
            <Thumb url={section.data.mobileFileUrl} label='موبایل' />
          </div>

          <div className='flex shrink-0 items-center gap-1'>
            <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:text-primary-1' title='ویرایش' onClick={onEdit}>
              <Pencil />
            </Button>
            <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red' title='حذف' onClick={onDelete}>
              <Trash2 />
            </Button>
          </div>
        </div>

        {titles.length === 0 ? (
          <p className='text-caption text-secondary-3'>متنی ثبت نشده است.</p>
        ) : (
          <dl className='flex flex-col gap-1.5'>
            {titles.map(([key, value]) => (
              <div key={key} className='flex items-start gap-2'>
                <dt className='w-28 shrink-0 truncate font-mono text-caption text-secondary-3' dir='ltr' title={key}>
                  {key}
                </dt>
                <dd className='min-w-0 flex-1 text-regular text-secondary-1'>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
