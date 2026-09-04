'use client';

import { useRef, useState } from 'react';

interface AttachmentProps {
  onFileSelect: (file: File | undefined) => void;
}

export default function Attachment({ onFileSelect }: AttachmentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName(null);
      onFileSelect(undefined);
    }
  };

  const handleRemove = () => {
    setFileName(null);
    onFileSelect(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <span className='text-sm text-secondary-2'>پیوست فایل (تصویر رسید پرداخت)</span>

      {fileName ? (
        <div className='flex items-center justify-between gap-2 border border-green-200 bg-green-50 rounded-lg p-3'>
          <span className='text-sm text-green-700 truncate'>{fileName}</span>
          <button
            type='button'
            onClick={handleRemove}
            className='text-gray-400 hover:text-red-500 transition-colors shrink-0'
            aria-label='حذف فایل'
          >
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M15 5L5 15M5 5L15 15' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type='button'
          onClick={() => inputRef.current?.click()}
          className='flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg p-4 text-sm text-secondary-2 hover:border-primary-1 hover:text-primary-1 transition-colors'
        >
          <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M5.83333 8.33333L10 4.16667M10 4.16667L14.1667 8.33333M10 4.16667V12.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
          انتخاب فایل
        </button>
      )}

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />
    </div>
  );
}
