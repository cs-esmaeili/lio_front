'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';
import { MultiCheckBox } from '@/components/shop/List/MultiCheckBox';
import { MultiRaidoButton } from '@/components/shop/List/MultiRaidoButton';
import PriceFilter from '@/components/shop/List/PriceFilter';
import InnerSwitch from '@/components/shop/List/InnerSwitch';
import MadeIranSelect from '@/components/shop/List/MadeIranSelect';
import ActiveFilterChips from '@/components/shop/List/ActiveFilterChips';
import { useShopContext } from '@/providers/ShopProvider';
import { toggleArrayParam, setScalarParam, setPriceParams } from '@/utils/shop/urlHelpers';

const SEARCHABLE_THRESHOLD = 8;

export const renderFilterControl = (filter: any, liveParams: URLSearchParams, onUrlChange: (params: URLSearchParams) => void) => {
  if (!filter) return null;

  if (filter.type === 'price') {
    const min = filter.value?.min ?? 0;
    const max = filter.value?.max ?? 0;
    return (
      <PriceFilter
        min={min}
        max={max}
        value={[Number(liveParams.get('min_amount')) || min, Number(liveParams.get('max_amount')) || max]}
        onChange={([newMin, newMax]: [number, number]) => onUrlChange(setPriceParams(liveParams, newMin, newMax))}
      />
    );
  }

  if (filter.type === 'checkbox') {
    const searchable = (filter.items?.length ?? 0) > SEARCHABLE_THRESHOLD;

    if (filter.multiselect) {
      return (
        <MultiCheckBox
          items={filter.items}
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
        items={filter.items}
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
  const filters = (serverFilters as any[]) ?? [];

  return (
    <div className='hidden xl:flex xl:col-span-3 flex-col h-fit rounded-[20px] p-4 border border-primary-3 sticky top-25'>
      <h5 className='px-3'>فیلتر ها</h5>

      <ActiveFilterChips className='px-3' />

      <div className='flex flex-col px-3 py-2'>
        <InnerSwitch
          label='محصولات دارای تخفیف'
          checked={liveParams.get('has_discount') === '1'}
          onToggle={() =>
            onUrlChange(
              liveParams.get('has_discount') === '1'
                ? setScalarParam(liveParams, 'has_discount', null)
                : setScalarParam(liveParams, 'has_discount', '1')
            )
          }
        />
        <InnerSwitch
          label='محصولات موجود'
          checked={liveParams.get('available') === '1'}
          onToggle={() =>
            onUrlChange(
              liveParams.get('available') === '1' ? setScalarParam(liveParams, 'available', null) : setScalarParam(liveParams, 'available', '1')
            )
          }
        />

        <Accordion type='single' collapsible>
          <AccordionItem value='made_iran'>
            <AccordionTrigger className='text-secondary-2'>نوع محصول</AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col gap-6 justify-between py-5'>
                <MadeIranSelect
                  value={liveParams.get('made_iran')}
                  onValueChange={(val) => onUrlChange(setScalarParam(liveParams, 'made_iran', val))}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          {filters.map((filter: any) => (
            <AccordionItem key={filter.key} value={filter.key}>
              <AccordionTrigger className='text-secondary-2'>{filter.title}</AccordionTrigger>
              <AccordionContent className={`max-h-100 overflow-y-scroll customScrollbar`}>
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
