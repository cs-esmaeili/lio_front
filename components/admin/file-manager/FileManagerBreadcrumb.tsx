'use client';

import { ChevronLeft, Folder } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buildBreadcrumbs } from './file-manager.model';

interface FileManagerBreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
  disabled?: boolean;
}

/** RTL breadcrumb for the current folder. */
export default function FileManagerBreadcrumb({ path, onNavigate, disabled = false }: FileManagerBreadcrumbProps) {
  const items = buildBreadcrumbs(path);

  return (
    <nav aria-label='مسیر پوشه' className='flex min-w-0 items-center gap-1 overflow-x-auto text-sm'>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.path || 'root'} className='flex shrink-0 items-center gap-1'>
            {index > 0 && <ChevronLeft size={16} className='text-secondary-3' aria-hidden='true' />}

            <button
              type='button'
              disabled={disabled || isLast}
              onClick={() => onNavigate(item.path)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors',
                isLast
                  ? 'cursor-default font-medium text-secondary-black-3'
                  : 'text-secondary-2 hover:bg-gray-1 hover:text-primary-1',
                disabled && 'cursor-not-allowed opacity-60',
              )}>
              {index === 0 && <Folder size={16} aria-hidden='true' />}
              <span dir='auto'>{item.name}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
