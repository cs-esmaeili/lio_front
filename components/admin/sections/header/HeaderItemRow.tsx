'use client';

import { Link2, Pencil, Tags, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { cn } from '@/lib/utils';
import type { HeaderItem } from '@/typescript/schemas/page-section.schema';

interface HeaderItemRowProps {
  item: HeaderItem;
  index: number;
  deleting?: boolean;
  onEdit: (item: HeaderItem) => void;
  onDelete: (item: HeaderItem) => void;
}

export default function HeaderItemRow({ item, index, deleting = false, onEdit, onDelete }: HeaderItemRowProps) {
  const isCategory = item.type === 'CATEGORY';

  return (
    <div className={cn('flex items-center gap-3 rounded-xl border border-gray-1 bg-custom-white px-3 py-2.5', deleting && 'pointer-events-none opacity-60')}>
      <span className='grid size-8 shrink-0 place-content-center rounded-lg bg-gray-1 text-caption text-secondary-2'>{index + 1}</span>

      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
          isCategory ? 'bg-primary-4 text-primary-1' : 'bg-gray-1 text-secondary-1',
        )}>
        {isCategory ? <Tags size={11} aria-hidden='true' /> : <Link2 size={11} aria-hidden='true' />}
        {isCategory ? 'دسته‌بندی' : 'لینک'}
      </span>

      <div className='flex min-w-0 flex-1 flex-col'>
        <span className='truncate text-sm font-medium text-secondary-black-3'>{item.label || '—'}</span>
        {item.url && (
          <span className='truncate text-caption text-secondary-3' dir='ltr' title={item.url}>
            {item.url}
          </span>
        )}
      </div>

      {deleting ? (
        <Spinner className='text-primary-1' />
      ) : (
        <div className='flex shrink-0 items-center gap-1'>
          <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:text-primary-1' title='ویرایش' onClick={() => onEdit(item)}>
            <Pencil />
          </Button>
          <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red' title='حذف' onClick={() => onDelete(item)}>
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  );
}
