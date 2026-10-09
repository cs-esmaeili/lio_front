'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchStatus } from 'iconsax-reactjs';
import Icon from '@/components/global/Icon';
import { useSearch } from '@/hooks/useSearch';
import SearchResults from '@/components/search/SearchResults';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useBackdropPortal } from '@/hooks/useBackdropPortal';
import { buildProductsSearchUrl } from '@/utils/shop/urlHelpers';
import SearchInputHeader from '../search/SearchInputHeader';

type Props = {
  variant?: 'icon' | 'bar';
};

export default function SearchPopover({ variant = 'bar' }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const openTimeout = useRef<NodeJS.Timeout | null>(null);

  const { query, setQuery, results, loading, clearSearch } = useSearch();

  // click outside = close + clear
  useClickOutside(wrapperRef, () => {
    setOpen(false);
    clearSearch();
  });

  // -------------------------
  // OPEN (hover delay)
  // -------------------------
  const handleOpenPopover = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }

    if (openTimeout.current) {
      clearTimeout(openTimeout.current);
    }

    openTimeout.current = setTimeout(() => {
      setOpen(true);
    }, 150);
  };

  // -------------------------
  // CLOSE (hover delay)
  // -------------------------
  const handleClosePopover = () => {
    if (query.trim()) return;

    if (openTimeout.current) {
      clearTimeout(openTimeout.current);
      openTimeout.current = null;
    }

    closeTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const handlePanelMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const handlePanelMouseLeave = () => {
    if (!query.trim()) {
      handleClosePopover();
    }
  };

  const handleItemClick = () => {
    setOpen(false);
    clearSearch();
  };

  const handleSubmit = () => {
    if (!query.trim()) return;

    setOpen(false);
    clearSearch();
    router.push(buildProductsSearchUrl(query));
  };

  // cleanup timers
  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      if (openTimeout.current) clearTimeout(openTimeout.current);
    };
  }, []);

  const Backdrop = useBackdropPortal(open);

  return (
    <div ref={wrapperRef} className='relative'>
      {/* trigger */}
      {variant === 'bar' ? (
        <button
          type='button'
          onClick={() => setOpen(true)}
          aria-label='جستجو'
          className='flex h-10 w-full cursor-pointer items-center gap-3 rounded-md border border-gray-2 bg-custom-white px-3 text-secondary-2 transition-colors'>
          <Icon IconComponent={SearchStatus} className='text-secondary-2' size={18} aria-hidden='true' variant='Linear' />
          <span className='text-sm'>جستجو کنید</span>
        </button>
      ) : (
        <div
          onMouseEnter={handleOpenPopover}
          onMouseLeave={handleClosePopover}
          className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-primary-3 hover:rounded-full hover:bg-primary-3/80'>
          <Icon
            IconComponent={SearchStatus}
            className='text-secondary-black-3'
            size={24}
            variant='TwoTone'
            toneTwoColor='--color-primary-1'
          />
        </div>
      )}

      {/* panel */}
      {open && (
        <div
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={variant === 'icon' ? handlePanelMouseLeave : undefined}
          className='absolute left-0 right-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-lg border border-gray-2 bg-custom-white p-3 shadow-xl'>
          <SearchInputHeader
            value={query}
            onChange={(val) => {
              setQuery(val);
              if (val.trim() && !open) setOpen(true);
            }}
            onClear={clearSearch}
            onSubmit={handleSubmit}
          />

          <SearchResults items={results} query={query} loading={loading} onItemClick={handleItemClick} />
        </div>
      )}
      {Backdrop}
    </div>
  );
}
