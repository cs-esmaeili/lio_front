'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Spinner } from '@/components/shadcn/spinner';
import { Textarea } from '@/components/shadcn/textarea';
import { useCreateContact } from '@/hooks/page-sections/useCreateContact';
import { useUpdateContact } from '@/hooks/page-sections/useUpdateContact';
import type { ContactInput, ContactSection } from '@/typescript/schemas/page-section.schema';

interface ContactFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: number;
  mode: 'create' | 'edit';
  initial: ContactSection | null;
  onSaved: () => void;
}

export default function ContactFormModal({ open, onOpenChange, sectionId, mode, initial, onSaved }: ContactFormModalProps) {
  const { createContact, loading: creating } = useCreateContact();
  const { updateContact, loading: updating } = useUpdateContact();
  const submitting = creating || updating;

  const [address, setAddress] = useState(initial?.data.address ?? '');
  const [email, setEmail] = useState(initial?.data.email ?? '');
  const [supportHour, setSupportHour] = useState(initial?.data.supportHour ?? '');
  const [mapLat, setMapLat] = useState(initial?.data.mapLat != null ? String(initial.data.mapLat) : '');
  const [mapLng, setMapLng] = useState(initial?.data.mapLng != null ? String(initial.data.mapLng) : '');
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------------

  const handleSubmit = async () => {
    const lat = mapLat.trim() === '' ? null : Number(mapLat);
    const lng = mapLng.trim() === '' ? null : Number(mapLng);

    if (lat !== null && Number.isNaN(lat)) {
      setError('عرض جغرافیایی (lat) معتبر نیست.');
      return;
    }
    if (lng !== null && Number.isNaN(lng)) {
      setError('طول جغرافیایی (lng) معتبر نیست.');
      return;
    }

    const payload: ContactInput = {
      address: address.trim() || null,
      email: email.trim() || null,
      supportHour: supportHour.trim() || null,
      mapLat: lat,
      mapLng: lng,
    };

    const saved = mode === 'edit' ? await updateContact(sectionId, payload) : await createContact(sectionId, payload);
    if (!saved) return;

    toast.success(mode === 'edit' ? 'اطلاعات تماس ذخیره شد.' : 'اطلاعات تماس ایجاد شد.');
    onSaved();
    onOpenChange(false);
  };

  // --------------------------------------------------------

  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={submitting} onClick={() => onOpenChange(false)}>
        انصراف
      </Button>

      <Button type='button' className='h-11 rounded-xl px-6' disabled={submitting} onClick={() => void handleSubmit()}>
        {submitting && <Spinner />}
        {mode === 'edit' ? 'ذخیره تغییرات' : 'ایجاد اطلاعات تماس'}
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={mode === 'edit' ? 'ویرایش اطلاعات تماس' : 'ایجاد اطلاعات تماس'} footer={footer} size='lg'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='contact-address' className='text-sm text-secondary-1'>
            آدرس
          </Label>
          <Textarea
            id='contact-address'
            rows={2}
            value={address}
            placeholder='مثلا اصفهان، خیابان ...'
            className='resize-y'
            onChange={(event) => {
              setAddress(event.target.value);
              if (error) setError(null);
            }}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='contact-email' className='text-sm text-secondary-1'>
              ایمیل
            </Label>
            <Input
              id='contact-email'
              dir='ltr'
              type='email'
              value={email}
              placeholder='info@example.com'
              className='h-11'
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='contact-hour' className='text-sm text-secondary-1'>
              ساعت کاری پشتیبانی
            </Label>
            <Input
              id='contact-hour'
              value={supportHour}
              placeholder='شنبه تا چهارشنبه ۹ تا ۱۸'
              className='h-11'
              onChange={(event) => {
                setSupportHour(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='contact-lat' className='text-sm text-secondary-1'>
              عرض جغرافیایی (lat)
            </Label>
            <Input
              id='contact-lat'
              dir='ltr'
              type='number'
              step='any'
              value={mapLat}
              placeholder='32.655599'
              className='h-11'
              onChange={(event) => {
                setMapLat(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='contact-lng' className='text-sm text-secondary-1'>
              طول جغرافیایی (lng)
            </Label>
            <Input
              id='contact-lng'
              dir='ltr'
              type='number'
              step='any'
              value={mapLng}
              placeholder='51.699845'
              className='h-11'
              onChange={(event) => {
                setMapLng(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>
        </div>

        <p className='text-caption text-secondary-3'>مختصات برای نمایش موقعیت روی نقشهٔ صفحهٔ «تماس با ما» استفاده می‌شود.</p>

        {error && <p className='text-sm text-custom-red'>{error}</p>}
      </div>
    </ReusableModal>
  );
}
