'use client';

import { useState } from 'react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { resolveFileUrl } from '@/utils/fileUrl';
import type { ContactSocial } from '@/typescript/schemas/page-section.schema';

interface SocialFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initial: ContactSocial | null;
  submitting?: boolean;
  onSubmit: (social: ContactSocial) => void;
}

const SOCIAL_KEY_SUGGESTIONS = ['instagram', 'telegram', 'whatsapp', 'twitter', 'linkedin', 'youtube', 'aparat', 'github'];

export default function SocialFormModal({ open, onOpenChange, mode, initial, submitting = false, onSubmit }: SocialFormModalProps) {
  const [key, setKey] = useState(initial?.key ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [image, setImage] = useState(initial?.image ?? '');
  const [fullUrl, setFullUrl] = useState(initial?.fullUrl ?? '');
  const [error, setError] = useState<string | null>(null);

  const preview = resolveFileUrl(image.trim() || null);

  // --------------------------------------------------------

  const handleSubmit = () => {
    const normalizedKey = key.trim();
    const normalizedUrl = fullUrl.trim();

    if (!normalizedKey) {
      setError('کلید شبکهٔ اجتماعی الزامی است.');
      return;
    }
    if (!normalizedUrl) {
      setError('لینک الزامی است.');
      return;
    }

    onSubmit({ key: normalizedKey, title: title.trim() || normalizedKey, image: image.trim(), fullUrl: normalizedUrl });
    onOpenChange(false);
  };

  // --------------------------------------------------------

  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={submitting} onClick={() => onOpenChange(false)}>
        انصراف
      </Button>

      <Button type='button' className='h-11 rounded-xl px-6' disabled={submitting} onClick={handleSubmit}>
        {mode === 'edit' ? 'ذخیره' : 'افزودن'}
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={mode === 'edit' ? 'ویرایش شبکهٔ اجتماعی' : 'افزودن شبکهٔ اجتماعی'} footer={footer} size='md'>
      <div className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='social-key' className='text-sm text-secondary-1'>
              کلید
            </Label>
            <Input
              id='social-key'
              dir='ltr'
              list='social-key-suggestions'
              value={key}
              placeholder='instagram'
              className='h-11 font-medium'
              onChange={(event) => {
                setKey(event.target.value);
                if (error) setError(null);
              }}
            />
            <datalist id='social-key-suggestions'>
              {SOCIAL_KEY_SUGGESTIONS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='social-title' className='text-sm text-secondary-1'>
              عنوان نمایشی
            </Label>
            <Input
              id='social-title'
              value={title}
              placeholder='اینستاگرام'
              className='h-11'
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='social-url' className='text-sm text-secondary-1'>
            لینک
          </Label>
          <Input
            id='social-url'
            dir='ltr'
            value={fullUrl}
            placeholder='https://instagram.com/...'
            className='h-11'
            onChange={(event) => {
              setFullUrl(event.target.value);
              if (error) setError(null);
            }}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='social-image' className='text-sm text-secondary-1'>
            آدرس آیکون (اختیاری)
          </Label>
          <div className='flex items-center gap-3'>
            <div className='grid size-12 shrink-0 place-content-center overflow-hidden rounded-lg border border-gray-2 bg-gray-1'>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt='preview' className='h-full w-full object-contain' />
              ) : null}
            </div>
            <Input
              id='social-image'
              dir='ltr'
              value={image}
              placeholder='/uploads/statics/instagram.svg'
              className='h-11 flex-1'
              onChange={(event) => {
                setImage(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>
          <p className='text-caption text-secondary-3'>مسیر نسبی یا URL کامل آیکون.</p>
        </div>

        {error && <p className='text-sm text-custom-red'>{error}</p>}
      </div>
    </ReusableModal>
  );
}
