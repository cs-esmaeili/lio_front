'use client';

import { useState } from 'react';
import { CircleAlert, FileText, Pencil, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import ConfirmDeleteSectionItemModal from '@/components/admin/sections/ConfirmDeleteSectionItemModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { useAboutSection } from '@/hooks/page-sections/useAboutSection';
import { useDeleteAbout } from '@/hooks/page-sections/useDeleteAbout';
import AboutCard from './AboutCard';
import AboutFormModal from './AboutFormModal';

/** Manage the singleton ABOUT section. */
export default function AboutManager() {
  const { section, loading, error, refetch } = useAboutSection();
  const { deleteAbout, loading: deleting } = useDeleteAbout();

  const [editor, setEditor] = useState<{ mode: 'create' | 'edit' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const sectionId = section?.id ?? null;
  const exists = Boolean(section && (section.data.headerTitle || section.data.headerDescription || section.data.statistics.length > 0));

  const handleSaved = () => void refetch();

  const handleConfirmDelete = async () => {
    if (!sectionId) return;

    const updated = await deleteAbout(sectionId);
    if (!updated) return;

    toast.success('بخش درباره ما حذف شد.');
    setConfirmDelete(false);
    void refetch();
  };

  // --------------------------------------------------------

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>درباره ما</h1>
          <p className='text-regular text-secondary-2'>محتوای صفحهٔ «درباره ما» (معرفی، تاریخچه، پیام موسس و آمارها) را مدیریت کنید.</p>
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

          <Button type='button' className='h-11 rounded-xl px-5' disabled={!sectionId || loading} onClick={() => setEditor({ mode: exists ? 'edit' : 'create' })}>
            <Pencil />
            {exists ? 'ویرایش محتوا' : 'ایجاد محتوا'}
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && !section ? (
        <div className='h-56 animate-pulse rounded-2xl border border-gray-1 bg-gray-1/60' />
      ) : error && !section ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : !exists ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <FileText className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>هنوز محتوایی برای «درباره ما» ثبت نشده است.</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' disabled={!sectionId} onClick={() => setEditor({ mode: 'create' })}>
            <Pencil />
            ایجاد محتوا
          </Button>
        </div>
      ) : section ? (
        <AboutCard section={section} deleting={deleting} onEdit={() => setEditor({ mode: 'edit' })} onDelete={() => setConfirmDelete(true)} />
      ) : null}

      {/* Modals */}
      {editor !== null && sectionId !== null && (
        <AboutFormModal
          open
          onOpenChange={(open) => {
            if (!open) setEditor(null);
          }}
          sectionId={sectionId}
          mode={editor.mode}
          initial={editor.mode === 'edit' ? section : null}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDeleteSectionItemModal
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        name='بخش درباره ما'
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
