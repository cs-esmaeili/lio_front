'use client';

import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { toast } from 'sonner';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import ReusableModal from '@/components/global/Modal/ReusableModal';

import { useProvinces } from '@/hooks/address/useProvinces';
import { useCities } from '@/hooks/address/useCities';
import { useAddAddress } from '@/hooks/address/useAddAddress';
import { useEditAddress } from '@/hooks/address/useEditAddress';

import type { Address } from '@/components/dashboard/address/address.model';
import { initialAddress } from '@/components/dashboard/address/address.model';
import { AddressFormSchema, type AddressFormValues } from '@/typescript/schemas/address-form.schema';
import { type AddressAddPayload, type AddressEditPayload, extractAddressId } from '@/services/address.service';

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData: Address | null;
  onSuccess?: (newAddressId?: number) => void;
}

const toNumber = (v: number | string | undefined): number | undefined => {
  if (v === undefined || v === null || v === '') return undefined;
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
};

const toDefaults = (initial: Address | null): AddressFormValues => {
  const src = initial ?? initialAddress;

  return {
    id: src.id,
    lat: toNumber(src.lat),
    lng: toNumber(src.lng),
    place_id: toNumber(src.place_id),
    province_id: toNumber(src.province_id),
    name_family: (src as any).name_family ?? '',
    province: src.province ?? '',
    city: src.city ?? '',
    title: src.title ?? '',
    postalCode: src.postalCode ?? '',
    address: src.address ?? '',
    receiverType: (src.receiverType ?? 'self') as 'self' | 'other',
    receiverName: src.receiverName ?? '',
    receiverPhone: src.receiverPhone ?? '',
  } as AddressFormValues;
};

