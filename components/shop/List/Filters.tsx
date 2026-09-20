'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';
import { MultiCheckBox } from '@/components/shop/List/MultiCheckBox';
import { MultiRaidoButton } from '@/components/shop/List/MultiRaidoButton';
import PriceFilter from '@/components/shop/List/PriceFilter';
import InnerSwitch from '@/components/shop/List/InnerSwitch';
import ActiveFilterChips from '@/components/shop/List/ActiveFilterChips';
import { useShopContext } from '@/providers/ShopProvider';
import type { CategoryFilterView } from '@/typescript/schemas/products/category-filters.schema';
import { toggleArrayParam, setScalarParam, setPriceParams } from '@/utils/shop/urlHelpers';

const SEARCHABLE_THRESHOLD = 8;

export const renderFilterControl = (
  filter: CategoryFilterView,
  liveParams: URLSearchParams,
  onUrlChange: (params: URLSearchParams) => void
) => {
  if (!filter) return null;

  if (filter.type === 'toggle') {
    const active = liveParams.get(filter.key) === '1';
    return (
      <InnerSwitch
        label={filter.title}
        checked={active}
        onToggle={() => onUrlChange(setScalarParam(liveParams, filter.key, active ? null : '1'))}
      />
    );
  }

  if (filter.type === 'price') {
    const min = filter.value?.min ?? 0;
    const max = filter.value?.max ?? 0;
    return (
      <PriceFilter
        min={min}
        max={max}
        value={[Number(liveParams.get('minPrice')) || min, Number(liveParams.get('maxPrice')) || max]}
        onChange={([newMin, newMax]: [number, number]) => onUrlChange(setPriceParams(liveParams, newMin, newMax))}
      />
    );
  }

  if (filter.type === 'checkbox') {
    const searchable = (filter.items?.length ?? 0) > SEARCHABLE_THRESHOLD;

    if (filter.multiselect) {
      return (
        <MultiCheckBox
          items={filter.items ?? []}
          checkedValues={liveParams.getAll(filter.key)}
          onToggle={(val) => onUrlChange(toggleArrayParam(liveParams, filter.key, val))}
          searchable={searchable}
          goToLink={filter.goToLink}
          baseLink={filter.baseLink}
        />
      );
    }

    return (
      <MultiRaidoButton
        items={filter.items ?? []}
        selectedValue={liveParams.getAll(filter.key)[0] ?? ''}
        onSelect={(val) => {
          const current = liveParams.getAll(filter.key)[0];
          if (current === val) {
            onUrlChange(toggleArrayParam(liveParams, filter.key, val));
          } else {
            const next = new URLSearchParams(liveParams.toString());
            next.delete(filter.key);
            next.append(filter.key, val);
            next.delete('page');
            onUrlChange(next);
          }
        }}
        searchable={searchable}
        goToLink={filter.goToLink}
      />
    );
  }

  return null;
};

const Filters = () => {
  const { liveParams, onUrlChange, serverFilters } = useShopContext();
  const filters = serverFilters ?? [];
  const toggles = filters.filter((filter) => filter.type === 'toggle');
  const collapsible = filters.filter((filter) => filter.type !== 'toggle');

  return (
    <div className='hidden xl:flex xl:col-span-3 flex-col h-fit rounded-[20px] p-4 border border-primary-3 sticky top-25'>
      <h5 className='px-3'>فیلتر ها</h5>

      <ActiveFilterChips className='px-3' />

      <div className='flex flex-col px-3 py-2'>
        {toggles.map((filter) => (
          <div key={filter.key}>{renderFilterControl(filter, liveParams, onUrlChange)}</div>
        ))}

        <Accordion type='single' collapsible>
          {collapsible.map((filter) => (
            <AccordionItem key={filter.key} value={filter.key}>
              <AccordionTrigger className='text-secondary-2'>{filter.title}</AccordionTrigger>
              <AccordionContent className='max-h-100 overflow-y-scroll customScrollbar'>
                <div className='flex flex-col gap-6 justify-between py-5'>{renderFilterControl(filter, liveParams, onUrlChange)}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Filters;
