import { useState, useMemo, useCallback } from 'react';
import { productStatus } from '@/utils/product/Product';

// Generate all permutations of an array of numbers, each joined with '-'
function generatePermutations(arr: number[]): string[] {
  if (arr.length === 0) return [];
  if (arr.length === 1) return [String(arr[0])];

  const result: string[] = [];

  function permute(current: number[], remaining: number[]) {
    if (remaining.length === 0) {
      result.push(current.join('-'));
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      permute([...current, remaining[i]], [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
    }
  }

  permute([], arr);
  return result;
}

/** Parse price key "998-1006" → { attrIndex: valueId } by matching value IDs to baseAttributes */
function resolveKeyToSelectedIds(key: string, baseAttributes: any[]): Record<number, number> {
  const valueIds = key.split('-').map(Number);
  const result: Record<number, number> = {};

  for (const vid of valueIds) {
    const attrIndex = baseAttributes.findIndex((attr) => attr.values?.some((v: any) => v.id === vid));
    if (attrIndex !== -1) result[attrIndex] = vid;
  }

  return result;
}

/** Priority: default_variant price key → is_selected flags on attribute values */
function getInitialSelectedIds(
  baseAttributes: any[] | undefined,
  prices: any[] | undefined,
  defaultVariant: { id: number } | undefined | null
): Record<number, number> {
  if (defaultVariant?.id && prices?.length && baseAttributes?.length) {
    const defaultPrice = prices.find((p) => p.id === defaultVariant.id);
    if (defaultPrice?.key) return resolveKeyToSelectedIds(defaultPrice.key, baseAttributes);
  }

  if (!baseAttributes) return {};
  const initial: Record<number, number> = {};
  baseAttributes.forEach((attr, index) => {
    const selectedVal = attr.values?.find((v: any) => v.is_selected);
    if (selectedVal) initial[index] = selectedVal.id;
  });
  return initial;
}

interface UseMatchedPriceParams {
  baseAttributes?: any[];
  prices?: any[];
  /** The product's default_variant — used to pre-select the default price's attributes */
  defaultVariant?: { id: number } | null;
}

/**
 * Owns attribute selection state, derives matched price variant + 3-way product status.
 *
 * Returns: matchedPrice, status ('available'|'call'|'notify'), hasDiscount,
 *          isComplete, selectedValueIds, handleValueChange
 */
export function useMatchedPrice({ baseAttributes, prices, defaultVariant }: UseMatchedPriceParams) {
  const [selectedValueIds, setSelectedValueIds] = useState<Record<number, number>>(() =>
    getInitialSelectedIds(baseAttributes, prices, defaultVariant)
  );

  const handleValueChange = useCallback((attributeIndex: number, valueId: string) => {
    setSelectedValueIds((prev) => ({ ...prev, [attributeIndex]: Number(valueId) }));
  }, []);

  // Ordered array of selected value IDs (null where unselected)
  const selectedIdsArray = useMemo(() => {
    if (!baseAttributes) return [];
    return baseAttributes.map((_, index) => selectedValueIds[index] ?? null);
  }, [baseAttributes, selectedValueIds]);

  // True when every attribute has a selected value
  const isComplete = useMemo(() => {
    if (!baseAttributes?.length) return false;
    return selectedIdsArray.every((id) => id !== null);
  }, [baseAttributes, selectedIdsArray]);

  // All permutation keys for the selected IDs (e.g. ["998-1006", "1006-998"])
  const generatedKeys = useMemo(() => {
    const ids = selectedIdsArray.filter((id): id is number => id !== null);
    if (ids.length !== (baseAttributes?.length ?? 0) || ids.length === 0) return [];
    return generatePermutations(ids);
  }, [selectedIdsArray, baseAttributes]);

  // The price variant whose key matches one of the permutations
  const matchedPrice = useMemo(() => {
    if (!generatedKeys.length || !prices?.length) return null;
    return prices.find((p) => generatedKeys.includes(p.key)) ?? null;
  }, [generatedKeys, prices]);

  // 3-way product status: available | call | notify
  const status = useMemo(() => {
    if (!matchedPrice) return 'notify';
    return productStatus(matchedPrice);
  }, [matchedPrice]);

  const hasDiscount = matchedPrice && matchedPrice.discount_percent > 0;

  return {
    matchedPrice,
    status,
    hasDiscount,
    isComplete,
    selectedValueIds,
    handleValueChange,
  } as const;
}
