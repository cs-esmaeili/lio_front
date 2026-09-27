'use client';

import {
  File as FileIcon,
  FileArchive,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  Film,
  Music,
} from 'lucide-react';

import { getFileExtension, isImageFile, isPdfFile } from './file-manager.model';

interface FileTypeIconProps {
  name: string;
  mimeType?: string;
  size?: number;
  className?: string;
}

const TEXT_EXTENSIONS = ['txt', 'md', 'csv', 'log', 'rtf'];
const CODE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'scss', 'xml', 'yml', 'yaml', 'sh', 'py'];
const ARCHIVE_EXTENSIONS = ['zip', 'rar', '7z', 'tar', 'gz'];
const SHEET_EXTENSIONS = ['xls', 'xlsx', 'ods', 'numbers'];
const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
const VIDEO_EXTENSIONS = ['mp4', 'mkv', 'mov', 'avi', 'webm'];

/** Icon matching the file's mime type / extension. */
export default function FileTypeIcon({ name, mimeType, size = 24, className }: FileTypeIconProps) {
  const iconProps = { size, className, 'aria-hidden': true } as const;

  if (isImageFile({ name, mimeType })) return <FileImage {...iconProps} />;
  if (isPdfFile({ name, mimeType })) return <FileText {...iconProps} />;

  const mime = (mimeType ?? '').toLowerCase();
  const extension = getFileExtension(name);

  if (mime.startsWith('audio/') || AUDIO_EXTENSIONS.includes(extension)) return <Music {...iconProps} />;
  if (mime.startsWith('video/') || VIDEO_EXTENSIONS.includes(extension)) return <Film {...iconProps} />;
  if (mime.includes('zip') || mime.includes('compressed') || ARCHIVE_EXTENSIONS.includes(extension)) {
    return <FileArchive {...iconProps} />;
  }
  if (mime.includes('spreadsheet') || SHEET_EXTENSIONS.includes(extension)) return <FileSpreadsheet {...iconProps} />;
  if (
    mime.includes('json') ||
    mime.includes('javascript') ||
    mime.includes('xml') ||
    CODE_EXTENSIONS.includes(extension)
  ) {
    return <FileCode {...iconProps} />;
  }
  if (mime.startsWith('text/') || TEXT_EXTENSIONS.includes(extension)) return <FileText {...iconProps} />;

  return <FileIcon {...iconProps} />;
}
