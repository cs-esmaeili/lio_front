'use client';

import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

import FileManagerDialog from '@/components/admin/file-manager/FileManagerDialog';
import type { SelectedFile } from '@/components/admin/file-manager/file-manager.model';
import { Button } from '@/components/shadcn/button';

interface ImagePickerFieldProps {
  label: string;
  value: SelectedFile | null;
  onChange: (file: SelectedFile | null) => void;
  disabled?: boolean;
}

/** Image field that picks a file through the shared file-manager dialog. */
export default function ImagePickerField({ label, value, onChange, disabled = false }: ImagePickerFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex flex-col gap-2'>
      <span className='text-sm text-secondary-1'>{label}</span>

      <div className='flex items-center gap-3'>
        <div className='grid size-20 shrink-0 place-content-center overflow-hidden rounded-lg border border-gray-2 bg-gray-1'>
          {value?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt={label} className='h-full w-full object-cover' />
          ) : (
            <ImagePlus className='text-secondary-3' size={22} aria-hidden='true' />
          )}
        </div>

        <div className='flex items-center gap-1'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-9 rounded-lg border-gray-2'
            disabled={disabled}
            onClick={() => setOpen(true)}>
            {value ? 'تغییر تصویر' : 'انتخاب تصویر'}
          </Button>

          {value && !disabled && (
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
              title='حذف تصویر'
              onClick={() => onChange(null)}>
              <X />
            </Button>
          )}
        </div>
      </div>

      <FileManagerDialog
        open={open}
        onOpenChange={setOpen}
        title={`انتخاب ${label}`}
        accept='image/*'
        onSelect={(files) => {
          if (files[0]) onChange(files[0]);
          setOpen(false);
        }}
      />
    </div>
  );
}
