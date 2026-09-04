'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Spinner } from '@/components/shadcn/spinner';

import { FaqFormSchema, type FaqFormValues } from '@/typescript/schemas/faq-form.schema';

import { useFaqForm } from '@/hooks/useFaqForm';


export default function FaqForm() {
  const { loading, submitted, sendFaqForm } = useFaqForm();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: standardSchemaResolver(FaqFormSchema),
    defaultValues: {
      name: '',
      mobile: '',
      description: '',
    },
  });

  const onValid = async (data: FaqFormValues) => {
    const result = await sendFaqForm(data.name, 0, 'subject', data.mobile, data.description);
    if (result) {
      reset();
    }
  };

  return (
    <div className='rounded-[20px] bg-gray-1 p-8'>
      <h4 className='text-secondary-black-3'>سوال اختصاصی شما</h4>

      <form onSubmit={handleSubmit(onValid)} className='mt-5 space-y-5'>
        <div className='relative'>
          <label htmlFor='name' className='absolute -top-3 right-3 rounded-[8px] bg-gray-1 px-1 text-[12px] font-medium text-secondary-black-3'>
            نام و نام خانوادگی
          </label>

          <Input
            id='name'
            className={['h-12 rounded-[8px] border bg-transparent text-gray-1', errors.name ? 'border-red-500' : 'border-secondary-2'].join(' ')}
            {...register('name', {
              onChange: () => clearErrors('name'),
            })}
          />

          {errors.name && <p className='mt-1 text-xs text-red-500'>{errors.name.message}</p>}
        </div>

        <div className='relative'>
          <label htmlFor='mobile' className='absolute -top-3 right-3 rounded-[8px] bg-gray-1 px-1 text-[12px] font-medium text-secondary-black-3'>
            شماره همراه
          </label>

          <Input
            id='mobile'
            type='tel'
            inputMode='numeric'
            dir='ltr'
            className={['h-12 rounded-[8px] border bg-transparent text-center text-gray-1', errors.mobile ? 'border-red-500' : 'border-secondary-2'].join(
              ' '
            )}
            {...register('mobile', {
              onChange: (e) => {
                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 11);

                setValue('mobile', cleaned, {
                  shouldValidate: false,
                });

                clearErrors('mobile');
              },
            })}
          />

          {errors.mobile && <p className='mt-1 text-xs text-red-500'>{errors.mobile.message}</p>}
        </div>

        <div className='relative'>
          <label
            htmlFor='description'
            className='absolute -top-3 right-3 rounded-[8px] bg-gray-1 px-1 text-[12px] font-medium text-secondary-black-3'>
            توضیحات مختصر 
          </label>

          <Textarea
            id='description'
            className={[
              'min-h-32 resize-y rounded-[8px] border bg-transparent text-gray-1',
              errors.description ? 'border-red-500' : 'border-secondary-2',
            ].join(' ')}
            {...register('description', {
              onChange: () => clearErrors('description'),
            })}
          />

          {errors.description && <p className='mt-1 text-xs text-red-500'>{errors.description.message}</p>}
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
