'use client';

import { ImageOff, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { cn } from '@/lib/utils';
import { resolveFileUrl } from '@/utils/fileUrl';

interface FooterItemRowProps {
  title: string;
  url?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  deleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function FooterItemRow({ title, url, description, imageUrl, deleting = false, onEdit, onDelete }: FooterItemRowProps) {
  const image = resolveFileUrl(imageUrl);

  return (
    <div className={cn('flex items-center gap-3 rounded-xl border border-gray-1 bg-custom-white px-3 py-2.5', deleting && 'pointer-events-none opacity-60')}>
      <div className='grid size-10 shrink-0 place-content-center overflow-hidden rounded-lg border border-gray-2 bg-gray-1'>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={title} className='h-full w-full object-cover' />
        ) : (
          <ImageOff className='text-secondary-3' size={16} aria-hidden='true' />
        )}
      </div>

      <div className='flex min-w-0 flex-1 flex-col'>
        <span className='truncate text-sm font-medium text-secondary-black-3'>{title || '—'}</span>
        {description ? (
          <span className='truncate text-caption text-secondary-2'>{description}</span>
        ) : (
          url && (
            <span className='truncate text-caption text-secondary-3' dir='ltr' title={url}>
              {url}
            </span>
          )
        )}
      </div>

      {deleting ? (
        <Spinner className='text-primary-1' />
      ) : (
        <div className='flex shrink-0 items-center gap-1'>
          <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:text-primary-1' title='ویرایش' onClick={onEdit}>
            <Pencil />
          </Button>
          <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red' title='حذف' onClick={onDelete}>
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  );
}
