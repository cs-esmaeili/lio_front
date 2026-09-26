'use client';

import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { toast } from 'sonner';

import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import ReusableModal from '@/components/global/Modal/ReusableModal';

import { useLocations } from '@/hooks/address/useLocations';
import { useAddAddress } from '@/hooks/address/useAddAddress';
import { useEditAddress } from '@/hooks/address/useEditAddress';

import type { Address } from '@/components/dashboard/address/address.model';
import { AddressFormSchema, emptyAddressForm, type AddressFormValues } from '@/typescript/schemas/address-form.schema';
import { type AddressAddPayload, type AddressEditPayload } from '@/services/address.service';

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData: Address | null;
  onSuccess?: (newAddressId?: number) => void;
}

const toDefaults = (initial: Address | null): AddressFormValues => {
  if (!initial) return { ...emptyAddressForm };

  return {
    id: initial.id,
    title: initial.title,
    address: initial.address,
    postalCode: initial.postalCode,
    province: initial.province,
    locationId: initial.locationId,
    isMain: initial.isMain,
  };
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

  const province = useWatch({ control, name: 'province' });

  const { locations, provinces, loading: loadingLocations } = useLocations(open);

  const cities = useMemo(
    () => locations.filter((location) => location.province === province),
    [locations, province],
  );

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

  const buildPayload = (data: AddressFormValues): AddressAddPayload => ({
    title: data.title,
    address: data.address,
    postalCode: data.postalCode,
    locationId: data.locationId,
    isMain: data.isMain,
  });

  const onValid = async (data: AddressFormValues) => {
    if (mode === 'create') {
      const created = await addAddress(buildPayload(data));
      if (!created) return;

      toast.success('آدرس با موفقیت ثبت شد');
      onSuccess?.(Number(created.id));
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

      const updated = await editAddress(payload);
      if (!updated) return;

      toast.success('آدرس با موفقیت ویرایش شد');
      onSuccess?.();
    }

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
          {/* Title */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>عنوان آدرس</label>

            <Input className='h-12' placeholder='مثلا منزل، محل کار' {...register('title')} />

            {errors.title && <p className='text-xs text-red-500'>{errors.title.message}</p>}
          </div>

          {/* Province & City */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-secondary-1'>استان</label>

              <Controller
                control={control}
                name='province'
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue('locationId', 0, { shouldValidate: false });
                    }}
                    disabled={loadingLocations}>
                    <SelectTrigger className='!h-12 w-full rounded-md border border-input px-3' dir='rtl'>
                      <SelectValue placeholder={loadingLocations ? 'در حال بارگذاری...' : 'انتخاب استان'} />
                    </SelectTrigger>

                    <SelectContent position='popper' dir='rtl' className='z-50 max-h-64'>
                      {provinces.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.province && <p className='text-xs text-red-500'>{errors.province.message}</p>}
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm text-secondary-1'>شهر</label>

              <Controller
                control={control}
                name='locationId'
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={!province || loadingLocations}>
                    <SelectTrigger className='!h-12 w-full rounded-md border border-input px-3' dir='rtl'>
                      <SelectValue placeholder={!province ? 'ابتدا استان را انتخاب کنید' : 'انتخاب شهر'} />
                    </SelectTrigger>

                    <SelectContent position='popper' dir='rtl' className='z-50 max-h-64'>
                      {cities.map((location) => (
                        <SelectItem key={location.id} value={String(location.id)}>
                          {location.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.locationId && <p className='text-xs text-red-500'>{errors.locationId.message}</p>}
            </div>
          </div>

          {/* Address */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>نشانی دقیق</label>

            <Textarea
              rows={4}
              placeholder='خیابان، کوچه، پلاک و واحد را وارد کنید...'
              className='resize-none'
              {...register('address')}
            />

            {errors.address && <p className='text-xs text-red-500'>{errors.address.message}</p>}
          </div>

          {/* PostalCode */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>کد پستی</label>

            <Input className='h-12' placeholder='کد پستی' inputMode='numeric' maxLength={10} {...register('postalCode')} />

            {errors.postalCode && <p className='text-xs text-red-500'>{errors.postalCode.message}</p>}
          </div>

          {/* Is Main */}
          <Controller
            control={control}
            name='isMain'
            render={({ field }) => (
              <div className='flex items-center gap-2'>
                <Checkbox id='address-is-main' checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />

                <Label htmlFor='address-is-main' className='text-sm font-normal text-secondary-1 cursor-pointer'>
                  این آدرس به عنوان آدرس پیش‌فرض انتخاب شود
                </Label>
              </div>
            )}
          />
        </div>
      </ReusableModal>
    </FormProvider>
  );
}
