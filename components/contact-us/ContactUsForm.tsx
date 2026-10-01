'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Spinner } from '@/components/shadcn/spinner';

import { ContactUsFormSchema, type ContactUsFormValues } from '@/typescript/schemas/contactus-form.schema';

import { useContactUsForm } from '@/hooks/useContactUsForm';

export default function ContactUsForm() {
  const { loading, submitted, sendContactUsForm } = useContactUsForm();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<ContactUsFormValues>({
    resolver: standardSchemaResolver(ContactUsFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      message: '',
    },
  });

  const onValid = async (data: ContactUsFormValues) => {
    const result = await sendContactUsForm(data.name, data.phone, data.message);
    if (result) {
      reset();
    }
  };

  return (
    <div className='h-full rounded-[20px] bg-secondary-black-3 p-8 shadow-[20px_20px_40px_rgb(6,6,7,0.1)]'>
      <h4 className='text-gray-1'>فرم درخواست تماس</h4>

      <form onSubmit={handleSubmit(onValid)} className='mt-5 space-y-5'>
        <div className='relative'>
          <label htmlFor='name' className='absolute -top-3 right-3 rounded-[8px] bg-secondary-black-3 px-1 text-[12px] font-medium text-gray-1'>
            نام و نام خانوادگی
          </label>

          <Input
            id='name'
            className={['h-12 rounded-[8px] border bg-transparent text-gray-1', errors.name ? 'border-red-500' : 'border-gray-1'].join(' ')}
            {...register('name', {
              onChange: () => clearErrors('name'),
            })}
          />

          {errors.name && <p className='mt-1 text-xs text-red-500'>{errors.name.message}</p>}
        </div>

        <div className='relative'>
          <label htmlFor='phone' className='absolute -top-3 right-3 rounded-[8px] bg-secondary-black-3 px-1 text-[12px] font-medium text-gray-1'>
            شماره همراه
          </label>

          <Input
            id='phone'
            type='tel'
            inputMode='numeric'
            dir='ltr'
            className={['h-12 rounded-[8px] border bg-transparent text-center text-gray-1', errors.phone ? 'border-red-500' : 'border-gray-1'].join(
              ' '
            )}
            {...register('phone', {
              onChange: (e) => {
                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 11);

                setValue('phone', cleaned, {
                  shouldValidate: false,
                });

                clearErrors('phone');
              },
            })}
          />

          {errors.phone && <p className='mt-1 text-xs text-red-500'>{errors.phone.message}</p>}
        </div>

        <div className='relative'>
          <label
            htmlFor='message'
            className='absolute -top-3 right-3 rounded-[8px] bg-secondary-black-3 px-1 text-[12px] font-medium text-gray-1'>
            توضیحات مختصر 
          </label>

          <Textarea
            id='message'
            className={[
              'min-h-32 resize-y rounded-[8px] border bg-transparent text-gray-1',
              errors.message ? 'border-red-500' : 'border-gray-1',
            ].join(' ')}
            {...register('message', {
              onChange: () => clearErrors('message'),
            })}
          />

          {errors.message && <p className='mt-1 text-xs text-red-500'>{errors.message.message}</p>}
        </div>

        {!submitted && (
          <Button type='submit' disabled={loading} className='mt-4 h-12 w-full rounded-[8px] bg-primary text-primary-4'>
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <Spinner />
                در حال ارسال...
              </span>
            ) : (
              'ارسال'
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
