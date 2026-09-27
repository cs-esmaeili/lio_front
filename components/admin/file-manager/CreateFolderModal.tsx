'use client';

import { useState } from 'react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useCreateFolder } from '@/hooks/file-manager/useCreateFolder';

interface CreateFolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Folder the new folder is created inside (`''` = root). */
  parentPath: string;
  onCreated?: (path: string) => void;
}

export default function CreateFolderModal({ open, onOpenChange, parentPath, onCreated }: CreateFolderModalProps) {
  const { createFolder, loading } = useCreateFolder();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setName('');
      setError(null);
    }
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setError('نام پوشه را وارد کنید.');
      return;
    }
    if (trimmed.includes('/') || trimmed.includes('\\')) {
      setError('نام پوشه نمی‌تواند شامل «/» باشد.');
      return;
    }

    const path = parentPath ? `${parentPath}/${trimmed}` : trimmed;
    const result = await createFolder(path);
    if (!result) return;

    onCreated?.(result.path);
    handleOpenChange(false);
  };

  const footer = (
    <div className='flex flex-row items-center justify-end gap-3'>
      <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={loading} onClick={() => handleOpenChange(false)}>
        انصراف
      </Button>

      <Button type='button' className='h-11 rounded-xl px-6' disabled={loading} onClick={handleSubmit}>
        {loading && <Spinner />}
        ایجاد پوشه
      </Button>
    </div>
  );

  return (
    <ReusableModal open={open} onOpenChange={handleOpenChange} title='پوشه جدید' footer={footer} size='sm'>
      <div className='flex flex-col gap-2'>
        <label className='text-sm text-secondary-1'>نام پوشه</label>

        <Input
          autoFocus
          value={name}
          className='h-11'
          placeholder='مثلا banners'
          maxLength={64}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void handleSubmit();
            }
          }}
        />

        {error && <p className='text-xs text-custom-red'>{error}</p>}

        <p className='text-caption text-secondary-3'>
          مسیر: <span dir='ltr' className='font-medium text-secondary-1'>{parentPath ? `${parentPath}/${name.trim() || '...'}` : name.trim() || '...'}</span>
        </p>
      </div>
    </ReusableModal>
  );
}
