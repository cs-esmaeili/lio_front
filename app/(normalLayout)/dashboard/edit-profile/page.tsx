'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { toast } from 'sonner';
import { Edit } from 'iconsax-reactjs';

import PageHeader from '@/components/dashboard/PageHeader';
import Icon from '@/components/global/Icon';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';

import { useAuth } from '@/hooks/auth/useAuth';
import { useProfile } from '@/hooks/profile/useProfile';
import { useUpdateProfile } from '@/hooks/profile/useUpdateProfile';

import { ProfileFormSchema, emptyProfileForm, type ProfileFormValues } from '@/typescript/schemas/profile-form.schema';
import type { UpdateProfileInput } from '@/typescript/schemas/profile.schema';

function FieldWrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className='relative'>
      <label className='absolute -top-2 right-3 z-10 rounded-[8px] bg-custom-white px-2 text-[12px] font-medium text-secondary-2'>
        {label}
      </label>

      {children}

      {error && <p className='mt-1 text-xs text-custom-red'>{error}</p>}
    </div>
  );
}

export default function EditProfilePage() {
  const { profile, loading: loadingProfile } = useProfile();
  const { update, loading: updating, fieldError } = useUpdateProfile();
  const { refresh } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: standardSchemaResolver(ProfileFormSchema),
    defaultValues: emptyProfileForm,
    mode: 'onSubmit',
  });

  // Fill the form with the current profile once it loads.
  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name ?? '',
      lastName: profile.lastName ?? '',
      nationalCode: profile.nationalCode ?? '',
    });
  }, [profile, reset]);

  // Surface server-side field errors (400 details / 409 taken national code).
  useEffect(() => {
    if (!fieldError) return;

    setError(fieldError.field, { type: 'server', message: fieldError.message });
  }, [fieldError, setError]);

  const buildPayload = (data: ProfileFormValues): UpdateProfileInput => {
    const payload: UpdateProfileInput = {};
    const name = data.name.trim();
    const lastName = data.lastName.trim();
    const nationalCode = data.nationalCode.trim();

    // Only send fields that actually changed; omit empties so they stay untouched.
    if (name && name !== (profile?.name ?? '')) payload.name = name;
    if (lastName && lastName !== (profile?.lastName ?? '')) payload.lastName = lastName;
    if (nationalCode && nationalCode !== (profile?.nationalCode ?? '')) payload.nationalCode = nationalCode;

    return payload;
  };

  const onValid = async (data: ProfileFormValues) => {
    const result = await update(buildPayload(data));
    if (!result) return;

    toast.success('تغییرات با موفقیت ذخیره شد');

    reset({
      name: result.name ?? '',
      lastName: result.lastName ?? '',
      nationalCode: result.nationalCode ?? '',
    });

    // Keep the sidebar/header user info in sync.
    await refresh();
  };

  if (loadingProfile) {
    return (
      <div className='flex h-full w-full items-center justify-center py-32'>
        <Spinner className='size-10 text-primary-1' />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-gray-1 p-10 text-center'>
        <p className='text-secondary-1'>اطلاعات کاربری دریافت نشد.</p>

        <Button
          type='button'
          className='h-12 rounded-xl bg-primary-1 px-6 text-custom-white hover:bg-primary-black-1 cursor-pointer'
          onClick={() => window.location.reload()}>
          تلاش دوباره
        </Button>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col gap-4 overflow-x-hidden'>
      <div className='flex w-full flex-col gap-6 rounded-xl border-2 border-gray-1 px-6 py-6 sm:px-4'>
        <PageHeader
          titleSlot={
            <div className='inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1'>
              <Icon
                IconComponent={Edit}
                className='text-secondary-black-3'
                size={24}
                aria-hidden='true'
                variant='TwoTone'
                toneTwoColor='--color-primary-1'
              />
              <span className='text-regular text-secondary-1'>ویرایش اطلاعات کاربری</span>
            </div>
          }
        />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <FieldWrapper label='نام' error={errors.name?.message}>
            <Input
              className='h-12'
              {...register('name', {
                onChange: () => clearErrors('name'),
              })}
            />
          </FieldWrapper>

          <FieldWrapper label='نام خانوادگی' error={errors.lastName?.message}>
            <Input
              className='h-12'
              {...register('lastName', {
                onChange: () => clearErrors('lastName'),
              })}
            />
          </FieldWrapper>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <FieldWrapper label='کد ملی' error={errors.nationalCode?.message}>
            <div>
              <Input
                className='h-12'
                dir='ltr'
                inputMode='numeric'
                maxLength={10}
                {...register('nationalCode', {
                  onChange: (event) => {
                    const value = event.target.value.replace(/\D/g, '').slice(0, 10);

                    setValue('nationalCode', value, { shouldValidate: false });
                    clearErrors('nationalCode');
                  },
                })}
              />
              <span className='text-caption text-secondary-2'>کد ملی ۱۰ رقم است.</span>
            </div>
          </FieldWrapper>

          <FieldWrapper label='شماره موبایل (غیرقابل ویرایش)'>
            <Input className='h-12' dir='ltr' value={profile.username} readOnly disabled />
          </FieldWrapper>
        </div>

        <div className='flex justify-end'>
          <Button
            type='button'
            disabled={updating}
            onClick={handleSubmit(onValid)}
            className='h-12 rounded-xl bg-primary-1 px-6 text-custom-white hover:bg-primary-black-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'>
            {updating ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </div>
    </div>
  );
}
