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

export default function SearchPopover() {
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
    <div ref={wrapperRef}>
      {/* trigger */}
      <div
        onMouseEnter={handleOpenPopover}
        onMouseLeave={handleClosePopover}
        className='flex items-center justify-center rounded-lg bg-primary-3 w-9 h-9 relative cursor-pointer hover:bg-primary-3/80  hover:rounded-full'>
        <Icon IconComponent={SearchStatus} className='text-secondary-black-3' size={24} variant='TwoTone' toneTwoColor='--color-primary-1' />
      </div>

      {/* panel */}
      {open && (
        <div
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
          className='absolute top-full left-0 right-0  rounded-2xl bg-secondary-black-3 shadow-2xl z-51 h-30 w-full'>
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
