'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { SelectedFile } from '@/components/admin/file-manager/file-manager.model';
import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Spinner } from '@/components/shadcn/spinner';
import { Textarea } from '@/components/shadcn/textarea';
import { useCreateAbout } from '@/hooks/page-sections/useCreateAbout';
import { useUpdateAbout } from '@/hooks/page-sections/useUpdateAbout';
import ImagePickerField from '../ImagePickerField';
import type { AboutInput, AboutSection } from '@/typescript/schemas/page-section.schema';

interface AboutFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: number;
  mode: 'create' | 'edit';
  initial: AboutSection | null;
  onSaved: () => void;
}

interface StatisticField {
  id: string;
  title: string;
  description: string;
  number: string;
}

let statisticSequence = 0;
function nextStatisticId(): string {
  statisticSequence += 1;
  return `stat-${statisticSequence}`;
}

function toSelectedFile(id: number | null, url: string | null, name: string): SelectedFile | null {
  if (id === null) return null;
  return { id, name, path: '', url: url ?? '', mimeType: 'image/*' };
}

export default function AboutFormModal({ open, onOpenChange, sectionId, mode, initial, onSaved }: AboutFormModalProps) {
  const { createAbout, loading: creating } = useCreateAbout();
  const { updateAbout, loading: updating } = useUpdateAbout();
  const submitting = creating || updating;

  const [headerTitle, setHeaderTitle] = useState(initial?.data.headerTitle ?? '');
  const [headerDescription, setHeaderDescription] = useState(initial?.data.headerDescription ?? '');
  const [headerImage, setHeaderImage] = useState<SelectedFile | null>(() =>
    toSelectedFile(initial?.data.headerFileId ?? null, initial?.data.headerFileUrl ?? null, 'تصویر هدر'),
  );

  const [historyTitle, setHistoryTitle] = useState(initial?.data.historyTitle ?? '');
  const [historyDescription, setHistoryDescription] = useState(initial?.data.historyDescription ?? '');

  const [founderTitle, setFounderTitle] = useState(initial?.data.founderTitle ?? '');
  const [founderSubtitle, setFounderSubtitle] = useState(initial?.data.founderSubtitle ?? '');
  const [founderDescription, setFounderDescription] = useState(initial?.data.founderDescription ?? '');
  const [founderImage, setFounderImage] = useState<SelectedFile | null>(() =>
    toSelectedFile(initial?.data.founderFileId ?? null, initial?.data.founderFileUrl ?? null, 'تصویر موسس'),
  );
  const [founderSignature, setFounderSignature] = useState<SelectedFile | null>(() =>
    toSelectedFile(initial?.data.founderSignatureFileId ?? null, initial?.data.founderSignatureFileUrl ?? null, 'امضا'),
  );

  const [statistics, setStatistics] = useState<StatisticField[]>(() => {
    const items = initial?.data.statistics ?? [];
    if (items.length === 0) return [];
    return items.map((item) => ({ id: nextStatisticId(), title: item.title, description: item.description, number: String(item.number) }));
  });

  // --------------------------------------------------------

  const addStatistic = () => setStatistics((prev) => [...prev, { id: nextStatisticId(), title: '', description: '', number: '' }]);
  const removeStatistic = (id: string) => setStatistics((prev) => prev.filter((item) => item.id !== id));
  const updateStatistic = (id: string, patch: Partial<StatisticField>) => {
    setStatistics((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleSubmit = async () => {
    const payload: AboutInput = {
      headerTitle: headerTitle.trim() || null,
      headerDescription: headerDescription.trim() || null,
      headerFileId: headerImage?.id ?? null,
      historyTitle: historyTitle.trim() || null,
      historyDescription: historyDescription.trim() || null,
      founderTitle: founderTitle.trim() || null,
      founderSubtitle: founderSubtitle.trim() || null,
      founderDescription: founderDescription.trim() || null,
      founderFileId: founderImage?.id ?? null,
      founderSignatureFileId: founderSignature?.id ?? null,
      statistics: statistics.map((item) => ({
        title: item.title.trim(),
        description: item.description.trim(),
        number: Number(item.number) || 0,
      })),
    };

    const saved = mode === 'edit' ? await updateAbout(sectionId, payload) : await createAbout(sectionId, payload);
    if (!saved) return;

    toast.success(mode === 'edit' ? 'بخش درباره ما ذخیره شد.' : 'بخش درباره ما ایجاد شد.');
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
        {mode === 'edit' ? 'ذخیره تغییرات' : 'ایجاد بخش درباره ما'}
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={mode === 'edit' ? 'ویرایش درباره ما' : 'ایجاد درباره ما'} footer={footer} size='lg'>
      <div className='flex flex-col gap-8'>
        {/* Header */}
        <section className='flex flex-col gap-4'>
          <h3 className='text-sm font-bold text-secondary-black-3'>بخش معرفی (هدر)</h3>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='about-header-title' className='text-sm text-secondary-1'>
              عنوان
            </Label>
            <Input id='about-header-title' value={headerTitle} className='h-11' onChange={(event) => setHeaderTitle(event.target.value)} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='about-header-desc' className='text-sm text-secondary-1'>
              توضیح (HTML مجاز)
            </Label>
            <Textarea
              id='about-header-desc'
              dir='ltr'
              rows={4}
              value={headerDescription}
              className='resize-y font-mono text-xs'
              onChange={(event) => setHeaderDescription(event.target.value)}
            />
          </div>

          <ImagePickerField label='تصویر هدر' value={headerImage} onChange={setHeaderImage} disabled={submitting} />
        </section>

        {/* History */}
        <section className='flex flex-col gap-4 border-t border-gray-1 pt-6'>
          <h3 className='text-sm font-bold text-secondary-black-3'>تاریخچه</h3>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='about-history-title' className='text-sm text-secondary-1'>
              عنوان
            </Label>
            <Input id='about-history-title' value={historyTitle} className='h-11' onChange={(event) => setHistoryTitle(event.target.value)} />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='about-history-desc' className='text-sm text-secondary-1'>
              توضیح (HTML مجاز)
            </Label>
            <Textarea
              id='about-history-desc'
              dir='ltr'
              rows={4}
              value={historyDescription}
              className='resize-y font-mono text-xs'
              onChange={(event) => setHistoryDescription(event.target.value)}
            />
          </div>
        </section>

        {/* Founder */}
        <section className='flex flex-col gap-4 border-t border-gray-1 pt-6'>
          <h3 className='text-sm font-bold text-secondary-black-3'>پیام موسس</h3>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='about-founder-title' className='text-sm text-secondary-1'>
                عنوان
              </Label>
              <Input id='about-founder-title' value={founderTitle} className='h-11' onChange={(event) => setFounderTitle(event.target.value)} />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='about-founder-subtitle' className='text-sm text-secondary-1'>
                زیرعنوان
              </Label>
              <Input id='about-founder-subtitle' value={founderSubtitle} className='h-11' onChange={(event) => setFounderSubtitle(event.target.value)} />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='about-founder-desc' className='text-sm text-secondary-1'>
              متن پیام (HTML مجاز)
            </Label>
            <Textarea
              id='about-founder-desc'
              dir='ltr'
              rows={4}
              value={founderDescription}
              className='resize-y font-mono text-xs'
              onChange={(event) => setFounderDescription(event.target.value)}
            />
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <ImagePickerField label='تصویر موسس' value={founderImage} onChange={setFounderImage} disabled={submitting} />
            <ImagePickerField label='تصویر امضا' value={founderSignature} onChange={setFounderSignature} disabled={submitting} />
          </div>
        </section>

        {/* Statistics */}
        <section className='flex flex-col gap-3 border-t border-gray-1 pt-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-bold text-secondary-black-3'>آمارها</h3>
            <Button type='button' variant='outline' size='sm' className='h-8 rounded-lg border-gray-2' onClick={addStatistic}>
              <Plus />
              افزودن آمار
            </Button>
          </div>

          {statistics.length === 0 ? (
            <p className='text-caption text-secondary-3'>آماری ثبت نشده است.</p>
          ) : (
            <div className='flex flex-col gap-3'>
              {statistics.map((item) => (
                <div key={item.id} className='flex flex-col gap-2 rounded-xl border border-gray-1 p-3 sm:flex-row sm:items-center'>
                  <Input
                    value={item.number}
                    dir='ltr'
                    type='number'
                    placeholder='عدد'
                    className='h-10 w-full sm:w-28'
                    onChange={(event) => updateStatistic(item.id, { number: event.target.value })}
                  />
                  <Input
                    value={item.title}
                    placeholder='عنوان (مثلا مشتری راضی)'
                    className='h-10 flex-1'
                    onChange={(event) => updateStatistic(item.id, { title: event.target.value })}
                  />
                  <Input
                    value={item.description}
                    placeholder='توضیح کوتاه'
                    className='h-10 flex-1'
                    onChange={(event) => updateStatistic(item.id, { description: event.target.value })}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className='shrink-0 text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                    title='حذف آمار'
                    onClick={() => removeStatistic(item.id)}>
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ReusableModal>
  );
}
