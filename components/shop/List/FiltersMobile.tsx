'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/global/Icon';
import { ArrowLeft2 } from 'iconsax-reactjs';
import InnerSwitch from '@/components/shop/List/InnerSwitch';
import MadeIranSelect from '@/components/shop/List/MadeIranSelect';
import { MultiCheckBox } from '@/components/shop/List/MultiCheckBox';
import { MultiRaidoButton } from '@/components/shop/List/MultiRaidoButton';
import ActiveFilterChips from '@/components/shop/List/ActiveFilterChips';
import { MobileBackdrop, MobileSheet, MobileSheetHeader, MobileSheetContent } from '@/components/shop/List/MobileSheet';
import { useShopContext } from '@/providers/ShopProvider';
import { paramsToObject, objectToParams } from '@/utils/shop/urlHelpers';
import gridStyles from '@/styles/modules/mobileFilterGrid.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCHABLE_THRESHOLD = 8;

// ── render filter sub-page using draft params ─────────────────────────────

function DraftFilterControl({
  filter,
  draftParams,
  onUpdateDraft,
  onToggleDraftArray,
}: {
  filter: any;
  draftParams: URLSearchParams;
  onUpdateDraft: (key: string, value: string | string[] | null) => void;
  onToggleDraftArray: (key: string, value: string) => void;
}) {
  if (!filter) return null;

  if (filter.type === 'price') {
    return (
      <div className="flex flex-col gap-6 justify-between py-5">
        <span>محدوده قیمت (به‌زودی)</span>
      </div>
    );
  }

  if (filter.type === 'checkbox') {
    const searchable = (filter.items?.length ?? 0) > SEARCHABLE_THRESHOLD;
    const key = filter.key;

    if (filter.multiselect) {
      return (
        <MultiCheckBox
          items={filter.items}
          checkedValues={draftParams.getAll(key)}
          onToggle={(val) => onToggleDraftArray(key, val)}
          searchable={searchable}
          goToLink={filter.goToLink}
        />
      );
    }

    return (
      <MultiRaidoButton
        items={filter.items}
        selectedValue={draftParams.getAll(key)[0] ?? ''}
        onSelect={(val) => {
          const current = draftParams.getAll(key)[0];
          if (current === val) {
            onToggleDraftArray(key, val);
          } else {
            onUpdateDraft(key, val);
          }
        }}
        searchable={searchable}
        goToLink={filter.goToLink}
      />
    );
  }

  return null;
}

// ── main component ────────────────────────────────────────────────────────

const FiltersMobile = ({ isOpen, onClose }: Props) => {
  const { liveParams, onUrlChange, serverFilters } = useShopContext();
  const filters = (serverFilters as any[]) ?? [];
  const [draft, setDraft] = useState<Record<string, string | string[]>>({});
  const [activeFilterKey, setActiveFilterKey] = useState<string | null>(null);

  // snapshot URL into draft on open
  useEffect(() => {
    if (isOpen) {
      setDraft(paramsToObject(liveParams));
      setActiveFilterKey(null);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const draftParams = objectToParams(draft);
  const activeFilter = filters.find((f: any) => f.key === activeFilterKey) ?? null;

  const updateDraft = (key: string, value: string | string[] | null) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (value === null) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const toggleDraftArray = (key: string, value: string) => {
    setDraft((prev) => {
      const next = { ...prev };
      const current = next[key];
      const arr: string[] = Array.isArray(current) ? [...current] : current !== undefined ? [String(current)] : [];
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(value);
      if (arr.length === 0) delete next[key];
      else next[key] = arr;
      return next;
    });
  };

  const handleApply = () => {
    draftParams.delete('page');
    onUrlChange(draftParams);
    onClose();
  };

  const handleClear = () => {
    onUrlChange(new URLSearchParams());
    onClose();
  };

  // build menu from server filters only (boolean switches shown inline)
  const menuItems: { key: string; title: string }[] = [
    { key: 'made_iran', title: 'نوع محصول' },
    ...filters.map((f: any) => ({ key: f.key, title: f.title })),
  ];

  return (
    <>
      <MobileBackdrop isOpen={isOpen} onClick={onClose} />
      <MobileSheet isOpen={isOpen}>
        <MobileSheetHeader
          title={activeFilterKey === 'made_iran' ? 'نوع محصول' : activeFilter ? activeFilter.title : 'فیلتر ها'}
          subMenu={activeFilterKey === 'made_iran' || !!activeFilter}
          onBack={() => setActiveFilterKey(null)}
          onClose={onClose}
        />
        <MobileSheetContent>
          {activeFilterKey === 'made_iran' ? (
            <div className='h-fit rounded-[20px] p-4'>
              <span className='text-sm text-secondary-2'>نوع محصول</span>
              <MadeIranSelect
                value={draftParams.get('made_iran')}
                onValueChange={(val) => updateDraft('made_iran', val)}
              />
            </div>
          ) : activeFilter ? (
            <div className={`${gridStyles.gridList} h-fit rounded-[20px] p-4`}>
              <DraftFilterControl
                filter={activeFilter}
                draftParams={draftParams}
                onUpdateDraft={updateDraft}
                onToggleDraftArray={toggleDraftArray}
              />
            </div>
          ) : (
            <div className="flex flex-col h-fit rounded-[20px]">
              <ActiveFilterChips />
              <div className="flex flex-col p-3.5">
                <InnerSwitch
                  label="محصولات دارای تخفیف"
                  checked={draftParams.get('has_discount') === '1'}
                  onToggle={() =>
                    updateDraft('has_discount', draftParams.get('has_discount') === '1' ? null : '1')
                  }
                />
                <InnerSwitch
                  label="محصولات موجود"
                  checked={draftParams.get('available') === '1'}
                  onToggle={() =>
                    updateDraft('available', draftParams.get('available') === '1' ? null : '1')
                  }
                />
                {menuItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-6 justify-between py-3 border-b border-primary-3 cursor-pointer text-secondary-2 text-body"
                    onClick={() => setActiveFilterKey(item.key)}
                  >
                    <span>{item.title}</span>
                    <Icon IconComponent={ArrowLeft2} size={24} className="transition-colors duration-300 text-secondary-2" variant="Linear" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-[50px] bg-primary-3/50 backdrop-blur-md py-3.75 px-4 h-18 flex flex-row justify-between items-center shadow-[0_0_25px_0_rgba(0,0,0,0.2)]">
            <button
              type="button"
              onClick={handleApply}
              className="text-body bg-secondary-black-3 text-gray-1 rounded-[50px] py-2 px-16.75 w-full text-center text-nowrap"
            >
              اعمال فیلتر
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-body text-secondary-black-3 min-w-fit mx-5 text-nowrap cursor-pointer"
            >
              حذف فیلترها
            </button>
          </div>
        </MobileSheetContent>
      </MobileSheet>
    </>
  );
};

export default FiltersMobile;
