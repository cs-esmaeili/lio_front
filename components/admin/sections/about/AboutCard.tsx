'use client';

import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import type { AboutSection } from '@/typescript/schemas/page-section.schema';

interface AboutCardProps {
  section: AboutSection;
  deleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className='flex flex-col'>
      <dt className='text-caption text-secondary-3'>{label}</dt>
      <dd className='truncate text-regular text-secondary-1'>{value || '—'}</dd>
    </div>
  );
}

export default function AboutCard({ section, deleting = false, onEdit, onDelete }: AboutCardProps) {
  const { headerTitle, historyTitle, founderTitle, statistics } = section.data;

  return (
    <div className={cn('flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-5', deleting && 'pointer-events-none opacity-60')}>
      <div className='flex items-start justify-between gap-2'>
        <h2 className='text-lg font-bold text-secondary-black-3'>درباره ما</h2>

        <div className='flex shrink-0 items-center gap-1'>
          <Button type='button' variant='ghost' size='icon-sm' className='text-secondary-2 hover:text-primary-1' title='ویرایش' onClick={onEdit}>
            <Pencil />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
            title='حذف'
            onClick={onDelete}>
            <Trash2 />
          </Button>
        </div>
      </div>

      <dl className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Row label='عنوان معرفی' value={headerTitle} />
        <Row label='تاریخچه' value={historyTitle} />
        <Row label='پیام موسس' value={founderTitle} />
        <Row label='آمارها' value={statistics.length > 0 ? `${statistics.length} مورد` : null} />
      </dl>
    </div>
  );
}
