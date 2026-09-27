'use client';

import { CircleAlert, FolderOpen } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import FileManagerItem from './FileManagerItem';
import { entryKey, type SelectedFile } from './file-manager.model';
import type { FileEntry, FileFolderEntry, FileItemEntry } from '@/typescript/schemas/file-manager.schema';

interface FileManagerGridProps {
  entries: FileEntry[];
  selectedKeys: Set<string>;
  selectable: boolean;
  canManage: boolean;
  acceptingMatch?: (entry: FileItemEntry) => boolean;
  loading: boolean;
  error: string | null;
  emptyHint: string;
  deletingKey: string | null;
  onRetry: () => void;
  onOpenFolder: (entry: FileFolderEntry) => void;
  onToggleSelect: (entry: FileItemEntry) => void;
  onDelete: (entry: FileEntry) => void;
  onCopyUrl?: (file: SelectedFile) => void;
  onOpenFile?: (file: SelectedFile) => void;
}

export default function FileManagerGrid({
  entries,
  selectedKeys,
  selectable,
  canManage,
  acceptingMatch,
  loading,
  error,
  emptyHint,
  deletingKey,
  onRetry,
  onOpenFolder,
  onToggleSelect,
  onDelete,
  onCopyUrl,
  onOpenFile,
}: FileManagerGridProps) {
  if (loading && entries.length === 0) {
    return (
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className='h-44 animate-pulse rounded-xl border border-gray-1 bg-gray-1/60' />
        ))}
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-2 py-14 text-center'>
        <CircleAlert className='text-destructive' size={32} aria-hidden='true' />
        <p className='text-regular text-secondary-1'>{error}</p>
        <Button type='button' variant='outline' size='sm' className='rounded-lg' onClick={onRetry}>
          تلاش دوباره
        </Button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-2 py-14 text-center'>
        <FolderOpen className='text-secondary-3' size={36} aria-hidden='true' />
        <p className='text-regular text-secondary-2'>{emptyHint}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 transition-opacity sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        loading && 'opacity-60',
      )}>
      {entries.map((entry) => {
        const key = entryKey(entry);
        return (
          <FileManagerItem
            key={key}
            entry={entry}
            selected={selectedKeys.has(key)}
            selectable={selectable}
            disabled={entry.type === 'file' && acceptingMatch ? !acceptingMatch(entry) : false}
            canManage={canManage}
            deleting={deletingKey === key}
            onOpenFolder={onOpenFolder}
            onToggleSelect={onToggleSelect}
            onDelete={onDelete}
            onCopyUrl={onCopyUrl}
            onOpenFile={onOpenFile}
          />
        );
      })}
    </div>
  );
}
