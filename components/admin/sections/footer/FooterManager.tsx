'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircleAlert, Plus, RefreshCw, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

import ConfirmDeleteSectionItemModal from '@/components/admin/sections/ConfirmDeleteSectionItemModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { useDeleteFooterItem } from '@/hooks/page-sections/useDeleteFooterItem';
import { useFooterSection } from '@/hooks/page-sections/useFooterSection';
import FooterItemFormModal from './FooterItemFormModal';
import FooterItemRow from './FooterItemRow';
import type { FooterCategoryItem, FooterEditorInit, FooterItemType, FooterLinkItem } from '@/typescript/schemas/page-section.schema';

type EditorState = { mode: 'create' | 'edit'; defaultType: FooterItemType; initial: FooterEditorInit | null };
type DeleteState = { id: number; name: string };

function linkToInit(link: FooterLinkItem): FooterEditorInit {
  return { id: link.id, type: 'LINK', label: link.label, url: link.url, description: link.description, fileId: link.fileId, fileUrl: link.fileUrl, categoryId: null };
}

function categoryToInit(category: FooterCategoryItem): FooterEditorInit {
  return { id: category.id, type: 'CATEGORY', label: category.name, url: category.url, description: null, fileId: null, fileUrl: null, categoryId: category.categoryId };
}

/** Manage the links and categories of the global FOOTER section. */
export default function FooterManager() {
  const { section, loading, error, refetch } = useFooterSection();
  const { deleteFooterItem, loading: deleting } = useDeleteFooterItem();

  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteState | null>(null);

  const sectionId = section?.id ?? null;
  const links = section?.data.links ?? [];
  const categories = section?.data.categories ?? [];

  const handleSaved = () => void refetch();

  const handleConfirmDelete = async () => {
    if (!sectionId || !deleteTarget) return;

    const updated = await deleteFooterItem(sectionId, deleteTarget.id);
    if (!updated) return;

    toast.success('آیتم فوتر حذف شد.');
    setDeleteTarget(null);
    void refetch();
  };

  // --------------------------------------------------------

  const addButton = (type: FooterItemType, label: string) => (
    <Button
      type='button'
      variant='outline'
      size='sm'
      className='h-9 rounded-lg border-gray-2'
      disabled={!sectionId}
      onClick={() => setEditor({ mode: 'create', defaultType: type, initial: null })}>
      <Plus />
      {label}
    </Button>
  );

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>فوتر سایت</h1>
          <p className='text-regular text-secondary-2'>لینک‌ها و دسته‌بندی‌های فوتر را مدیریت کنید.</p>
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

      {/* Branding note */}
      <div className='flex flex-col gap-3 rounded-2xl border border-gray-1 bg-gray-1/40 p-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-start gap-3'>
          <div className='grid size-9 shrink-0 place-content-center rounded-lg bg-custom-white'>
            <Settings2 className='text-primary-1' size={18} aria-hidden='true' />
          </div>
          <p className='text-regular text-secondary-2'>لوگو، توضیحات، شعار و تلفن پشتیبانی فوتر از «تنظیمات سایت» خوانده می‌شوند.</p>
        </div>

        <Button type='button' variant='outline' size='sm' className='h-9 shrink-0 rounded-lg border-gray-2' asChild>
          <Link href='/admin/settings'>تنظیمات سایت</Link>
        </Button>
      </div>

      {/* Content */}
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
      ) : (
        <>
          {/* Links */}
          <section className='flex flex-col gap-3 rounded-2xl border border-gray-1 bg-custom-white p-5 md:p-6'>
            <div className='flex items-center justify-between gap-3 border-b border-gray-1 pb-3'>
              <div className='flex items-center gap-2'>
                <h2 className='text-base font-bold text-secondary-black-3'>لینک‌ها</h2>
                <span className='rounded-full bg-primary-4 px-2 py-0.5 text-caption text-primary-1'>{links.length.toLocaleString('fa-IR')}</span>
              </div>
              {addButton('LINK', 'افزودن لینک')}
            </div>

            {links.length === 0 ? (
              <p className='py-6 text-center text-caption text-secondary-3'>لینکی ثبت نشده است.</p>
            ) : (
              <div className='flex flex-col gap-2'>
                {links.map((link) => (
                  <FooterItemRow
                    key={link.id}
                    title={link.label}
                    url={link.url}
                    description={link.description}
                    imageUrl={link.fileUrl}
                    deleting={deleting && deleteTarget?.id === link.id}
                    onEdit={() => setEditor({ mode: 'edit', defaultType: 'LINK', initial: linkToInit(link) })}
                    onDelete={() => setDeleteTarget({ id: link.id, name: link.label })}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Categories */}
          <section className='flex flex-col gap-3 rounded-2xl border border-gray-1 bg-custom-white p-5 md:p-6'>
            <div className='flex items-center justify-between gap-3 border-b border-gray-1 pb-3'>
              <div className='flex items-center gap-2'>
                <h2 className='text-base font-bold text-secondary-black-3'>دسته‌بندی‌ها</h2>
                <span className='rounded-full bg-primary-4 px-2 py-0.5 text-caption text-primary-1'>{categories.length.toLocaleString('fa-IR')}</span>
              </div>
              {addButton('CATEGORY', 'افزودن دسته‌بندی')}
            </div>

            {categories.length === 0 ? (
              <p className='py-6 text-center text-caption text-secondary-3'>دسته‌بندی‌ای ثبت نشده است.</p>
            ) : (
              <div className='flex flex-col gap-2'>
                {categories.map((category) => (
                  <FooterItemRow
                    key={category.id}
                    title={category.name}
                    url={category.url}
                    deleting={deleting && deleteTarget?.id === category.id}
                    onEdit={() => setEditor({ mode: 'edit', defaultType: 'CATEGORY', initial: categoryToInit(category) })}
                    onDelete={() => setDeleteTarget({ id: category.id, name: category.name })}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Modals */}
      {editor !== null && sectionId !== null && (
        <FooterItemFormModal
          open
          onOpenChange={(open) => {
            if (!open) setEditor(null);
          }}
          sectionId={sectionId}
          mode={editor.mode}
          initial={editor.initial}
          defaultType={editor.defaultType}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDeleteSectionItemModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget?.name || 'آیتم فوتر'}
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
