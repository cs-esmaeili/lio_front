'use client';

import { useState } from 'react';
import { CircleCheck, Copy, Folder, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { resolveFileUrl } from '@/utils/fileUrl';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { formatFileSize, isImageFile, type SelectedFile } from './file-manager.model';
import FileTypeIcon from './FileTypeIcon';
import type { FileEntry, FileFolderEntry, FileItemEntry } from '@/typescript/schemas/file-manager.schema';

interface FileManagerItemProps {
  entry: FileEntry;
  selected: boolean;
  selectable: boolean;
  /** Blocked by the `accept` filter — shown but not selectable. */
  disabled?: boolean;
  canManage: boolean;
  deleting?: boolean;
  onOpenFolder: (entry: FileFolderEntry) => void;
  onToggleSelect: (entry: FileItemEntry) => void;
  onDelete: (entry: FileEntry) => void;
  onCopyUrl?: (file: SelectedFile) => void;
  onOpenFile?: (file: SelectedFile) => void;
}

export default function FileManagerItem({
  entry,
  selected,
  selectable,
  disabled = false,
  canManage,
  deleting = false,
  onOpenFolder,
  onToggleSelect,
  onDelete,
  onCopyUrl,
  onOpenFile,
}: FileManagerItemProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isFolder = entry.type === 'folder';
  const file = entry.type === 'file' ? entry : null;
  const imageUrl = file && isImageFile(file) && !imageFailed ? resolveFileUrl(file.url) : null;

  const selectedFile: SelectedFile | null = file
    ? {
        id: file.id,
        name: file.name,
        path: file.path,
        url: resolveFileUrl(file.url) ?? '',
        mimeType: file.mimeType,
        size: file.size,
        createdAt: file.createdAt,
      }
    : null;

  const handleActivate = () => {
    if (isFolder) {
      onOpenFolder(entry);
      return;
    }
    if (selectable && !disabled) {
      onToggleSelect(entry);
      return;
    }
    if (selectedFile && onOpenFile) onOpenFile(selectedFile);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      aria-pressed={selectable && !isFolder ? selected : undefined}
      aria-disabled={disabled || undefined}
      onClick={handleActivate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleActivate();
        }
      }}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-custom-white transition-all outline-none',
        'focus-visible:ring-3 focus-visible:ring-primary-1/50',
        selected ? 'border-primary-1 ring-2 ring-primary-1/30' : 'border-gray-1 hover:border-primary-3 hover:shadow-sm',
        disabled && 'cursor-not-allowed opacity-45 hover:border-gray-1 hover:shadow-none',
        deleting && 'pointer-events-none opacity-50',
      )}>
      {/* Thumbnail / icon */}
      <div className='relative flex h-28 items-center justify-center overflow-hidden bg-gray-1/60'>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={entry.name}
            loading='lazy'
            className='h-full w-full object-cover'
            onError={() => setImageFailed(true)}
          />
        ) : isFolder ? (
          <Folder className='text-primary-2' size={40} aria-hidden='true' />
        ) : (
          <FileTypeIcon name={entry.name} mimeType={file?.mimeType} size={40} className='text-secondary-2' />
        )}

        {deleting && (
          <div className='absolute inset-0 grid place-content-center bg-custom-white/60'>
            <Spinner className='text-primary-1' />
          </div>
        )}

        {/* Selection indicator */}
        {selectable && !isFolder && (
          <span
            className={cn(
              'absolute top-2 end-2 grid size-6 place-content-center rounded-full border transition-colors',
              selected ? 'border-primary-1 bg-primary-1 text-custom-white' : 'border-custom-white bg-custom-white/80 text-transparent',
              disabled && 'opacity-50',
            )}>
            <CircleCheck size={16} aria-hidden='true' />
          </span>
        )}
      </div>

      {/* Meta */}
      <div className='flex min-w-0 flex-col gap-1 px-3 py-2.5'>
        <span className='truncate text-sm font-medium text-secondary-black-3' title={entry.name} dir='auto'>
          {entry.name}
        </span>
        <span className='text-caption text-secondary-2'>
          {isFolder ? 'پوشه' : file?.size != null ? formatFileSize(file.size) : 'فایل'}
        </span>
      </div>

      {/* Row actions */}
      <div className='absolute top-2 start-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100'>
        {file && onCopyUrl && (
          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            className='bg-custom-white/85 text-secondary-2 hover:bg-custom-white hover:text-primary-1'
            title='کپی نشانی فایل'
            onClick={(event) => {
              event.stopPropagation();
              const resolved = selectedFile;
              if (resolved) onCopyUrl(resolved);
            }}>
            <Copy />
          </Button>
        )}

        {canManage && (
          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            className='bg-custom-white/85 text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
            title='حذف'
            onClick={(event) => {
              event.stopPropagation();
              onDelete(entry);
            }}>
            <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
}
