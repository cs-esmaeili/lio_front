'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
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
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const router = useRouter();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, results, loading, clearSearch } = useSearch();

  // click outside both the trigger and the portaled panel = close + clear
  useClickOutside(
    wrapperRef,
    () => {
      setOpen(false);
      clearSearch();
    },
    panelRef
  );

  // Position the portaled panel right under the search field.
  const updatePanelPosition = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setPanelStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 60,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);

    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [open, updatePanelPosition]);

  // Escape closes the panel
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, clearSearch]);

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

  const Backdrop = useBackdropPortal(open, 'z-40');

  return (
    <div ref={wrapperRef} className='relative'>
      {/* trigger */}
      <button
        type='button'
        onClick={() => setOpen(true)}
        aria-label='جستجو'
        aria-expanded={open}
        className='flex h-10 w-full cursor-pointer items-center gap-3 rounded-md border border-gray-2 bg-custom-white px-3 text-secondary-2 transition-colors'>
        <Icon IconComponent={SearchStatus} className='text-secondary-2' size={18} aria-hidden='true' variant='Linear' />
        <span className='text-sm'>جستجو کنید</span>
      </button>

      {/* panel — portaled above the backdrop so the header can blur behind it */}
      {open &&
        panelStyle.position &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            style={panelStyle}
            className='max-h-[70vh] overflow-y-auto rounded-lg border border-gray-2 bg-custom-white p-3 shadow-xl'>
            <SearchInputHeader value={query} onChange={setQuery} onClear={clearSearch} onSubmit={handleSubmit} />

            <SearchResults items={results} query={query} loading={loading} onItemClick={handleItemClick} />
          </div>,
          document.body
        )}

      {Backdrop}
    </div>
  );
}
