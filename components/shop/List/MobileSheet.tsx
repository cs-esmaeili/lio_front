'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/global/Icon';
import { ArrowLeft, CloseCircle } from 'iconsax-reactjs';

const SHEET_MAX_HEIGHT = '100dvh';
const ANIMATION_DURATION = '300ms';

// ── Backdrop ──────────────────────────────────────────────────────────────

export function MobileBackdrop({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      aria-hidden="true"
      className={`
        fixed inset-0 bg-black/40 z-40
        transition-opacity duration-300
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    />
  );
}

// ── Sheet ─────────────────────────────────────────────────────────────────

export function MobileSheet({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFullHeight, setIsFullHeight] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const h = el.getBoundingClientRect().height;
      setIsFullHeight(h >= window.innerHeight - 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener('resize', check);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-background shadow-xl
        flex flex-col
        transition-transform ease-in-out
        ${isFullHeight ? 'rounded-none' : 'rounded-t-[24px]'}
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}
      style={{
        maxHeight: SHEET_MAX_HEIGHT,
        transitionDuration: ANIMATION_DURATION,
      }}
    >
      {children}
    </div>
  );
}

// ── SheetHeader ───────────────────────────────────────────────────────────

export function MobileSheetHeader({
  title,
  subMenu = false,
  onBack,
  onClose,
}: {
  title: string;
  subMenu?: boolean;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-7 pt-4 pb-3 shrink-0 border-b border-gray-100">
      <h5 className="text-secondary-1 text-md">{title}</h5>
      <button
        onClick={() => (subMenu ? onBack() : onClose())}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="بستن فیلترها"
      >
        {subMenu ? (
          <Icon IconComponent={ArrowLeft} size={24} className="text-secondary-3" variant="Linear" />
        ) : (
          <Icon IconComponent={CloseCircle} size={24} className="text-secondary-3" variant="Linear" />
        )}
      </button>
    </div>
  );
}

// ── SheetContent ──────────────────────────────────────────────────────────

export function MobileSheetContent({ children }: { children: React.ReactNode }) {
  return <div className="overflow-y-auto flex-1 px-4 py-4">{children}</div>;
}