export default function AddressModal({ open, onOpenChange, mode, initialData, onSuccess }: AddressModalProps) {
  const { addAddress, loading: adding } = useAddAddress();
  const { editAddress, loading: editing } = useEditAddress();
  const submitting = adding || editing;

  const methods = useForm<AddressFormValues>({
    resolver: standardSchemaResolver(AddressFormSchema),
    defaultValues: toDefaults(initialData),
    mode: 'onSubmit',
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const provinceId = useWatch({ control, name: 'province_id' });
  const receiverType = useWatch({ control, name: 'receiverType' });

  const { provinces, loading: loadingProvinces } = useProvinces();
  const { cities, loading: loadingCities } = useCities(provinceId);

  // --------------------------------------------------------

  useEffect(() => {
    if (!open) return;
    reset(toDefaults(mode === 'edit' ? initialData : null));
  }, [open, mode, initialData, reset]);

  // --------------------------------------------------------

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);
    if (!value) {
      reset(toDefaults(null));
    }
  };

  // --------------------------------------------------------

  const buildPayload = (data: AddressFormValues): AddressAddPayload => {
    const isSelf = data.receiverType === 'self';

    const base: AddressAddPayload = {
      lat: data.lat ?? 0,
      lng: data.lng ?? 0,
      place_id: data.place_id ?? 0,
      province_id: data.province_id ?? 0,
      title: data.title,
      postal_code: data.postalCode,
      value: data.address,
      is_default_recipient: isSelf ? '1' : '0',
      recipient_mobile: isSelf ? '' : data.receiverPhone,
      name_family: data.name_family,
    };

    if (!isSelf) {
      base.recipient_name = data.receiverName;
    }

    return base;
  };

  const onValid = async (data: AddressFormValues) => {
    let result: unknown = null;

    if (mode === 'create') {
      result = await addAddress(buildPayload(data));
      if (result) toast.success('آدرس با موفقیت ثبت شد');
    } else {
      const address_id = Number(data.id);

      if (!Number.isFinite(address_id) || address_id <= 0) {
        toast.error('شناسه آدرس نامعتبر است');
        return;
      }

      const payload: AddressEditPayload = {
        ...buildPayload(data),
        address_id,
      };

      result = await editAddress(payload);
      if (result) toast.success('آدرس با موفقیت ویرایش شد');
    }

    if (!result) return;

    onSuccess?.(mode === 'create' ? extractAddressId(result) : undefined);
    reset(toDefaults(null));
    onOpenChange(false);
  };

  // --------------------------------------------------------

  const title = useMemo(() => {
    return mode === 'create' ? 'ثبت آدرس جدید' : 'ویرایش آدرس';
  }, [mode]);

  // --------------------------------------------------------

  const footer = (
    <div className='flex flex-row items-center justify-between gap-3'>
      <Button
        type='button'
        className='basis-1/3 h-12 rounded-xl bg-white hover:bg-white text-primary-1 hover:text-primary-1 border border-primary-1 cursor-pointer'
        variant='outline'
        disabled={submitting}
        onClick={() => onOpenChange(false)}>
        انصراف
      </Button>

      <Button
        type='button'
        className='basis-2/3 h-12 rounded-xl bg-primary-1 hover:bg-primary-black-1 text-white border border-primary-1 cursor-pointer'
        disabled={submitting}
        onClick={handleSubmit(onValid)}>
        {submitting ? 'در حال ارسال...' : mode === 'create' ? 'ثبت آدرس' : 'ذخیره تغییرات'}
      </Button>
    </div>
  );

  // --------------------------------------------------------

  const formKey = `${mode}-${initialData?.id ?? 'new'}-${open}`;

  return (
    <FormProvider {...methods}>
      <ReusableModal open={open} onOpenChange={handleOpenChange} title={title} footer={footer} size='lg'>
        <div key={formKey} className='flex flex-col gap-6'>
          {/* Name Family */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>نام و نام خانوادگی</label>

            <Input className='h-12' placeholder='نام و نام خانوادگی خود را وارد کنید' {...register('name_family')} />

            {errors.name_family && <p className='text-xs text-red-500'>{errors.name_family.message}</p>}
          </div>

          {/* Province & City */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-secondary-1'>استان</label>

              <Controller
                control={control}
                name='province_id'
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => {
                      const id = Number(val);
                      const selected = provinces.find((p) => p.id === id);
                      field.onChange(id);
                      setValue('province', selected?.title ?? '', { shouldValidate: false });
                      setValue('place_id', undefined as unknown as number, { shouldValidate: false });
                      setValue('city', '', { shouldValidate: false });
                    }}
                    disabled={loadingProvinces}>
                    <SelectTrigger className='!h-12 w-full rounded-md border border-input px-3' dir='rtl'>
                      <SelectValue placeholder={loadingProvinces ? 'در حال بارگذاری...' : 'انتخاب استان'} />
                    </SelectTrigger>

                    <SelectContent position='popper' dir='rtl' className='z-50 max-h-64'>
                      {provinces.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.province_id && <p className='text-xs text-red-500'>{errors.province_id.message}</p>}
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm text-secondary-1'>شهر</label>

              <Controller
                control={control}
                name='place_id'
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => {
                      const id = Number(val);
                      const selected = cities.find((c) => c.id === id);
                      field.onChange(id);
                      setValue('city', selected?.title ?? '', { shouldValidate: false });
                    }}
                    disabled={!provinceId || loadingCities}>
                    <SelectTrigger className='!h-12 w-full rounded-md border border-input px-3' dir='rtl'>
                      <SelectValue placeholder={!provinceId ? 'ابتدا استان را انتخاب کنید' : loadingCities ? 'در حال بارگذاری...' : 'انتخاب شهر'} />
                    </SelectTrigger>

                    <SelectContent position='popper' dir='rtl' className='z-50 max-h-64'>
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.place_id && <p className='text-xs text-red-500'>{errors.place_id.message}</p>}
            </div>
          </div>

          {/* Title */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>عنوان آدرس</label>

            <Input className='h-12' placeholder='مثلا منزل، محل کار' {...register('title')} />

            {errors.title && <p className='text-xs text-red-500'>{errors.title.message}</p>}
          </div>

          {/* Address */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>آدرس پستی کامل</label>

            <Textarea rows={4} placeholder='آدرس کامل خود را وارد کنید...' className='resize-none' {...register('address')} />

            {errors.address && <p className='text-xs text-red-500'>{errors.address.message}</p>}
          </div>

          {/* PostalCode */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>کد پستی</label>

            <Input className='h-12' placeholder='کد پستی' inputMode='numeric' {...register('postalCode')} />

            {errors.postalCode && <p className='text-xs text-red-500'>{errors.postalCode.message}</p>}
          </div>

          {/* Receiver Type */}
          <div className='flex flex-col gap-5'>
            <h6 className='text-sm font-normal text-secondary-1'>سفارش‌های این آدرس را چه کسی تحویل می‌گیرد؟</h6>

            <Controller
              control={control}
              name='receiverType'
              render={({ field }) => (
                <RadioGroup
                  dir='rtl'
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as 'self' | 'other')}
                  className='flex flex-col gap-4'>
                  <div className='flex items-center justify-start gap-2'>
                    <RadioGroupItem value='self' id='receiver-self' />
                    <Label htmlFor='receiver-self' className='text-sm font-normal text-secondary-1 cursor-pointer'>
                      تحویل به خودم
                    </Label>
                  </div>

                  <div className='flex items-center justify-start gap-2'>
                    <RadioGroupItem value='other' id='receiver-other' />
                    <Label htmlFor='receiver-other' className='text-sm font-normal text-secondary-1 cursor-pointer'>
                      تحویل به شخص دیگر
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* Receiver Info (conditional) */}
          {receiverType === 'other' && (
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex flex-1 flex-col gap-2'>
                <Label className='text-sm font-normal text-secondary-1'>نام و نام خانوادگی گیرنده</Label>

                <Input className='h-12' placeholder='نام و نام خانوادگی' {...register('receiverName')} />

                {errors.receiverName && <p className='text-xs text-red-500'>{errors.receiverName.message}</p>}
              </div>

              <div className='flex flex-1 flex-col gap-2'>
                <Label className='text-sm font-normal text-secondary-1'>شماره تماس گیرنده</Label>

                <Input className='h-12' placeholder='0912...' inputMode='numeric' {...register('receiverPhone')} />

                {errors.receiverPhone && <p className='text-xs text-red-500'>{errors.receiverPhone.message}</p>}
              </div>
            </div>
          )}
        </div>
      </ReusableModal>
    </FormProvider>
  );
}
