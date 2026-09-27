import { resolveFileUrl } from '@/utils/fileUrl';
import type { FileEntry, UploadedFile } from '@/typescript/schemas/file-manager.schema';

/**
 * Normalized file shape handed back to callers of the file manager.
 * `url` is always resolved through `resolveFileUrl` so consumers can render it
 * directly, regardless of whether the API returned an absolute or relative URL.
 */
export interface SelectedFile {
  id?: number;
  name: string;
  path: string;
  url: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** `path` → `a/b/c` becomes `[{ name: 'ریشه', path: '' }, { name: 'a', path: 'a' }, ...]`. */
export function buildBreadcrumbs(path: string, rootLabel = 'ریشه'): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ name: rootLabel, path: '' }];
  if (!path) return items;

  let current = '';
  for (const segment of path.split('/').filter(Boolean)) {
    current = current ? `${current}/${segment}` : segment;
    items.push({ name: segment, path: current });
  }
  return items;
}

/** Parent folder of a path (`a/b/c` → `a/b`, `a` → `''`). */
export function getParentPath(path: string): string {
  const index = path.lastIndexOf('/');
  return index === -1 ? '' : path.slice(0, index);
}

/** Join a folder path and an entry name. */
export function joinPath(parent: string, name: string): string {
  return parent ? `${parent}/${name}` : name;
}

export function getFileExtension(name: string): string {
  const index = name.lastIndexOf('.');
  return index === -1 ? '' : name.slice(index + 1).toLowerCase();
}

export function isImageFile(file: { mimeType?: string; name: string }): boolean {
  if (file.mimeType) return file.mimeType.startsWith('image/');
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg', 'bmp'].includes(getFileExtension(file.name));
}

export function isPdfFile(file: { mimeType?: string; name: string }): boolean {
  if (file.mimeType) return file.mimeType === 'application/pdf';
  return getFileExtension(file.name) === 'pdf';
}

export function formatFileSize(bytes?: number): string {
  if (bytes == null || Number.isNaN(bytes)) return '—';
  if (bytes === 0) return '۰ بایت';

  const units = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  const rounded = value >= 10 || exponent === 0 ? Math.round(value) : Math.round(value * 10) / 10;

  return `${rounded.toLocaleString('fa-IR')} ${units[exponent]}`;
}

/**
 * Checks a file against an `accept` string (`image/*,.pdf,image/png`).
 * An empty `accept` matches everything.
 */
export function matchesAccept(file: { mimeType?: string; name: string }, accept?: string): boolean {
  const tokens = accept
    ?.split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (!tokens?.length) return true;

  const mimeType = (file.mimeType ?? '').toLowerCase();
  const extension = `.${getFileExtension(file.name)}`;

  return tokens.some((token) => {
    if (token.startsWith('.')) return extension === token;
    if (token.endsWith('/*')) return mimeType.startsWith(token.slice(0, -1));
    return mimeType === token;
  });
}

/** Convert an uploaded record into the normalized shape (resolving its URL). */
export function fromUploadedFile(file: UploadedFile): SelectedFile {
  return {
    id: file.id,
    name: file.originalName,
    path: file.path,
    url: resolveFileUrl(file.url) ?? '',
    mimeType: file.mimeType,
    size: file.size,
    createdAt: file.createdAt,
  };
}

/** Convert a `GET /files` entry into the normalized shape (`null` for folders). */
export function entryToSelectedFile(entry: FileEntry): SelectedFile | null {
  if (entry.type !== 'file') return null;

  return {
    id: entry.id,
    name: entry.name,
    path: entry.path,
    url: resolveFileUrl(entry.url) ?? '',
    mimeType: entry.mimeType,
    size: entry.size,
    createdAt: entry.createdAt,
  };
}

/** Stable key for lists — paths are unique inside a directory. */
export function entryKey(entry: FileEntry): string {
  return `${entry.type}:${entry.path}`;
}
