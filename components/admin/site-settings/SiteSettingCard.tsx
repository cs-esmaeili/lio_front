'use client';

import { Globe, Lock, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { cn } from '@/lib/utils';
import { summarizeSetting } from './site-settings.model';
import type { SiteSetting } from '@/typescript/schemas/site-setting.schema';

interface SiteSettingCardProps {
  setting: SiteSetting;
  deleting?: boolean;
  onEdit: (setting: SiteSetting) => void;
  onDelete: (setting: SiteSetting) => void;
}

export default function SiteSettingCard({ setting, deleting = false, onEdit, onDelete }: SiteSettingCardProps) {
  const { entries, rest } = summarizeSetting(setting);

  return (
    <div className={cn('flex flex-col gap-3 rounded-xl border border-gray-1 bg-custom-white p-4 transition-colors hover:border-primary-3', deleting && 'pointer-events-none opacity-60')}>
      {/* Header */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex min-w-0 flex-col gap-1.5'>
          <span className='truncate font-mono text-sm font-bold text-secondary-black-3' dir='ltr' title={setting.key}>
            {setting.key}
          </span>

          <span
            className={cn(
              'inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
              setting.isPrivate ? 'bg-gray-1 text-secondary-1' : 'bg-primary-4 text-primary-1',
            )}>
            {setting.isPrivate ? <Lock size={11} aria-hidden='true' /> : <Globe size={11} aria-hidden='true' />}
            {setting.isPrivate ? 'خصوصی' : 'عمومی'}
          </span>
        </div>

        <div className='flex shrink-0 items-center gap-1'>
          {deleting ? (
            <Spinner className='text-primary-1' />
          ) : (
            <>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='text-secondary-2 hover:text-primary-1'
                title='ویرایش'
                onClick={() => onEdit(setting)}>
                <Pencil />
              </Button>

              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                title='حذف'
                onClick={() => onDelete(setting)}>
                <Trash2 />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Data preview */}
      <div className='flex min-w-0 flex-col gap-1'>
        {entries.length === 0 ? (
          <span className='text-caption text-secondary-3'>بدون داده</span>
        ) : (
          entries.map((entry) => (
            <span key={entry} className='truncate rounded-md bg-gray-1 px-2 py-1 font-mono text-[11px] text-secondary-1' dir='ltr' title={entry}>
              {entry}
            </span>
          ))
        )}

        {rest > 0 && <span className='text-caption text-secondary-3'>+ {rest.toLocaleString('fa-IR')} مورد دیگر</span>}
      </div>
    </div>
  );
}
