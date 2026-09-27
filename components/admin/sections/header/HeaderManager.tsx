'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircleAlert, Menu, Plus, RefreshCw, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

import ConfirmDeleteSectionItemModal from '@/components/admin/sections/ConfirmDeleteSectionItemModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { useDeleteHeaderItem } from '@/hooks/page-sections/useDeleteHeaderItem';
import { useHeaderSection } from '@/hooks/page-sections/useHeaderSection';
import HeaderItemFormModal from './HeaderItemFormModal';
import HeaderItemRow from './HeaderItemRow';
import type { HeaderItem } from '@/typescript/schemas/page-section.schema';

type EditorState = { mode: 'create' | 'edit'; item: HeaderItem | null };

/** Manage the menu items of the global HEADER section. */
export default function HeaderManager() {
  const { section, loading, error, refetch } = useHeaderSection();
  const { deleteHeaderItem, loading: deleting } = useDeleteHeaderItem();

  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HeaderItem | null>(null);

  const sectionId = section?.id ?? null;
  const items = section?.data.items ?? [];

  const handleSaved = () => void refetch();

  const handleConfirmDelete = async () => {
    if (!sectionId || !deleteTarget) return;

    const updated = await deleteHeaderItem(sectionId, deleteTarget.id);
    if (!updated) return;

    toast.success('آیتم هدر حذف شد.');
    setDeleteTarget(null);
    void refetch();
  };

  // --------------------------------------------------------

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>هدر سایت</h1>
          <p className='text-regular text-secondary-2'>آیتم‌های منوی هدر را مدیریت کنید (لینک یا دسته‌بندی).</p>
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

          <Button type='button' className='h-11 rounded-xl px-5' disabled={!sectionId || loading} onClick={() => setEditor({ mode: 'create', item: null })}>
            <Plus />
            افزودن آیتم
          </Button>
        </div>
      </div>

      {/* Branding note */}
      <div className='flex flex-col gap-3 rounded-2xl border border-gray-1 bg-gray-1/40 p-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-start gap-3'>
          <div className='grid size-9 shrink-0 place-content-center rounded-lg bg-custom-white'>
            <Settings2 className='text-primary-1' size={18} aria-hidden='true' />
          </div>
          <p className='text-regular text-secondary-2'>
            لوگو، شعار و تلفن پشتیبانی هدر از «تنظیمات سایت» خوانده می‌شوند.
          </p>
        </div>

        <Button type='button' variant='outline' size='sm' className='h-9 shrink-0 rounded-lg border-gray-2' asChild>
          <Link href='/admin/settings'>تنظیمات سایت</Link>
        </Button>
      </div>

      {/* List */}
      {loading && !section ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='h-14 animate-pulse rounded-xl border border-gray-1 bg-gray-1/60' />
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
      ) : items.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
          <Menu className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>هنوز آیتمی برای هدر ثبت نشده است.</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' disabled={!sectionId} onClick={() => setEditor({ mode: 'create', item: null })}>
            <Plus />
            افزودن اولین آیتم
          </Button>
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          {items.map((item, index) => (
            <HeaderItemRow
              key={item.id}
              item={item}
              index={index}
              deleting={deleting && deleteTarget?.id === item.id}
              onEdit={(value) => setEditor({ mode: 'edit', item: value })}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {editor !== null && sectionId !== null && (
        <HeaderItemFormModal
          open
          onOpenChange={(open) => {
            if (!open) setEditor(null);
          }}
          sectionId={sectionId}
          mode={editor.mode}
          initial={editor.item}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDeleteSectionItemModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget?.label || 'آیتم هدر'}
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
