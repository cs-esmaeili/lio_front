'use client';

import { Mail, MapPin, Pencil, Phone, Timer, Trash2 } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import type { ContactSection } from '@/typescript/schemas/page-section.schema';

interface ContactCardProps {
  section: ContactSection;
  deleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  ltr = false,
}: {
  icon: typeof MapPin;
  label: string;
  value: string | null;
  ltr?: boolean;
}) {
  return (
    <div className='flex items-start gap-2'>
      <Icon className='mt-0.5 shrink-0 text-secondary-3' size={16} aria-hidden='true' />
      <div className='flex min-w-0 flex-col'>
        <dt className='text-caption text-secondary-3'>{label}</dt>
        <dd className='text-regular text-secondary-1' dir={ltr ? 'ltr' : 'auto'}>
          {value || '—'}
        </dd>
      </div>
    </div>
  );
}

export default function ContactCard({ section, deleting = false, onEdit, onDelete }: ContactCardProps) {
  const { address, email, supportHour, mapLat, mapLng, supportPhone } = section.data;

  return (
    <div className={cn('flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-5', deleting && 'pointer-events-none opacity-60')}>
      <div className='flex items-start justify-between gap-2'>
        <h2 className='text-lg font-bold text-secondary-black-3'>اطلاعات تماس</h2>

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
        <InfoRow icon={MapPin} label='آدرس' value={address} />
        <InfoRow icon={Mail} label='ایمیل' value={email} ltr />
        <InfoRow icon={Phone} label='تلفن پشتیبانی' value={supportPhone} ltr />
        <InfoRow icon={Timer} label='ساعت کاری' value={supportHour} />
      </dl>

      <div className='flex items-center gap-2 border-t border-gray-1 pt-3 text-caption text-secondary-3'>
        <MapPin size={14} aria-hidden='true' />
        <span>مختصات نقشه:</span>
        <span dir='ltr' className='font-mono'>
          {mapLat != null && mapLng != null ? `${mapLat}, ${mapLng}` : 'ثبت نشده'}
        </span>
      </div>
    </div>
  );
}
