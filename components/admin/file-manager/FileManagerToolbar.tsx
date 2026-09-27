'use client';

import { useRef } from 'react';
import { FolderPlus, RefreshCw, Search, Upload } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';

interface FileManagerToolbarProps {
  canManage: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onFilesSelected: (files: File[]) => void;
  onCreateFolder: () => void;
  onRefresh: () => void;
  uploading?: boolean;
  loading?: boolean;
  accept?: string;
}

export default function FileManagerToolbar({
  canManage,
  search,
  onSearchChange,
  onFilesSelected,
  onCreateFolder,
  onRefresh,
  uploading = false,
  loading = false,
  accept,
}: FileManagerToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {canManage && (
        <>
          <input
            ref={inputRef}
            type='file'
            multiple
            accept={accept}
            className='hidden'
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              if (files.length) onFilesSelected(files);
              event.target.value = '';
            }}
          />

          <Button type='button' size='sm' className='h-9 rounded-lg' disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <Spinner /> : <Upload />}
            آپلود فایل
          </Button>

          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-9 rounded-lg border-gray-2 text-secondary-1'
            disabled={uploading}
            onClick={onCreateFolder}>
            <FolderPlus />
            پوشه جدید
          </Button>
        </>
      )}

      <Button
        type='button'
        variant='outline'
        size='icon-sm'
        className='h-9 w-9 rounded-lg border-gray-2 text-secondary-2'
        title='بروزرسانی'
        disabled={loading}
        onClick={onRefresh}>
        {loading ? <Spinner /> : <RefreshCw />}
      </Button>

      <div className='relative ms-auto min-w-40 flex-1 sm:max-w-64'>
        <Search className='pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-secondary-3' aria-hidden='true' />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder='جستجو در این پوشه...'
          className='h-9 ps-8'
        />
      </div>
    </div>
  );
}
