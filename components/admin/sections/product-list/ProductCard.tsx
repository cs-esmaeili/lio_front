'use client';

import { ImageOff, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { cn } from '@/lib/utils';
import { resolveFileUrl } from '@/utils/fileUrl';
import { formatPrice } from '@/components/admin/product-manager/product-manager.model';
import type { ProductListItem } from '@/typescript/schemas/page-section.schema';

interface ProductCardProps {
  item: ProductListItem;
  index: number;
  deleting?: boolean;
  onEdit: (item: ProductListItem) => void;
  onDelete: (item: ProductListItem) => void;
}

export default function ProductCard({ item, index, deleting = false, onEdit, onDelete }: ProductCardProps) {
  const primary = item.images.find((image) => image.isPrimary) ?? item.images[0];
  const image = resolveFileUrl(primary?.url ?? null);

  return (
    <div className={cn('flex flex-col overflow-hidden rounded-xl border border-gray-1 bg-custom-white transition-colors hover:border-primary-3', deleting && 'pointer-events-none opacity-60')}>
      <div className='relative flex h-36 items-center justify-center overflow-hidden bg-gray-1/60'>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={item.productName} className='h-full w-full object-cover' />
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

      <div className='flex min-w-0 flex-1 flex-col gap-1 p-3'>
        <span className='truncate text-sm font-medium text-secondary-black-3' title={item.productName}>
          {item.productName || '—'}
        </span>
        <span className='truncate text-caption text-secondary-3' dir='ltr' title={item.productSlug}>
          {item.productSlug}
        </span>
        <span className='mt-1 text-caption text-secondary-2'>{formatPrice(item.defaultVariant?.price ?? null)} تومان</span>
      </div>

      <div className='flex items-center justify-end gap-1 border-t border-gray-1 px-2 py-1.5'>
        <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:text-primary-1' title='تغییر محصول' onClick={() => onEdit(item)}>
          <Pencil />
        </Button>
        <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red' title='حذف' onClick={() => onDelete(item)}>
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
