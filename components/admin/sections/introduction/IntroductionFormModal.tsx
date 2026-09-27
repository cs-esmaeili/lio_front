'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { SelectedFile } from '@/components/admin/file-manager/file-manager.model';
import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Spinner } from '@/components/shadcn/spinner';
import { useCreateIntroduction } from '@/hooks/page-sections/useCreateIntroduction';
import { useUpdateIntroduction } from '@/hooks/page-sections/useUpdateIntroduction';
import { resolveFileUrl } from '@/utils/fileUrl';
import ImagePickerField from '../ImagePickerField';
import type { IntroductionSection } from '@/typescript/schemas/page-section.schema';

interface IntroductionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: number;
  mode: 'create' | 'edit';
  initial: IntroductionSection | null;
  onSaved: () => void;
}

interface TitleField {
  id: string;
  key: string;
  value: string;
}

let titleSequence = 0;
function nextTitleId(): string {
  titleSequence += 1;
  return `title-${titleSequence}`;
}

function toSelectedFile(id: number | null, url: string | null, name: string): SelectedFile | null {
  if (id === null) return null;
  return { id, name, path: '', url: resolveFileUrl(url) ?? '', mimeType: 'image/*' };
}

export default function IntroductionFormModal({ open, onOpenChange, sectionId, mode, initial, onSaved }: IntroductionFormModalProps) {
  const { createIntroduction, loading: creating } = useCreateIntroduction();
  const { updateIntroduction, loading: updating } = useUpdateIntroduction();
  const submitting = creating || updating;

  const [titleFields, setTitleFields] = useState<TitleField[]>(() => {
    const entries = initial ? Object.entries(initial.data.titles) : [];
    if (entries.length === 0) return [{ id: nextTitleId(), key: '', value: '' }];
    return entries.map(([key, value]) => ({ id: nextTitleId(), key, value }));
  });
  const [desktop, setDesktop] = useState<SelectedFile | null>(() =>
    initial ? toSelectedFile(initial.data.desktopFileId, initial.data.desktopFileUrl, 'تصویر دسکتاپ') : null,
  );
  const [tablet, setTablet] = useState<SelectedFile | null>(() =>
    initial ? toSelectedFile(initial.data.tabletFileId, initial.data.tabletFileUrl, 'تصویر تبلت') : null,
  );
  const [mobile, setMobile] = useState<SelectedFile | null>(() =>
    initial ? toSelectedFile(initial.data.mobileFileId, initial.data.mobileFileUrl, 'تصویر موبایل') : null,
  );
  const [sameAsDesktop, setSameAsDesktop] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------------

  const updateField = (id: string, patch: Partial<TitleField>) => {
    setTitleFields((prev) => prev.map((field) => (field.id === id ? { ...field, ...patch } : field)));
    if (error) setError(null);
  };

  const addField = () => setTitleFields((prev) => [...prev, { id: nextTitleId(), key: '', value: '' }]);

  const removeField = (id: string) => setTitleFields((prev) => prev.filter((field) => field.id !== id));

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
    if (!desktop?.id) {
      setError('تصویر دسکتاپ الزامی است.');
      return;
    }

    const titles: Record<string, string> = {};
    for (const field of titleFields) {
      const key = field.key.trim();
      if (!key) continue;
      if (key in titles) {
        setError(`کلید «${key}» تکراری است.`);
        return;
      }
      titles[key] = field.value;
    }

    const payload = {
      titles,
      desktopFileId: desktop.id,
      tabletFileId: tablet?.id ?? null,
      mobileFileId: mobile?.id ?? null,
    };

    const saved =
      mode === 'edit' ? await updateIntroduction(sectionId, payload) : await createIntroduction(sectionId, payload);
    if (!saved) return;

    toast.success(mode === 'edit' ? 'بخش معرفی ذخیره شد.' : 'بخش معرفی ایجاد شد.');
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
        {mode === 'edit' ? 'ذخیره تغییرات' : 'ایجاد بخش معرفی'}
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={mode === 'edit' ? 'ویرایش بخش معرفی' : 'ایجاد بخش معرفی'} footer={footer} size='lg'>
      <div className='flex flex-col gap-6'>
        {/* Titles */}
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-secondary-black-3'>متن‌ها</span>
            <Button type='button' variant='outline' size='sm' className='h-8 rounded-lg border-gray-2' onClick={addField}>
              <Plus />
              افزودن متن
            </Button>
          </div>

          <div className='flex flex-col gap-2'>
            {titleFields.map((field) => (
              <div key={field.id} className='flex items-center gap-2'>
                <Input
                  dir='ltr'
                  value={field.key}
                  placeholder='کلید (مثلا title)'
                  className='h-10 w-40 font-medium'
                  onChange={(event) => updateField(field.id, { key: event.target.value })}
                />
                <Input
                  value={field.value}
                  placeholder='مقدار'
                  className='h-10 flex-1'
                  onChange={(event) => updateField(field.id, { value: event.target.value })}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  className='shrink-0 text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                  title='حذف متن'
                  onClick={() => removeField(field.id)}>
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <ImagePickerField label='تصویر دسکتاپ' value={desktop} onChange={handleDesktopChange} disabled={submitting} />

        <div className='flex items-center gap-2'>
          <Checkbox id='intro-same-desktop' checked={sameAsDesktop} onCheckedChange={(checked) => handleSameAsDesktop(checked === true)} disabled={submitting} />
          <Label htmlFor='intro-same-desktop' className='cursor-pointer text-sm font-normal text-secondary-1'>
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
