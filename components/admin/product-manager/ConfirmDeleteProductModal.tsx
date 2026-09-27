'use client';

import { CircleAlert } from 'lucide-react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import type { AdminProductListItem } from '@/typescript/schemas/products/admin-product.schema';

interface ConfirmDeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AdminProductListItem | null;
  loading: boolean;
  onConfirm: () => void;
}

export default function ConfirmDeleteProductModal({ open, onOpenChange, product, loading, onConfirm }: ConfirmDeleteProductModalProps) {
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
    <ReusableModal open={open} onOpenChange={onOpenChange} title='تایید حذف محصول' footer={footer} size='sm'>
      <div className='flex items-start gap-3'>
        <div className='grid size-10 shrink-0 place-content-center rounded-full bg-custom-red/10'>
          <CircleAlert className='text-custom-red' size={20} aria-hidden='true' />
        </div>
        <div className='flex min-w-0 flex-col gap-1.5'>
          <p className='text-regular text-secondary-1'>
            آیا از حذف محصول <span className='font-bold text-secondary-black-3'>«{product?.name ?? ''}»</span> مطمئن هستید؟
          </p>
          <p className='text-caption text-custom-red'>تمام تصاویر، مشخصات و تنوع‌های این محصول حذف می‌شوند.</p>
        </div>
      </div>
    </ReusableModal>
  );
}
