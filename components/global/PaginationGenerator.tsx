'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useLiveSearchParams, shallowReplace } from '@/hooks/useShallowUrl';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/shadcn/pagination';

interface PaginationGeneratorProps {
  pagination: {
    current_page: number;
    last_page: number;
  };
  onChange?: (page: number) => void;
  autoUpdateUrl?: boolean;
}

export function PaginationGenerator({ pagination, onChange, autoUpdateUrl = false }: PaginationGeneratorProps) {
  const { current_page, last_page } = pagination;
  const query = useLiveSearchParams();
  const pathname = usePathname();
  const urlPage = query.get('page');
  const activePage = urlPage ? Number(urlPage) : current_page;

  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (last_page <= 7) {
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (current_page > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, current_page - 1);
    const end = Math.min(last_page - 1, current_page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current_page < last_page - 2) {
      pages.push('ellipsis');
    }

    pages.push(last_page);

    return pages;
  };

  const pages = useMemo(() => generatePages(), [current_page, last_page]);

  const handlePageChange = (page: number) => {
    if (autoUpdateUrl) {
      const next = new URLSearchParams(query.toString());
      next.set('page', String(page));
      shallowReplace(`${pathname}?${next.toString()}`);
    }
    onChange?.(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className='flex text-primary-2'>
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (activePage > 1) {
                handlePageChange(activePage - 1);
              }
            }}
            className={activePage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`} className='flex text-primary-2'>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href='#'
                isActive={page === activePage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page as number);
                }}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem className='flex text-primary-2'>
          <PaginationNext
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (activePage < last_page) {
                handlePageChange(activePage + 1);
              }
            }}
            className={activePage === last_page ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
