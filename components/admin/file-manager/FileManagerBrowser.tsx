'use client';

import { useMemo, useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { toast } from 'sonner';

import { Progress } from '@/components/shadcn/progress';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useFileList } from '@/hooks/file-manager/useFileList';
import { useUploadFiles } from '@/hooks/file-manager/useUploadFiles';
import { useDeleteFile } from '@/hooks/file-manager/useDeleteFile';
import { useDeleteFolder } from '@/hooks/file-manager/useDeleteFolder';

import FileManagerBreadcrumb from './FileManagerBreadcrumb';
import FileManagerToolbar from './FileManagerToolbar';
import FileManagerGrid from './FileManagerGrid';
import CreateFolderModal from './CreateFolderModal';
import ConfirmDeleteModal, { type DeleteTarget } from './ConfirmDeleteModal';
import { entryKey, entryToSelectedFile, matchesAccept, type SelectedFile } from './file-manager.model';
import type { FileEntry, FileFolderEntry, FileItemEntry } from '@/typescript/schemas/file-manager.schema';

export interface FileManagerBrowserProps {
  /** Folder to open first. Defaults to the root. */
  initialPath?: string;
  /** Enable selection of files. */
  selectable?: boolean;
  /** Allow selecting more than one file. */
  multiple?: boolean;
  /** `accept` filter — matching files only can be selected. */
  accept?: string;
  /** Show management actions (upload / create folder / delete). Default `true`. */
  canManage?: boolean;
  /** Called with the normalized selection whenever it changes. */
  onSelectionChange?: (files: SelectedFile[]) => void;
  /** Called after a successful upload. */
  onUploaded?: (files: SelectedFile[]) => void;
  /** Called when a file is opened in browse mode. */
  onOpenFile?: (file: SelectedFile) => void;
  className?: string;
}

