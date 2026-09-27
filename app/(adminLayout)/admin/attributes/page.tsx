'use client';

import { useMemo, useState } from 'react';
import { CircleAlert, Layers, ListChecks, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';

import AttributeEditorModal from '@/components/admin/attribute-manager/AttributeEditorModal';
import AttributeValuesModal from '@/components/admin/attribute-manager/AttributeValuesModal';
import ConfirmDeleteAttributeModal from '@/components/admin/attribute-manager/ConfirmDeleteAttributeModal';
import { DataTable, createAppColumnHelper } from '@/components/global/DataTable';
import PermissionGate from '@/components/global/PermissionGate';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useAttributeList } from '@/hooks/attribute/useAttributeList';
import { useAttributeMutations } from '@/hooks/attribute/useAttributeMutations';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { PERMISSIONS } from '@/typescript/constants/permissions';
import { ATTRIBUTE_USAGE_LABELS, FILTER_TYPE_LABELS, type AdminAttribute } from '@/typescript/schemas/attribute.schema';

const columnHelper = createAppColumnHelper<AdminAttribute>();

interface EditorState {
  mode: 'create' | 'edit';
  initial: AdminAttribute | null;
}

export default function AdminAttributesPage() {
  const { attributes, loading, error, refetch } = useAttributeList();
  const { deleteAttribute, deleting } = useAttributeMutations();
  const { hasPermission } = usePermissions();

  const canManage = hasPermission(PERMISSIONS.ATTRIBUTE_MANAGE);

  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [valuesTarget, setValuesTarget] = useState<AdminAttribute | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAttribute | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return attributes;
    return attributes.filter((attribute) => attribute.title.toLowerCase().includes(query) || attribute.name.toLowerCase().includes(query));
  }, [attributes, search]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const removed = await deleteAttribute(deleteTarget.id);
    if (!removed) return;
    setDeleteTarget(null);
  };

  const columns = useMemo(() => {
    return columnHelper.columns([
      columnHelper.accessor('title', {
        header: 'عنوان',
        cell: (info) => {
          const attribute = info.row.original;
          return (
            <div className='flex flex-col'>
              <span className='font-medium text-secondary-black-3'>{attribute.title}</span>
              <span className='text-caption text-secondary-3' dir='ltr'>
                {attribute.name}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('usage', {
        header: 'کاربرد',
        cell: (info) => {
          const usage = info.getValue();
          const isVariant = usage === 'VARIANT';
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-caption font-medium ${
                isVariant ? 'bg-primary-4 text-primary-1' : 'bg-gray-1 text-secondary-1'
              }`}>
              {ATTRIBUTE_USAGE_LABELS[usage]}
            </span>
          );
        },
      }),
      columnHelper.accessor('filterType', {
        header: 'نوع فیلتر',
        cell: (info) => <span className='text-secondary-1'>{FILTER_TYPE_LABELS[info.getValue()]}</span>,
      }),
      columnHelper.accessor('isMultiSelect', {
        header: 'چندگانه',
        cell: (info) => <span className='text-secondary-1'>{info.getValue() ? 'بله' : 'خیر'}</span>,
      }),
      columnHelper.accessor((row) => row.values.length, {
        id: 'values',
        header: 'مقادیر',
        cell: (info) => {
          const attribute = info.row.original;
          return (
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-8 rounded-lg border-gray-2'
              title='مدیریت مقادیر'
              disabled={!canManage}
              onClick={() => setValuesTarget(attribute)}>
              <ListChecks />
              {attribute.values.length.toLocaleString('fa-IR')} مقدار
            </Button>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'عملیات',
        enableSorting: false,
        cell: (info) => {
          const attribute = info.row.original;
          return (
            <div className='flex items-center gap-1'>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-lg text-secondary-2'
                title='ویرایش'
                disabled={!canManage}
                onClick={() => setEditor({ mode: 'edit', initial: attribute })}>
                <Pencil />
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-lg text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                title='حذف'
                disabled={!canManage}
                onClick={() => setDeleteTarget(attribute)}>
                <Trash2 />
              </Button>
            </div>
          );
        },
      }),
    ]);
  }, [canManage]);

  const editorKey = editor ? `${editor.mode}:${editor.initial?.id ?? 'new'}` : 'closed';

  return (
    <PermissionGate anyOf={[PERMISSIONS.ATTRIBUTE_READ, PERMISSIONS.ATTRIBUTE_MANAGE]}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-6 md:flex-row md:items-center md:justify-between md:p-8'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-xl font-bold text-secondary-black-3 md:text-2xl'>ویژگی‌ها</h1>
            <p className='text-regular text-secondary-2'>
              ویژگی‌های «مشخصه» محصول را توصیف می‌کنند و ویژگی‌های «تنوع» محورهای قیمت و موجودی می‌سازند. مقادیر هر ویژگی از همین صفحه مدیریت می‌شود.
            </p>
          </div>

          {canManage && (
            <Button type='button' className='h-11 shrink-0 rounded-xl px-5' onClick={() => setEditor({ mode: 'create', initial: null })}>
              <Plus />
              ویژگی جدید
            </Button>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <div className='relative min-w-0 flex-1 sm:max-w-80'>
            <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='جستجو بر اساس عنوان یا نام فنی...' className='h-10 ps-8' />
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

          <span className='ms-auto hidden text-caption text-secondary-2 sm:block'>{attributes.length.toLocaleString('fa-IR')} ویژگی</span>
        </div>

        {error && attributes.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-2 bg-custom-white py-16 text-center'>
            <CircleAlert className='text-custom-red' size={32} aria-hidden='true' />
            <p className='text-regular text-secondary-1'>{error}</p>
            <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => void refetch()}>
              تلاش دوباره
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            getRowId={(attribute) => String(attribute.id)}
            isLoading={loading && attributes.length === 0}
            emptyIcon={Layers}
            emptyMessage={search.trim() ? 'ویژگی‌ای با این جستجو پیدا نشد.' : 'هنوز ویژگی‌ای ثبت نشده است.'}
            emptyAction={
              !search.trim() && canManage ? (
                <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={() => setEditor({ mode: 'create', initial: null })}>
                  <Plus />
                  ایجاد اولین ویژگی
                </Button>
              ) : null
            }
          />
        )}

        <AttributeEditorModal
          key={editorKey}
          open={editor !== null}
          onOpenChange={(open) => {
            if (!open) setEditor(null);
          }}
          mode={editor?.mode ?? 'create'}
          initial={editor?.initial ?? null}
          onSaved={() => void refetch()}
        />

        <AttributeValuesModal
          open={valuesTarget !== null}
          onOpenChange={(open) => {
            if (!open) setValuesTarget(null);
          }}
          attribute={valuesTarget}
          onChanged={(updated) => {
            setValuesTarget(updated);
            void refetch();
          }}
        />

        <ConfirmDeleteAttributeModal
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          attribute={deleteTarget}
          loading={deleting}
          onConfirm={() => void handleConfirmDelete()}
        />
      </div>
    </PermissionGate>
  );
}
