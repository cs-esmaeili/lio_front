'use client';

import { CircleAlert } from 'lucide-react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import type { SiteSetting } from '@/typescript/schemas/site-setting.schema';

interface ConfirmDeleteSettingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting: SiteSetting | null;
  loading: boolean;
  onConfirm: () => void;
}

export default function ConfirmDeleteSettingModal({ open, onOpenChange, setting, loading, onConfirm }: ConfirmDeleteSettingModalProps) {
  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={loading} onClick={() => onOpenChange(false)}>
        انصراف
      </Button>

      <Button type='button' variant='destructive' className='h-11 rounded-xl px-6' disabled={loading} onClick={onConfirm}>
        {loading && <Spinner />}
        حذف
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title='تایید حذف' footer={footer} size='sm'>
      <div className='flex items-start gap-3'>
        <div className='grid size-10 shrink-0 place-content-center rounded-full bg-custom-red/10'>
          <CircleAlert className='text-custom-red' size={20} aria-hidden='true' />
        </div>

        <div className='flex min-w-0 flex-col gap-1.5'>
          <p className='text-regular text-secondary-1'>
            آیا از حذف تنظیم <span dir='ltr' className='font-bold text-secondary-black-3'>«{setting?.key}»</span> مطمئن هستید؟
          </p>
          <p className='text-caption text-custom-red'>این عملیات قابل بازگشت نیست.</p>
        </div>
      </div>
    </ReusableModal>
  );
}
