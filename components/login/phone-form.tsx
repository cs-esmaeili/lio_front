'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/login/spinner';
import { PhoneFormSchema, type PhoneFormValues } from '@/typescript/schemas/phone-form.schema';
import { useSendOtp } from '@/hooks/login/useSendOtp';

type Props = {
  onSubmit: (phone: string) => void;
};

export function PhoneForm({ onSubmit }: Props) {
  const { sendOtp, loading } = useSendOtp();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    resolver: standardSchemaResolver(PhoneFormSchema),
    defaultValues: { phone: '' },
  });

  const onValid = async (data: PhoneFormValues) => {
    const result = await sendOtp(data.phone);
    if (result) {
      onSubmit(data.phone);
    }
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div className='mb-6'>
        <h1 className='mb-1 text-xl text-gray-1 font-normal'>ورود | ثبت نام</h1>
        <p className='text-sm text-gray-3'>لطفا شماره موبایل خود را وارد کنید</p>
      </div>

      <div className='mb-4'>
        <Input
          id='phone'
          type='tel'
          inputMode='numeric'
          autoComplete='tel'
          autoFocus
          dir='ltr'
          placeholder='09xxxxxxxxx'
          aria-label='شماره همراه'
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          aria-invalid={!!errors.phone}
          className={[
            'h-12 bg-transparent! rounded-lg px-4 text-center text-base text-gray-1 placeholder:text-slate-300',
            errors.phone
              ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20'
              : 'border-gray-1 focus-visible:border-primary-2 focus-visible:ring-gray-1/20',
          ].join(' ')}
          {...register('phone', {
            onChange: (e) => {
              const cleaned = e.target.value.replace(/\D/g, '').slice(0, 11);
              setValue('phone', cleaned, { shouldValidate: false });
              clearErrors('phone');
            },
          })}
        />

        {errors.phone && (
          <p id='phone-error' role='alert' className='mt-1.5 text-right text-xs text-red-500'>
            {errors.phone.message}
          </p>
        )}
      </div>

      <Button
        type='submit'
        disabled={loading}
        className='w-full flex-1 h-12 rounded-lg bg-primary-1 hover:bg-primary-black-1 text-white border border-primary-1 cursor-pointer'>
        {loading ? (
          <span className='flex items-center justify-center gap-2'>
            <Spinner />
            در حال ارسال...
          </span>
        ) : (
          'ارسال'
        )}
      </Button>

      <div className='mt-4 text-center'>
        <Button
          type='button'
          variant='link'
          asChild
          className='text-xs text-gray-3 hover:text-primary-1 cursor-pointer'>
          <Link href='/'>بازگشت به صفحه اصلی</Link>
        </Button>
      </div>
    </form>
  );
}
