'use client';

import { CircleAlert } from 'lucide-react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';

export interface DeleteTarget {
  type: 'file' | 'folder';
  name: string;
}

interface ConfirmDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: DeleteTarget | null;
  loading: boolean;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ open, onOpenChange, target, loading, onConfirm }: ConfirmDeleteModalProps) {
  const isFolder = target?.type === 'folder';

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
        <div className='grid size-10 shrink-0 place-content-center rounded-full bg-destructive/10'>
          <CircleAlert className='text-destructive' size={20} aria-hidden='true' />
        </div>

        <div className='flex min-w-0 flex-col gap-1.5'>
          <p className='text-regular text-secondary-1'>
            آیا از حذف {isFolder ? 'پوشه' : 'فایل'} <span className='font-bold text-secondary-black-3'>«{target?.name}»</span> مطمئن هستید؟
          </p>

          {isFolder && <p className='text-caption text-destructive'>تمام فایل‌ها و پوشه‌های داخل آن نیز حذف می‌شوند.</p>}
        </div>
      </div>
    </ReusableModal>
  );
}
