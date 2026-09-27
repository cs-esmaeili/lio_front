'use client';

import { useState } from 'react';
import { CircleAlert, ImageIcon, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { useSliderSection } from '@/hooks/page-sections/useSliderSection';
import { useDeleteSliderSlide } from '@/hooks/page-sections/useDeleteSliderSlide';
import ConfirmDeleteSectionItemModal from '../ConfirmDeleteSectionItemModal';
import SliderSlideCard from './SliderSlideCard';
import SliderSlideFormModal from './SliderSlideFormModal';
import type { SliderSlide } from '@/typescript/schemas/page-section.schema';

type EditorState = { mode: 'create' | 'edit'; slide: SliderSlide | null; nonce: number };

/** Manage the slides of the global SLIDER section. */
export default function SliderSlidesManager() {
  const { section, loading, error, refetch } = useSliderSection();
  const { deleteSlide, loading: deleting } = useDeleteSliderSlide();

  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SliderSlide | null>(null);

  const sectionId = section?.id ?? null;
  const slides = section?.data.slides ?? [];

  // --------------------------------------------------------

  const openCreate = () => setEditor({ mode: 'create', slide: null, nonce: Date.now() });
  const openEdit = (slide: SliderSlide) => setEditor({ mode: 'edit', slide, nonce: Date.now() });
  const handleSaved = () => void refetch();

  const handleConfirmDelete = async () => {
    if (!sectionId || !deleteTarget) return;

    const updated = await deleteSlide(sectionId, deleteTarget.id);
    if (!updated) return;

    toast.success('اسلاید حذف شد.');
    setDeleteTarget(null);
    void refetch();
  };

  // --------------------------------------------------------

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>اسلایدر</h1>
          <p className='text-regular text-secondary-2'>اسلایدهای اسلایدر اصلی سایت را مدیریت کنید.</p>
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='icon-sm'
            className='h-11 w-11 rounded-xl border-gray-2 text-secondary-2'
            title='بروزرسانی'
            disabled={loading}
            onClick={() => void refetch()}>
            {loading ? <Spinner /> : <RefreshCw />}
          </Button>

          <Button type='button' className='h-11 rounded-xl px-5' disabled={!sectionId || loading} onClick={openCreate}>
            <Plus />
            افزودن اسلاید
          </Button>
        </div>
      </div>

      {/* List */}
      {loading && !section ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='h-64 animate-pulse rounded-xl border border-gray-1 bg-gray-1/60' />
          ))}
        </div>
      ) : error && !section ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : slides.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <ImageIcon className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>هنوز اسلایدی ثبت نشده است.</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' disabled={!sectionId} onClick={openCreate}>
            <Plus />
            افزودن اولین اسلاید
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {slides.map((slide, index) => (
            <SliderSlideCard
              key={slide.id}
              slide={slide}
              index={index}
              deleting={deleting && deleteTarget?.id === slide.id}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {sectionId !== null && (
        <SliderSlideFormModal
          key={editor ? editor.nonce : 'closed'}
          open={editor !== null}
          onOpenChange={(open) => {
            if (!open) setEditor(null);
          }}
          sectionId={sectionId}
          mode={editor?.mode ?? 'create'}
          initial={editor?.slide ?? null}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDeleteSectionItemModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget ? `اسلاید ${slides.findIndex((slide) => slide.id === deleteTarget.id) + 1}` : ''}
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
