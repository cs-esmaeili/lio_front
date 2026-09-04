'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Edit, Sms } from 'iconsax-reactjs';

import PageHeader from '@/components/dashboard/PageHeader';
import Icon from '@/components/global/Icon';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';

import { usePersonalInfo } from '@/hooks/dashboard/usePersonalInfo';
import { useUpdateProfile } from '@/hooks/dashboard/useUpdateProfile';

import PhoneUpdateModal from '@/components/dashboard/edit-profile/PhoneUpdateModal';
import { EditProfileFormSchema, type EditProfileFormValues } from '@/typescript/schemas/edit-profile-form.schema';

function SectionCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 rounded-xl border-2 border-gray-1 p-4 sm:p-6 ${className}`}>
      <h6 className='text-regular font-medium text-secondary-1 border-b border-primary-1 pb-1 w-fit'>{title}</h6>
      {children}
    </div>
  );
}

function FieldWrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className='relative'>
      <label className='absolute -top-2 right-3 z-10 rounded-[8px] bg-white px-2 text-[12px] font-medium text-secondary-2'>
        {label}
      </label>

      {children}

      {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
    </div>
  );
}

export default function EditProfilePage() {
  const { personal, loading: loadingInfo } = usePersonalInfo();
  const { update, loading: updating } = useUpdateProfile();

  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: standardSchemaResolver(EditProfileFormSchema),
    defaultValues: {
      name: '',
      last_name: '',
      national_code: '',
      email: '',
      password: '',
      password_confirmation: '',
      birth_year: '',
      birth_month: '',
      birth_day: '',
    },
  });

  // Password
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    if (!personal) return;

    const user = personal.user ?? {};
    const bday = user.birthday;

    setValue('name', user.first_name ?? '');
    setValue('last_name', user.last_name ?? '');
    setValue('national_code', user.national_code ?? '');
    setValue('email', user.email ?? '');

    setValue('birth_year', String(bday?.birth_year ?? ''));
    setValue('birth_month', String(bday?.birth_month ?? ''));
    setValue('birth_day', String(bday?.birth_day ?? ''));
  }, [personal, setValue]);

  const handlePhoneSuccess = () => {
    setPhoneModalOpen(false);
    // Sidebar will refresh on next render
  };

  const onSubmit = async (data: EditProfileFormValues) => {
    const payload = Object.fromEntries(
      Object.entries({
        name: data.name,
        last_name: data.last_name,
        national_code: data.national_code,
        email: data.email,
        birth_year: data.birth_year,
        birth_month: data.birth_month,
        birth_day: data.birth_day,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }).filter(([, value]) => value)
    );

    const success = await update(payload);

    if (success) {
      setValue('password', '');
      setValue('password_confirmation', '');
    }
  };

  if (loadingInfo) {
    return (
      <div className='flex h-full w-full items-center justify-center py-32'>
        <Spinner className='size-10 text-primary-1' />
      </div>
    );
  }

  const user = personal?.user ?? {};
  const currentPhone = user.mobile ?? '';

  return (
    <div className='flex flex-col gap-4 h-full w-full overflow-x-hidden'>
      {/* Page Header */}
      <div className='flex flex-col gap-6 rounded-xl border-gray-1 border-2 w-full px-6 sm:px-4 py-6'>
        <PageHeader
          titleSlot={
            <div className='inline-flex items-center gap-2 pb-1 pl-1 border-b border-primary-1'>
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

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <FieldWrapper label='نام' error={errors.name?.message}>
            <Input
              className='h-12'
              {...register('name', {
                onChange: () => clearErrors('name'),
              })}
            />
          </FieldWrapper>

          <FieldWrapper label='نام خانوادگی' error={errors.last_name?.message}>
            <Input
              className='h-12'
              {...register('last_name', {
                onChange: () => clearErrors('last_name'),
              })}
            />
          </FieldWrapper>

          <FieldWrapper label='کد ملی' error={errors.national_code?.message}>
            <div>
              <Input
                className='h-12'
                inputMode='numeric'
                maxLength={10}
                {...register('national_code', {
                  onChange: (e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);

                    setValue('national_code', value, {
                      shouldValidate: false,
                    });

                    clearErrors('national_code');
                  },
                })}
              />
              <span className='text-caption text-secondary-2'>کد ملی 10 رقم است.</span>
            </div>
          </FieldWrapper>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <FieldWrapper label='آدرس ایمیل' error={errors.email?.message}>
            <Input
              className='h-12'
              placeholder='example@domain.com'
              type='email'
              dir='ltr'
              {...register('email', {
                onChange: () => clearErrors('email'),
              })}
            />
          </FieldWrapper>
          {user.has_password && (
            <FieldWrapper label='رمز عبور فعلی'>
              <Input
                className='h-12'
                type='password'
                dir='ltr'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </FieldWrapper>
          )}

          <FieldWrapper label='رمز عبور جدید' error={errors.password?.message}>
            <div>
              <Input
                className='h-12'
                type='password'
                dir='ltr'
                {...register('password', {
                  onChange: () => clearErrors('password'),
                })}
              />
              <span className='text-caption text-secondary-2'> حداقل 8 کاراکتر</span>
            </div>
          </FieldWrapper>

          <FieldWrapper label='تکرار رمز عبور جدید' error={errors.password_confirmation?.message}>
            <Input
              className='h-12'
              type='password'
              dir='ltr'
              {...register('password_confirmation', {
                onChange: () => clearErrors('password_confirmation'),
              })}
            />
          </FieldWrapper>
        </div>

        <div className='grid grid-cols-3 sm:grid-cols-3 gap-4'>
          <FieldWrapper label='سال' error={errors.birth_year?.message}>
            <Input
              className='h-12'
              placeholder='۱۳۷۰'
              inputMode='numeric'
              maxLength={4}
              {...register('birth_year', {
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);

                  setValue('birth_year', value, {
                    shouldValidate: false,
                  });

                  clearErrors('birth_year');
                },
              })}
            />
          </FieldWrapper>

          <FieldWrapper label='ماه' error={errors.birth_month?.message}>
            <Input
              className='h-12'
              placeholder='۰۱'
              inputMode='numeric'
              maxLength={2}
              {...register('birth_month', {
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 2);

                  setValue('birth_month', value, {
                    shouldValidate: false,
                  });

                  clearErrors('birth_month');
                },
              })}
            />
          </FieldWrapper>

          <FieldWrapper label='روز' error={errors.birth_day?.message}>
            <Input
              className='h-12'
              placeholder='۰۱'
              inputMode='numeric'
              maxLength={2}
              {...register('birth_day', {
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 2);

                  setValue('birth_day', value, {
                    shouldValidate: false,
                  });

                  clearErrors('birth_day');
                },
              })}
            />
          </FieldWrapper>
        </div>

        <div className='flex justify-end'>
          <Button
            type='button'
            disabled={updating}
            onClick={handleSubmit(onSubmit)}
            className='h-12 px-6 rounded-xl bg-primary-1 hover:bg-primary-black-1 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'>
            {updating ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </div>

      {/* ── Section: Phone Number ── */}
      {/* <SectionCard title='شماره موبایل'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <Icon IconComponent={Sms} className='text-secondary-black-3' size={24} variant='TwoTone' toneTwoColor='--color-primary-1' />
            <div className='flex flex-col gap-1'>
              <span className='text-sm text-secondary-2'>شماره موبایل فعلی</span>
              <span className='text-regular font-medium text-secondary-1' dir='ltr' style={{ direction: 'ltr' }}>
                {currentPhone || '---'}
              </span>
            </div>
          </div>

          <Button
            type='button'
            className='h-12 px-6 rounded-xl bg-primary-1 hover:bg-primary-black-1 text-white cursor-pointer'
            onClick={() => setPhoneModalOpen(true)}>
            تغییر شماره موبایل
          </Button>
        </div>
      </SectionCard> */}

      {/* ── Phone Update Modal ── */}
      <PhoneUpdateModal open={phoneModalOpen} onOpenChange={setPhoneModalOpen} currentPhone={currentPhone} onSuccess={handlePhoneSuccess} />
    </div>
  );
}
