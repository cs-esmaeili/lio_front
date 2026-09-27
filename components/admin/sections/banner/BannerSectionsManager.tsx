'use client';

import { useState } from 'react';
import { CircleAlert, ImageIcon, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import ConfirmDeleteSectionItemModal from '@/components/admin/sections/ConfirmDeleteSectionItemModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { useBannerSections } from '@/hooks/page-sections/useBannerSections';
import { useDeleteBanner } from '@/hooks/page-sections/useDeleteBanner';
import BannerCard from './BannerCard';
import BannerFormModal from './BannerFormModal';
import type { BannerItem } from '@/typescript/schemas/page-section.schema';

type EditorState = { sectionId: number; mode: 'create' | 'edit'; banner: BannerItem | null };
type DeleteState = { sectionId: number; banner: BannerItem };

/** Manage every BANNER section on the home page and its banners. */
export default function BannerSectionsManager() {
  const { sections, loading, error, refetch } = useBannerSections();
  const { deleteBanner, loading: deleting } = useDeleteBanner();

  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteState | null>(null);

  const openCreate = (sectionId: number) => setEditor({ sectionId, mode: 'create', banner: null });
  const openEdit = (sectionId: number, banner: BannerItem) => setEditor({ sectionId, mode: 'edit', banner });
  const handleSaved = () => void refetch();

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const updated = await deleteBanner(deleteTarget.sectionId, deleteTarget.banner.id);
    if (!updated) return;

    toast.success('بنر حذف شد.');
    setDeleteTarget(null);
    void refetch();
  };

  // --------------------------------------------------------

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>بنرها</h1>
          <p className='text-regular text-secondary-2'>بنرهای بخش‌های مختلف صفحه اصلی را مدیریت کنید.</p>
        </div>

        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='h-11 w-11 shrink-0 rounded-xl border-gray-2 text-secondary-2'
          title='بروزرسانی'
          disabled={loading}
          onClick={() => void refetch()}>
          {loading ? <Spinner /> : <RefreshCw />}
        </Button>
      </div>

      {/* List */}
      {loading && sections.length === 0 ? (
        <div className='flex flex-col gap-4'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className='h-64 animate-pulse rounded-2xl border border-gray-1 bg-gray-1/60' />
          ))}
        </div>
      ) : error && sections.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : sections.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <ImageIcon className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>بخش بنری روی صفحه اصلی پیدا نشد.</p>
        </div>
      ) : (
        sections.map((section) => (
          <div key={section.id} className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-5 md:p-6'>
            <div className='flex items-center justify-between gap-3 border-b border-gray-1 pb-4'>
              <div className='flex items-center gap-2'>
                <h2 className='text-base font-bold text-secondary-black-3'>{section.title || section.location}</h2>
                <span className='rounded-full bg-primary-4 px-2 py-0.5 text-caption text-primary-1'>
                  {section.data.banners.length.toLocaleString('fa-IR')}
                </span>
              </div>

              <Button type='button' variant='outline' size='sm' className='h-9 rounded-lg border-gray-2' onClick={() => openCreate(section.id)}>
                <Plus />
                افزودن بنر
              </Button>
            </div>

            {section.data.banners.length === 0 ? (
              <p className='py-6 text-center text-caption text-secondary-3'>بنری در این بخش ثبت نشده است.</p>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {section.data.banners.map((banner, index) => (
                  <BannerCard
                    key={banner.id}
                    banner={banner}
                    index={index}
                    deleting={deleting && deleteTarget?.banner.id === banner.id}
                    onEdit={(item) => openEdit(section.id, item)}
                    onDelete={(item) => setDeleteTarget({ sectionId: section.id, banner: item })}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* Modals */}
      {editor !== null && (
        <BannerFormModal
          open
          onOpenChange={(open) => {
            if (!open) setEditor(null);
          }}
          sectionId={editor.sectionId}
          mode={editor.mode}
          initial={editor.banner}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDeleteSectionItemModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget?.banner.title || 'بنر'}
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
