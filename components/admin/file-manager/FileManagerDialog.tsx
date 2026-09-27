'use client';

import { useState } from 'react';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Button } from '@/components/shadcn/button';
import FileManagerBrowser from './FileManagerBrowser';
import type { SelectedFile } from './file-manager.model';

export interface FileManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Modal title. */
  title?: string;
  /** Folder to open first. Defaults to the root. */
  initialPath?: string;
  /** Enable selection. Defaults to `true` when `onSelect`/`onSelectionChange` is provided. */
  selectable?: boolean;
  /** Allow selecting more than one file. */
  multiple?: boolean;
  /** `accept` filter — matching files only can be selected. */
  accept?: string;
  /** Show management actions (upload / create folder / delete). Default `true`. */
  canManage?: boolean;
  /** Files selection when the user confirms. */
  onSelect?: (files: SelectedFile[]) => void;
  /** Live selection changes. */
  onSelectionChange?: (files: SelectedFile[]) => void;
  /** Called after a successful upload. */
  onUploaded?: (files: SelectedFile[]) => void;
  /** Called when a file is opened in browse mode. */
  onOpenFile?: (file: SelectedFile) => void;
  /** Close the dialog after `onSelect`. Default `true`. */
  closeOnSelect?: boolean;
  /** Modal width. */
  size?: 'md' | 'lg' | 'xl';
}

/**
 * Modal wrapper around `FileManagerBrowser`.
 *
 * Drop it anywhere and drive it entirely through props:
 * `open`/`onOpenChange` for visibility and `onSelect`/`onSelectionChange` for
 * the chosen files. Omit `onSelect` to use it as a pure file manager.
 */
export default function FileManagerDialog({
  open,
  onOpenChange,
  title,
  initialPath = '',
  selectable,
  multiple = false,
  accept,
  canManage = true,
  onSelect,
  onSelectionChange,
  onUploaded,
  onOpenFile,
  closeOnSelect = true,
  size = 'xl',
}: FileManagerDialogProps) {
  const [selection, setSelection] = useState<SelectedFile[]>([]);
  const canSelect = selectable ?? Boolean(onSelect || onSelectionChange);

  const handleOpenChange = (next: boolean) => {
    if (!next) setSelection([]);
    onOpenChange(next);
  };

  const handleConfirm = () => {
    if (!selection.length) return;
    onSelect?.(selection);
    if (closeOnSelect) handleOpenChange(false);
  };

  const footer = canSelect ? (
    <div className='flex flex-row items-center justify-between gap-3'>
      <span className='text-caption text-secondary-2'>
        {selection.length > 0 ? `${selection.length.toLocaleString('fa-IR')} فایل انتخاب شده` : 'فایلی انتخاب نشده است'}
      </span>

      <div className='flex flex-row items-center gap-3'>
        <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' onClick={() => handleOpenChange(false)}>
          انصراف
        </Button>

        <Button type='button' className='h-11 rounded-xl px-6' disabled={selection.length === 0} onClick={handleConfirm}>
          {multiple ? 'افزودن انتخاب‌شده‌ها' : 'انتخاب'}
        </Button>
      </div>
    </div>
  ) : undefined;

  return (
    <ReusableModal
      open={open}
      onOpenChange={handleOpenChange}
      title={title ?? (canSelect ? 'انتخاب فایل' : 'مدیریت فایل‌ها')}
      footer={footer}
      size={size}
      contentClassName='!p-0'>
      <FileManagerBrowser
        initialPath={initialPath}
        selectable={canSelect}
        multiple={multiple}
        accept={accept}
        canManage={canManage}
        onSelectionChange={(files) => {
          setSelection(files);
          onSelectionChange?.(files);
        }}
        onUploaded={onUploaded}
        onOpenFile={onOpenFile}
        className='h-[65vh]'
      />
    </ReusableModal>
  );
}
