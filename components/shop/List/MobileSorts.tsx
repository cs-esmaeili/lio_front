import { useEffect } from 'react';
import Icon from '@/components/global/Icon';
import { ArrowLeft2, CloseCircle } from 'iconsax-reactjs';
import type { ProductSortOption } from '@/typescript/schemas/products/product-options.schema';

interface MobileSortsProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductSortOption[];
  activeSortId?: string | null;
  onSortSelect: (filter: ProductSortOption) => void;
}

const SHEET_MAX_HEIGHT = '100dvh';
const ANIMATION_DURATION = '300ms';

const MobileSorts = ({
  isOpen,
  onClose,
  filters,
  activeSortId,
  onSortSelect,
}: MobileSortsProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSortSelect = (filter: ProductSortOption) => {
    onSortSelect(filter);
    onClose();
  };

  return (
    <>
      <Backdrop isOpen={isOpen} onClick={onClose} />
      <Sheet isOpen={isOpen}>
        <SheetHeader onClose={onClose} />
        <SheetContent>
          <div className='flex flex-col h-fit rounded-[20px]'>
            <div className='flex flex-col p-3.5'>
              {filters.map((filter) => (
                <div
                  key={filter.key}
                  className={`flex gap-6 justify-between py-3 border-b border-primary-3 cursor-pointer transition-colors text-body ${
                    activeSortId === filter.key
                      ? 'text-primary-1'
                      : 'text-secondary-2'
                  }`}
                  onClick={() => handleSortSelect(filter)}>
                  <span>{filter.title}</span>
                  <Icon
                    IconComponent={ArrowLeft2}
                    size={24}
                    className='text-secondary-2 transition-colors duration-300'
                    variant='Linear'
                  />
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

const Backdrop = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <div
    onClick={onClick}
    aria-hidden='true'
    className={`
      fixed inset-0 bg-black/40 z-40
      transition-opacity duration-300
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    `}
  />
);

const Sheet = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => (
  <div
    role='dialog'
    aria-modal='true'
    className={`
      fixed bottom-0 left-0 right-0 z-50
      bg-background rounded-t-[24px] shadow-xl
      flex flex-col
      transition-transform ease-in-out
      ${isOpen ? 'translate-y-0' : 'translate-y-full'}
    `}
    style={{
      maxHeight: SHEET_MAX_HEIGHT,
      transitionDuration: ANIMATION_DURATION,
    }}>
    {children}
  </div>
);

const SheetHeader = ({ onClose }: { onClose: () => void }) => (
  <div className='flex items-center justify-between px-7 pt-4 pb-3 shrink-0 border-b border-gray-100'>
    <h5 className='text-secondary-1 text-md'>مرتب سازی</h5>
    <button
      onClick={() => {
        onClose();
      }}
      className='p-1 rounded-full hover:bg-gray-100 transition-colors'
      aria-label='بستن فیلترها'>
      <Icon IconComponent={CloseCircle} size={24} className='text-secondary-3' variant='Linear' />
    </button>
  </div>
);

const SheetContent = ({ children }: { children: React.ReactNode }) => <div className='overflow-y-auto flex-1 px-4 py-4'>{children}</div>;

export default MobileSorts;
