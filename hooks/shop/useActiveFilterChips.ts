'use client';

import { useMemo } from 'react';
import { separator } from '@/utils/number';
import { cloneParams, toggleArrayParam, setScalarParam } from '@/utils/shop/urlHelpers';

export interface FilterChip {
  id: string;
  filterKey: string;
  label: string;
  remove: () => void;
}

const BOOLEAN_FILTERS: { key: string; label: string }[] = [
  { key: 'has_discount', label: 'محصولات دارای تخفیف' },
  { key: 'available', label: 'محصولات موجود' },
];

export function useActiveFilterChips(
  liveParams: URLSearchParams,
  serverFilters: any[] | undefined,
  onUrlChange: (params: URLSearchParams) => void
): FilterChip[] {
  return useMemo(() => {
    const chips: FilterChip[] = [];

    // Boolean switches
    for (const { key, label } of BOOLEAN_FILTERS) {
      if (liveParams.get(key) === '1') {
        chips.push({
          id: `${key}::bool`,
          filterKey: key,
          label,
          remove: () => onUrlChange(setScalarParam(liveParams, key, null)),
        });
      }
    }

    // Iterate normalized filter list
    for (const filter of serverFilters ?? []) {
      const key: string = filter.key;

      if (filter.type === 'price') {
        const min = liveParams.get('min_amount');
        const max = liveParams.get('max_amount');

        if (min == null && max == null) continue;

        const minText = min != null ? separator(Number(min)) : '۰';
        const maxText = max != null ? separator(Number(max)) : '∞';

        chips.push({
          id: `${key}::price`,
          filterKey: key,
          label: `${filter.title}: ${minText} - ${maxText}`,
          remove: () => {
            const next = cloneParams(liveParams);
            next.delete('min_amount');
            next.delete('max_amount');
            next.delete('page');
            onUrlChange(next);
          },
        });
        continue;
      }

      // Checkbox filters — read from URL using bracket-array keys
      const values = liveParams.getAll(key);
      if (values.length === 0) continue;

      for (const raw of values) {
        const str = String(raw);
        const item = filter.items?.find((it: any) => String(it.value) === str || String(it.id) === str);
        chips.push({
          id: `${key}::${str}`,
          filterKey: key,
          label: item?.title ?? str,
          remove: () => onUrlChange(toggleArrayParam(liveParams, key, str)),
        });
      }
    }

    return chips;
  }, [liveParams, serverFilters, onUrlChange]);
}
