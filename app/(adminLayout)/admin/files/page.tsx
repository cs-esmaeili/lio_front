'use client';

import { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

import FileManagerBrowser from '@/components/admin/file-manager/FileManagerBrowser';
import FileTypeIcon from '@/components/admin/file-manager/FileTypeIcon';
import { formatFileSize, type SelectedFile } from '@/components/admin/file-manager/file-manager.model';
import PermissionGate from '@/components/global/PermissionGate';
import { Button } from '@/components/shadcn/button';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { FILE_WRITE_PERMISSIONS, PERMISSIONS } from '@/typescript/constants/permissions';

export default function AdminFilesPage() {
  const [selection, setSelection] = useState<SelectedFile[]>([]);
  const { copy } = useCopyToClipboard({ successMessage: 'نشانی فایل کپی شد' });
  const { hasAnyPermission } = usePermissions();

  const canManage = hasAnyPermission([...FILE_WRITE_PERMISSIONS]);

  return (
    <PermissionGate allOf={[PERMISSIONS.FILE_READ]}>
    <div className='flex flex-col gap-6'>
      <div className='rounded-2xl border border-gray-1 bg-custom-white p-6 md:p-8'>
        <h1 className='mb-2 text-xl font-bold text-secondary-black-3 md:text-2xl'>{canManage ? 'مدیریت فایل‌ها' : 'فایل‌ها'}</h1>
        <p className='text-regular text-secondary-2'>
          {canManage
            ? 'فایل‌ها و پوشه‌ها را آپلود، مرور و مدیریت کنید.'
            : 'فایل‌ها را مرور و انتخاب کنید. برای آپلود یا حذف به پرمیشن‌های مدیریتی نیاز دارید.'}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]'>
        <div className='overflow-hidden rounded-2xl border border-gray-1 bg-custom-white'>
          <FileManagerBrowser
            canManage={canManage}
            selectable
            multiple
            className='h-[68vh]'
            onSelectionChange={setSelection}
          />
        </div>

        <aside className='flex h-fit flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-5 lg:sticky lg:top-24'>
          <div className='flex items-center justify-between'>
            <h2 className='text-base font-bold text-secondary-black-3'>فایل‌های انتخاب‌شده</h2>
            <span className='rounded-full bg-primary-4 px-2 py-0.5 text-caption text-primary-1'>
              {selection.length.toLocaleString('fa-IR')}
            </span>
          </div>

          {selection.length === 0 ? (
            <p className='text-caption text-secondary-3'>برای دیدن جزئیات و کپی نشانی، فایل‌ها را انتخاب کنید.</p>
          ) : (
            <ul className='flex max-h-[52vh] flex-col gap-2 overflow-y-auto'>
              {selection.map((file) => (
                <li key={file.path} className='flex items-start gap-3 rounded-xl border border-gray-1 p-3'>
                  <FileTypeIcon name={file.name} mimeType={file.mimeType} size={22} className='mt-0.5 shrink-0 text-secondary-2' />

                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <span className='truncate text-sm font-medium text-secondary-black-3' title={file.name} dir='auto'>
                      {file.name}
                    </span>
                    <span className='truncate text-caption text-secondary-3' dir='ltr' title={file.path}>
                      {file.path}
                    </span>
                    <span className='text-caption text-secondary-2'>{formatFileSize(file.size)}</span>

                    <div className='mt-1 flex items-center gap-1'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon-xs'
                        className='text-secondary-2 hover:text-primary-1'
                        title='کپی نشانی'
                        onClick={() => void copy(file.url)}>
                        <Copy />
                      </Button>

                      <Button
                        type='button'
                        variant='ghost'
                        size='icon-xs'
                        className='text-secondary-2 hover:text-primary-1'
                        title='باز کردن'
                        asChild>
                        <a href={file.url} target='_blank' rel='noreferrer'>
                          <ExternalLink />
                        </a>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
    </PermissionGate>
  );
}
