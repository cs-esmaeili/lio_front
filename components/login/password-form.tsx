'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/login/spinner';
import { PasswordLoginFormSchema, type PasswordLoginFormValues } from '@/typescript/schemas/password-login-form.schema';
import { usePasswordLogin } from '@/hooks/login/usePasswordLogin';
import { useCart } from '@/hooks/cart/useCart';

type Props = {
  returnUrl?: string;
};

export function PasswordForm({ returnUrl }: Props) {
  const { loginWithPassword, loading } = usePasswordLogin();
  const { mergeAfterLogin } = useCart();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<PasswordLoginFormValues>({
    resolver: standardSchemaResolver(PasswordLoginFormSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onValid = async (data: PasswordLoginFormValues) => {
    const user = await loginWithPassword(data.phone, data.password);

    if (!user) {
      return;
    }

    await mergeAfterLogin();
    window.location.assign(returnUrl || '/dashboard');
  };

  const inputClass = (hasError: boolean) =>
    [
      'h-12 bg-transparent! rounded-lg px-4 text-center text-base text-secondary-black-3 placeholder:text-secondary-3',
      hasError
        ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20'
        : 'border-gray-2 focus-visible:border-primary-2 focus-visible:ring-gray-2/40',
    ].join(' ');

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div className='mb-6'>
        <h1 className='mb-1 text-xl text-secondary-black-3 font-normal'>ورود با رمز عبور</h1>
        <p className='text-sm text-secondary-2'>شماره موبایل و رمز عبور خود را وارد کنید</p>
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
          className={inputClass(!!errors.phone)}
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

      <div className='mb-6'>
        <Input
          id='password'
          type='password'
          autoComplete='current-password'
          dir='ltr'
          placeholder='رمز عبور'
          aria-label='رمز عبور'
          aria-describedby={errors.password ? 'password-error' : undefined}
          aria-invalid={!!errors.password}
          className={inputClass(!!errors.password)}
          {...register('password', {
            onChange: () => clearErrors('password'),
          })}
        />

        {errors.password && (
          <p id='password-error' role='alert' className='mt-1.5 text-right text-xs text-red-500'>
            {errors.password.message}
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
            در حال ورود...
          </span>
        ) : (
          'ورود'
        )}
      </Button>
    </form>
  );
}
