'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';

type OrderTrackingFormProps = {
  loading?: boolean;
  initialValue?: string;
  onSearch?: (code: string) => void;
  redirectTo?: string;
};

export default function OrderTrackingForm({
  loading = false,
  initialValue = '',
  onSearch,
  redirectTo = '/dashboard/tracking/',
}: OrderTrackingFormProps) {
  const [orderCode, setOrderCode] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const code = orderCode.trim();

    if (!code) {
      toast.error('شماره سفارش را وارد کنید.');
      return;
    }

    if (onSearch) {
      onSearch(code);
    } else {
      router.push(`${redirectTo}?code=${encodeURIComponent(code)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mt-5'>
      <div className='flex flex-col gap-3 lg:flex-row'>
        <Input
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          placeholder='شماره پیگیری سفارش را وارد نمایید...'
          inputMode='numeric'
          className='h-12 text-[13px]'
        />

        <Button
          type='submit'
          variant='outline'
          disabled={loading}
          className='h-12 lg:w-50 border-primary-1 text-primary-1! text-xs cursor-pointer'>
          {loading ? 'در حال جستجو...' : 'استعلام وضعیت سفارش'}
        </Button>
      </div>
    </form>
  );
}