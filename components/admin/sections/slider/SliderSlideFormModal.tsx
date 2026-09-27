'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import type { SelectedFile } from '@/components/admin/file-manager/file-manager.model';
import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Spinner } from '@/components/shadcn/spinner';
import { useCreateSliderSlide } from '@/hooks/page-sections/useCreateSliderSlide';
import { useUpdateSliderSlide } from '@/hooks/page-sections/useUpdateSliderSlide';
import { resolveFileUrl } from '@/utils/fileUrl';
import ImagePickerField from '../ImagePickerField';
import type { SliderSlide } from '@/typescript/schemas/page-section.schema';

interface SliderSlideFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: number;
  mode: 'create' | 'edit';
  initial: SliderSlide | null;
  onSaved: () => void;
}

function toSelectedFile(id: number, url: string | null, name: string): SelectedFile {
  return { id, name, path: '', url: resolveFileUrl(url) ?? '', mimeType: 'image/*' };
}

export default function SliderSlideFormModal({ open, onOpenChange, sectionId, mode, initial, onSaved }: SliderSlideFormModalProps) {
  const { createSlide, loading: creating } = useCreateSliderSlide();
  const { updateSlide, loading: updating } = useUpdateSliderSlide();
  const submitting = creating || updating;

  const [desktop, setDesktop] = useState<SelectedFile | null>(() =>
    initial ? toSelectedFile(initial.desktopFileId, initial.desktopFileUrl, 'تصویر دسکتاپ') : null,
  );
  const [tablet, setTablet] = useState<SelectedFile | null>(() =>
    initial ? toSelectedFile(initial.tabletFileId, initial.tabletFileUrl, 'تصویر تبلت') : null,
  );
  const [mobile, setMobile] = useState<SelectedFile | null>(() =>
    initial ? toSelectedFile(initial.mobileFileId, initial.mobileFileUrl, 'تصویر موبایل') : null,
  );
  const [sameAsDesktop, setSameAsDesktop] = useState(false);
  const [url, setUrl] = useState(initial?.url ?? '');
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------------

  const handleDesktopChange = (file: SelectedFile | null) => {
    setDesktop(file);
    if (sameAsDesktop) {
      setTablet(file);
      setMobile(file);
    }
    if (error) setError(null);
  };

  const handleSameAsDesktop = (checked: boolean) => {
    setSameAsDesktop(checked);
    if (checked && desktop) {
      setTablet(desktop);
      setMobile(desktop);
    }
  };

  const handleSubmit = async () => {
    if (!desktop?.id || !tablet?.id || !mobile?.id) {
      setError('هر سه تصویر دسکتاپ، تبلت و موبایل الزامی است.');
      return;
    }

    const payload = {
      desktopFileId: desktop.id,
      tabletFileId: tablet.id,
      mobileFileId: mobile.id,
      url: url.trim() || null,
    };

    const saved =
      mode === 'edit' && initial ? await updateSlide(sectionId, { id: initial.id, ...payload }) : await createSlide(sectionId, payload);
    if (!saved) return;

    toast.success(mode === 'edit' ? 'اسلاید ذخیره شد.' : 'اسلاید ایجاد شد.');
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
        {mode === 'edit' ? 'ذخیره تغییرات' : 'افزودن اسلاید'}
      </Button>
    </div>
  );

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === 'edit' ? 'ویرایش اسلاید' : 'افزودن اسلاید'}
      footer={footer}
      size='lg'>
      <div className='flex flex-col gap-6'>
        <ImagePickerField label='تصویر دسکتاپ' value={desktop} onChange={handleDesktopChange} disabled={submitting} />

        <div className='flex items-center gap-2'>
          <Checkbox id='slider-same-desktop' checked={sameAsDesktop} onCheckedChange={(checked) => handleSameAsDesktop(checked === true)} disabled={submitting} />
          <Label htmlFor='slider-same-desktop' className='cursor-pointer text-sm font-normal text-secondary-1'>
            استفاده از تصویر دسکتاپ برای تبلت و موبایل
          </Label>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <ImagePickerField label='تصویر تبلت' value={tablet} onChange={setTablet} disabled={submitting || sameAsDesktop} />
          <ImagePickerField label='تصویر موبایل' value={mobile} onChange={setMobile} disabled={submitting || sameAsDesktop} />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm text-secondary-1'>لینک اسلاید</label>
          <Input dir='ltr' value={url} placeholder='/products/sale' className='h-11' onChange={(event) => setUrl(event.target.value)} />
          <p className='text-caption text-secondary-3'>مسیر نسبی؛ مثلا <span dir='ltr'>/product/slug</span>.</p>
        </div>

        {error && <p className='text-sm text-custom-red'>{error}</p>}
      </div>
    </ReusableModal>
  );
}
