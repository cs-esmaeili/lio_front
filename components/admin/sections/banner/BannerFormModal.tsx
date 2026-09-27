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
import { useCreateBanner } from '@/hooks/page-sections/useCreateBanner';
import { useUpdateBanner } from '@/hooks/page-sections/useUpdateBanner';
import { resolveFileUrl } from '@/utils/fileUrl';
import ImagePickerField from '../ImagePickerField';
import type { BannerItem } from '@/typescript/schemas/page-section.schema';

interface BannerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: number;
  mode: 'create' | 'edit';
  initial: BannerItem | null;
  onSaved: () => void;
}

function toSelectedFile(id: number, url: string | null, name: string): SelectedFile {
  return { id, name, path: '', url: resolveFileUrl(url) ?? '', mimeType: 'image/*' };
}

export default function BannerFormModal({ open, onOpenChange, sectionId, mode, initial, onSaved }: BannerFormModalProps) {
  const { createBanner, loading: creating } = useCreateBanner();
  const { updateBanner, loading: updating } = useUpdateBanner();
  const submitting = creating || updating;

  const [title, setTitle] = useState(initial?.title ?? '');
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? '');
  const [buttonTitle, setButtonTitle] = useState(initial?.buttonTitle ?? '');
  const [buttonUrl, setButtonUrl] = useState(initial?.buttonUrl ?? '');
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
    if (!title.trim()) {
      setError('عنوان بنر الزامی است.');
      return;
    }
    if (!desktop?.id || !tablet?.id || !mobile?.id) {
      setError('هر سه تصویر دسکتاپ، تبلت و موبایل الزامی است.');
      return;
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      buttonTitle: buttonTitle.trim() || null,
      buttonUrl: buttonUrl.trim() || null,
      desktopFileId: desktop.id,
      tabletFileId: tablet.id,
      mobileFileId: mobile.id,
    };

    const saved =
      mode === 'edit' && initial ? await updateBanner(sectionId, { id: initial.id, ...payload }) : await createBanner(sectionId, payload);
    if (!saved) return;

    toast.success(mode === 'edit' ? 'بنر ذخیره شد.' : 'بنر ایجاد شد.');
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
        {mode === 'edit' ? 'ذخیره تغییرات' : 'افزودن بنر'}
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={mode === 'edit' ? 'ویرایش بنر' : 'افزودن بنر'} footer={footer} size='lg'>
      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>عنوان</label>
            <Input value={title} placeholder='مثلا پیشنهاد ویژه' className='h-11' onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>زیرعنوان</label>
            <Input value={subtitle ?? ''} placeholder='تا ۵۰٪ تخفیف' className='h-11' onChange={(event) => setSubtitle(event.target.value)} />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>متن دکمه</label>
            <Input value={buttonTitle ?? ''} placeholder='خرید' className='h-11' onChange={(event) => setButtonTitle(event.target.value)} />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm text-secondary-1'>لینک دکمه</label>
            <Input dir='ltr' value={buttonUrl ?? ''} placeholder='/products/sale' className='h-11' onChange={(event) => setButtonUrl(event.target.value)} />
          </div>
        </div>

        <ImagePickerField label='تصویر دسکتاپ' value={desktop} onChange={handleDesktopChange} disabled={submitting} />

        <div className='flex items-center gap-2'>
          <Checkbox id='banner-same-desktop' checked={sameAsDesktop} onCheckedChange={(checked) => handleSameAsDesktop(checked === true)} disabled={submitting} />
          <Label htmlFor='banner-same-desktop' className='cursor-pointer text-sm font-normal text-secondary-1'>
            استفاده از تصویر دسکتاپ برای تبلت و موبایل
          </Label>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <ImagePickerField label='تصویر تبلت' value={tablet} onChange={setTablet} disabled={submitting || sameAsDesktop} />
          <ImagePickerField label='تصویر موبایل' value={mobile} onChange={setMobile} disabled={submitting || sameAsDesktop} />
        </div>

        {error && <p className='text-sm text-custom-red'>{error}</p>}
      </div>
    </ReusableModal>
  );
}
