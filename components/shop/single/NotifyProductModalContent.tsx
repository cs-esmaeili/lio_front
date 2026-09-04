'use client';

import { useState } from 'react';
import {
  addProductNotificationCSR,
} from '@/services/productNotification.service';

type NotificationOption = {
  type: 'mobile' | 'email' | 'notification';
  value: string | boolean;
};

type NotifyProductModalContentProps = {
  options: NotificationOption[];
  barcode?: string;
  variantId?: number;
  onSuccess?: () => void;
};

export default function NotifyProductModalContent({
  options,
  barcode,
  variantId,
  onSuccess,
}: NotifyProductModalContentProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (!barcode || !variantId) {
      console.error('Notification params are missing:', {
        barcode,
        variantId,
      });
      return;
    }

    if (selectedTypes.length === 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await addProductNotificationCSR(
        barcode,
        variantId,
        selectedTypes
      );


      if (response.data?.status === 200) {
        onSuccess?.();
      }
    } catch (error) {
      console.error('add product notification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6' dir='rtl'>
      <div>
        <h3 className='text-base font-semibold text-secondary-1'>
          اطلاع‌رسانی
        </h3>

        <p className='mt-2 text-sm text-secondary-2'>
          در صورت موجود شدن کالا چگونه به شما اطلاع دهیم؟
        </p>
      </div>

      <div className='flex flex-col gap-4'>
        {options.map((option) => (
          <label
            key={option.type}
            className='flex items-center gap-3 cursor-pointer'
          >
            <input
              type='checkbox'
              checked={selectedTypes.includes(option.type)}
              onChange={() => handleTypeChange(option.type)}
              className='w-5 h-5 accent-primary-1'
            />

            <span className='text-sm text-secondary-black-1'>
              {option.type === 'mobile' && (
                <>
                  ارسال پیامک به{' '}
                  <strong>{option.value}</strong>
                </>
              )}

              {option.type === 'email' && (
                <>
                  ارسال ایمیل به{' '}
                  <strong>{option.value}</strong>
                </>
              )}

              {option.type === 'notification' && (
                <>اطلاع‌رسانی در پروفایل کاربری شما</>
              )}
            </span>
          </label>
        ))}
      </div>

      <button
        type='button'
        disabled={loading || selectedTypes.length === 0}
        className='w-full h-12 rounded-xl bg-primary-1 hover:bg-primary-black-1 text-white disabled:opacity-50 disabled:cursor-not-allowed'
        onClick={handleSubmit}
      >
        {loading ? 'در حال ثبت...' : 'ثبت درخواست'}
      </button>
    </div>
  );
}