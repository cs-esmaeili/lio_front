'use client';

import { useState } from 'react';
import { CircleAlert, FileText, Pencil, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import ConfirmDeleteSectionItemModal from '@/components/admin/sections/ConfirmDeleteSectionItemModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { useAuth } from '@/hooks/auth/useAuth';
import { useContactSection } from '@/hooks/page-sections/useContactSection';
import { useDeleteContact } from '@/hooks/page-sections/useDeleteContact';
import { PERMISSIONS } from '@/typescript/constants/permissions';
import ContactCard from './ContactCard';
import ContactFormModal from './ContactFormModal';
import SocialsManager from './SocialsManager';

/** Manage the singleton CONTACT section and the page's social links. */
export default function ContactManager() {
  const { section, loading, error, refetch } = useContactSection();
  const { deleteContact, loading: deleting } = useDeleteContact();
  const { hasAllPermissions } = useAuth();

  const canManageSocials = hasAllPermissions([PERMISSIONS.SITE_MANAGE]);

  const [editor, setEditor] = useState<{ mode: 'create' | 'edit' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const sectionId = section?.id ?? null;
  const exists = Boolean(section && (section.data.address || section.data.email || section.data.supportHour || section.data.mapLat !== null));

  const handleSaved = () => void refetch();

  const handleConfirmDelete = async () => {
    if (!sectionId) return;

    const updated = await deleteContact(sectionId);
    if (!updated) return;

    toast.success('اطلاعات تماس حذف شد.');
    setConfirmDelete(false);
    void refetch();
  };

  // --------------------------------------------------------

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>تماس با ما</h1>
          <p className='text-regular text-secondary-2'>اطلاعات تماس، موقعیت روی نقشه و شبکه‌های اجتماعی صفحهٔ «تماس با ما» را مدیریت کنید.</p>
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

          {exists && (
            <Button type='button' className='h-11 rounded-xl px-5' disabled={!sectionId || loading} onClick={() => setEditor({ mode: 'edit' })}>
              <Pencil />
              ویرایش اطلاعات
            </Button>
          )}
        </div>
      </div>

      {/* Contact info */}
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
          <p className='text-regular text-secondary-2'>هنوز اطلاعات تماسی ثبت نشده است.</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' disabled={!sectionId} onClick={() => setEditor({ mode: 'create' })}>
            <Pencil />
            ایجاد اطلاعات تماس
          </Button>
        </div>
      ) : section ? (
        <ContactCard section={section} deleting={deleting} onEdit={() => setEditor({ mode: 'edit' })} onDelete={() => setConfirmDelete(true)} />
      ) : null}

      {/* Social links */}
      {canManageSocials && <SocialsManager />}

      {/* Modals */}
      {editor !== null && sectionId !== null && (
        <ContactFormModal
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
        name='اطلاعات تماس'
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
