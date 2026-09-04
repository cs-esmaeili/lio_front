'use client';

import { useState } from 'react';
import Icon from '@/components/global/Icon';
import { Candle2, RowVertical, Sort } from 'iconsax-reactjs';
import { separator } from '@/utils/number';
import { useShopContext } from '@/providers/ShopProvider';
import MobileSorts from './MobileSorts';

interface SortTabsProps {
  setCardHorizontalMode: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFilter: React.Dispatch<React.SetStateAction<boolean>>;
  productCount?: number;
  activeSortId: string | null;
  activeFilterCount: number;
}

const SortTabs = ({ setCardHorizontalMode, setOpenFilter, productCount = 0, activeSortId, activeFilterCount }: SortTabsProps) => {
  const [openSort, setOpenSort] = useState(false);
  const { sortOptions, liveParams, onUrlChange } = useShopContext();
  const [rotateIcon, setRotateIcon] = useState(false);

  const filters = sortOptions ?? [];

  return (
    <>
      {/* Desktop */}
      <div className='hidden xl:flex flex-row p-2 justify-between border-b border-gray-200'>
        <div className='flex flex-row gap-4'>
          <div className='flex flex-row gap-1'>
            <Icon IconComponent={Sort} size={24} className='text-secondary-1' />
            <span>مرتب سازی:</span>
          </div>
          {filters.map((filter) => (
            <div
              key={filter.id}
              onClick={() => {
                const next = new URLSearchParams(liveParams.toString());
                next.set('sort', String(filter.id));
                next.delete('page');
                onUrlChange(next);
              }}
              className={`cursor-pointer transition-colors ${
                activeSortId === String(filter.id) ? 'text-primary-1 font-semibold' : 'text-secondary-2 hover:text-primary-1'
              }`}>
              {filter.title}
            </div>
          ))}
        </div>
        <div className='flex gap-1 ml-3 text-primary-2'>
          <span>{separator(String(productCount))}</span>
          <span>کالا</span>
        </div>
      </div>

      {/* Mobile */}
      <div className='flex justify-between xl:hidden'>
        <div
          className='flex flex-row gap-1 text-primary-1 border border-primary-1 px-2 py-1.5 rounded-[8px] cursor-pointer'
          onClick={() => setOpenSort(true)}>
          <Icon IconComponent={Sort} size={16} variant='TwoTone' className='text-secondary-1' toneTwoColor='--primary-1' />
          <span className='text-caption'>مرتب سازی</span>
        </div>

        <div className='flex gap-2'>
          <button
            className='relative flex flex-row gap-1 text-primary-1 border border-primary-1 px-2 py-1.5 rounded-[8px]'
            onClick={() => setOpenFilter((prev) => !prev)}>
            <Icon IconComponent={Candle2} size={16} variant='TwoTone' className='text-primary-1' toneTwoColor='--secondary-black-1' />
            <span className='text-caption'>فیلتر</span>
            {activeFilterCount > 0 && (
              <span className='absolute -top-2 -left-2 min-w-5 h-5 px-1 rounded-full bg-primary-1 text-gray-1 text-xs font-semibold flex items-center justify-center leading-none'>
                {separator(activeFilterCount)}
              </span>
            )}
          </button>
          <button
            className='flex flex-row gap-1 text-primary-1 border border-primary-1 px-2 py-1.5 rounded-[8px]'
            onClick={() => {
              setRotateIcon((prev) => !prev);
              setCardHorizontalMode((prev) => !prev);
            }}>
            <span className={`transition-transform duration-300 ${rotateIcon ? 'rotate-90' : 'rotate-0'}`}>
              <Icon IconComponent={RowVertical} size={16} variant='TwoTone' toneTwoColor='--secondary-black-1' className='text-primary-1' />
            </span>
          </button>
        </div>
      </div>

      <MobileSorts
        isOpen={openSort}
        onClose={() => setOpenSort(false)}
        filters={filters}
        activeSortId={activeSortId}
        onSortSelect={(f) => {
          const next = new URLSearchParams(liveParams.toString());
          next.set('sort', String(f.id));
          next.delete('page');
          onUrlChange(next);
          setOpenSort(false);
        }}
      />
    </>
  );
};

export default SortTabs;