export default function FileManagerBrowser({
  initialPath = '',
  selectable,
  multiple = false,
  accept,
  canManage = true,
  onSelectionChange,
  onUploaded,
  onOpenFile,
  className = 'h-[70vh]',
}: FileManagerBrowserProps) {
  const [path, setPath] = useState(initialPath);
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<SelectedFile[]>([]);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FileEntry | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { entries, loading, error, refetch } = useFileList(path);
  const { upload, loading: uploading, progress } = useUploadFiles();
  const { deleteFile, loading: deletingFile } = useDeleteFile();
  const { deleteFolder, loading: deletingFolder } = useDeleteFolder();
  const { copy } = useCopyToClipboard({ successMessage: 'نشانی فایل کپی شد' });

  const canSelect = selectable ?? Boolean(onSelectionChange);
  const committing = deletingFile || deletingFolder;

  const selectedKeys = useMemo(() => new Set(selection.map((file) => `file:${file.path}`)), [selection]);

  const visibleEntries = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term ? entries.filter((entry) => entry.name.toLowerCase().includes(term)) : entries;

    return [...filtered].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name, 'fa');
    });
  }, [entries, search]);

  // --------------------------------------------------------
  //  Selection helpers
  // --------------------------------------------------------

  const commitSelection = (next: SelectedFile[]) => {
    setSelection(next);
    onSelectionChange?.(next);
  };

  const toggleSelect = (entry: FileItemEntry) => {
    const key = entryKey(entry);
    const file = entryToSelectedFile(entry);
    if (!file) return;

    const exists = selectedKeys.has(key);
    if (exists) {
      commitSelection(selection.filter((item) => `file:${item.path}` !== key));
      return;
    }

    const next = multiple ? [...selection, file] : [file];
    commitSelection(next);
  };

  const handleNavigate = (nextPath: string) => {
    setPath(nextPath);
    setSearch('');
    if (selection.length) commitSelection([]);
  };

  const handleUpload = async (files: File[]) => {
    const uploaded = await upload(path, files);
    if (!uploaded) return;

    toast.success(`${uploaded.length.toLocaleString('fa-IR')} فایل آپلود شد.`);
    await refetch();
    onUploaded?.(uploaded);
  };

  const requestDelete = (entry: FileEntry) => setDeleteTarget(entry);

  const handleDeleteFile = async (entry: FileItemEntry) => {
    if (entry.id == null) {
      toast.error('این فایل در پایگاه داده ثبت نشده و قابل حذف نیست.');
      return null;
    }
    return deleteFile(entry.id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const key = entryKey(deleteTarget);
    setDeletingKey(key);

    const result =
      deleteTarget.type === 'folder' ? await deleteFolder(deleteTarget.path) : await handleDeleteFile(deleteTarget);

    setDeletingKey(null);
    if (!result) return;

    toast.success(deleteTarget.type === 'folder' ? 'پوشه حذف شد.' : 'فایل حذف شد.');
    commitSelection(selection.filter((file) => file.path !== deleteTarget.path));
    setDeleteTarget(null);
    await refetch();
  };

  // --------------------------------------------------------
  //  Drag & drop
  // --------------------------------------------------------

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (!canManage || uploading) return;

    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length) void handleUpload(files);
  };

  const allowDrag = canManage;

  // --------------------------------------------------------
  //  Derived
  // --------------------------------------------------------

  const deleteTargetInfo: DeleteTarget | null = deleteTarget
    ? { type: deleteTarget.type, name: deleteTarget.name }
    : null;

  const emptyHint = search.trim() ? 'فایلی با این نام پیدا نشد.' : 'این پوشه خالی است.';

  const acceptingMatch = accept ? (entry: FileItemEntry) => matchesAccept(entry, accept) : undefined;

  return (
    <div
      className={`flex flex-col bg-background ${className}`}
      onDragOver={(event) => {
        if (!allowDrag) return;
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return;
        setDragActive(false);
      }}
      onDrop={handleDrop}>
      {/* Header: breadcrumb + actions */}
      <div className='flex shrink-0 flex-col gap-3 border-b border-gray-1 px-4 py-3'>
        <FileManagerBreadcrumb path={path} onNavigate={handleNavigate} disabled={loading} />

        <FileManagerToolbar
          canManage={canManage}
          search={search}
          onSearchChange={setSearch}
          onFilesSelected={(files) => void handleUpload(files)}
          onCreateFolder={() => setCreateFolderOpen(true)}
          onRefresh={() => void refetch()}
          uploading={uploading}
          loading={loading}
          accept={accept}
        />

        {accept && canSelect && (
          <p className='text-caption text-secondary-3'>فقط فایل‌های مطابق فیلتر «{accept}» قابل انتخاب هستند.</p>
        )}

        {uploading && (
          <div className='flex flex-col gap-1'>
            <span className='text-caption text-secondary-2'>در حال آپلود... {progress.toLocaleString('fa-IR')}٪</span>
            <Progress value={progress} />
          </div>
        )}
      </div>

      {/* Selection summary */}
      {canSelect && selection.length > 0 && (
        <div className='flex shrink-0 items-center justify-between gap-2 border-b border-gray-1 bg-primary-4/50 px-4 py-2'>
          <span className='text-caption text-primary-1'>{selection.length.toLocaleString('fa-IR')} فایل انتخاب شده</span>
          <button type='button' className='text-caption text-secondary-2 underline-offset-2 hover:underline' onClick={() => commitSelection([])}>
            پاک کردن انتخاب
          </button>
        </div>
      )}

      {/* Body */}
      <div className='relative min-h-0 flex-1 overflow-y-auto p-4'>
        <FileManagerGrid
          entries={visibleEntries}
          selectedKeys={selectedKeys}
          selectable={canSelect}
          canManage={canManage}
          acceptingMatch={acceptingMatch}
          loading={loading}
          error={error}
          emptyHint={emptyHint}
          deletingKey={deletingKey}
          onRetry={() => void refetch()}
          onOpenFolder={(entry: FileFolderEntry) => handleNavigate(entry.path)}
          onToggleSelect={toggleSelect}
          onDelete={requestDelete}
          onCopyUrl={(file) => void copy(file.url)}
          onOpenFile={onOpenFile}
        />

        {/* Drag & drop overlay */}
        {dragActive && allowDrag && (
          <div className='pointer-events-none absolute inset-3 grid place-content-center gap-3 rounded-2xl border-2 border-dashed border-primary-1 bg-primary-4/80 text-center'>
            <CloudUpload className='mx-auto text-primary-1' size={40} aria-hidden='true' />
            <span className='text-regular font-medium text-primary-1'>فایل‌ها را برای آپلود رها کنید</span>
          </div>
        )}
      </div>

      {/* Modals */}
      {canManage && (
        <>
          <CreateFolderModal
            open={createFolderOpen}
            onOpenChange={setCreateFolderOpen}
            parentPath={path}
            onCreated={() => void refetch()}
          />

          <ConfirmDeleteModal
            open={deleteTarget !== null}
            onOpenChange={(open) => {
              if (!open) setDeleteTarget(null);
            }}
            target={deleteTargetInfo}
            loading={committing && deletingKey !== null}
            onConfirm={() => void handleConfirmDelete()}
          />
        </>
      )}
    </div>
  );
}
