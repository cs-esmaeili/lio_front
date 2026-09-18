'use client';

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
import type { Pagination as PaginationModel } from '@/typescript/schemas/pagination.schema';

export function PaginationGenerator({
  pagination,
  onChange,
  autoUpdateUrl = false,
}: {
  pagination: PaginationModel;
  onChange?: (page: number) => void;
  autoUpdateUrl?: boolean;
}) {
  const { page, totalPages } = pagination;
  const query = useLiveSearchParams();
  const pathname = usePathname();
  const urlPage = query.get('page');
  const activePage = urlPage ? Number(urlPage) : page;

  const generatePages = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (activePage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, activePage - 1);
    const end = Math.min(totalPages - 1, activePage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (activePage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = generatePages();

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
                  handlePageChange(page);
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
              if (activePage < totalPages) {
                handlePageChange(activePage + 1);
              }
            }}
            className={activePage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
