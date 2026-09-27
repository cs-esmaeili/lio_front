'use client';

import { useMemo, useState } from 'react';
import { CircleAlert, Plus, RefreshCw, Search, Settings2 } from 'lucide-react';

import SiteSettingCard from '@/components/admin/site-settings/SiteSettingCard';
import SiteSettingEditorModal from '@/components/admin/site-settings/SiteSettingEditorModal';
import ConfirmDeleteSettingModal from '@/components/admin/site-settings/ConfirmDeleteSettingModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useSiteSettingsList } from '@/hooks/site-settings/useSiteSettingsList';
import { useDeleteSiteSetting } from '@/hooks/site-settings/useDeleteSiteSetting';
import type { SiteSetting } from '@/typescript/schemas/site-setting.schema';

type EditorState = { mode: 'create' | 'edit'; setting: SiteSetting | null };

export default function AdminSettingsPage() {
  const { settings, loading, error, refetch } = useSiteSettingsList();
  const { deleteSetting, loading: deleting } = useDeleteSiteSetting();

  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SiteSetting | null>(null);

  const visibleSettings = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return settings;

    return settings.filter((setting) => {
      if (setting.key.toLowerCase().includes(term)) return true;
      return JSON.stringify(setting.data).toLowerCase().includes(term);
    });
  }, [settings, search]);

  // --------------------------------------------------------

  const openCreate = () => setEditor({ mode: 'create', setting: null });
  const openEdit = (setting: SiteSetting) => setEditor({ mode: 'edit', setting });

  const handleSaved = () => {
    void refetch();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const removed = await deleteSetting(deleteTarget.key);
    if (!removed) return;

    setDeleteTarget(null);
    await refetch();
  };

  // --------------------------------------------------------

  const editorKey = editor ? `${editor.mode}:${editor.setting?.key ?? 'new'}` : 'closed';

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-background p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>تنظیمات سایت</h1>
          <p className='text-regular text-secondary-2'>
            تنظیمات کلید-محور سایت را ایجاد، ویرایش و حذف کنید. مدیریت نیازمند پرمیشن <span dir='ltr'>site:manage</span> است.
          </p>
        </div>

        <Button type='button' className='h-11 shrink-0 rounded-xl px-5' onClick={openCreate}>
          <Plus />
          تنظیم جدید
        </Button>
      </div>

      {/* Toolbar */}
      <div className='flex items-center gap-2'>
        <div className='relative min-w-0 flex-1 sm:max-w-80'>
          <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='جستجو بر اساس کلید یا مقدار...'
            className='h-10 ps-8'
          />
        </div>

        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='h-10 w-10 rounded-lg border-gray-2 text-secondary-2'
          title='بروزرسانی'
          disabled={loading}
          onClick={() => void refetch()}>
          {loading ? <Spinner /> : <RefreshCw />}
        </Button>
      </div>

      {/* List */}
      {loading && settings.length === 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='h-40 animate-pulse rounded-xl border border-gray-1 bg-gray-1/60' />
          ))}
        </div>
      ) : error && settings.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-background py-16 text-center'>
          <CircleAlert className='text-destructive' size={32} aria-hidden='true' />
          <p className='text-regular text-secondary-1'>{error}</p>
          <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : visibleSettings.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-background py-16 text-center'>
          <Settings2 className='text-secondary-3' size={36} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>
            {search.trim() ? 'تنظیمی با این جستجو پیدا نشد.' : 'هنوز تنظیمی ثبت نشده است.'}
          </p>
          {!search.trim() && (
            <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={openCreate}>
              <Plus />
              ایجاد اولین تنظیم
            </Button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {visibleSettings.map((setting) => (
            <SiteSettingCard
              key={setting.key}
              setting={setting}
              deleting={deleting && deleteTarget?.key === setting.key}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SiteSettingEditorModal
        key={editorKey}
        open={editor !== null}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        mode={editor?.mode ?? 'create'}
        initial={editor?.setting ?? null}
        onSaved={handleSaved}
      />

      <ConfirmDeleteSettingModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        setting={deleteTarget}
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
