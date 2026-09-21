'use client';

import { useCallback, useMemo, useState } from 'react';
import type {
  BaseAttribute,
  ProductVariant,
} from '@/typescript/schemas/products/product-details.schema';

/**
 * Owns the attribute selection state for a product and derives the variant
 * whose attribute values match the selection.
 *
 * The API gives one entry per variant-defining attribute (`attributeId` →
 * `valueId`), so a selection matches a variant when every value of the variant
 * matches the selected value of its attribute.
 */
export function useMatchedVariant({
  baseAttributes,
  variants,
  defaultVariant,
}: {
  baseAttributes: BaseAttribute[];
  variants: ProductVariant[];
  defaultVariant?: ProductVariant | null;
}) {
  const [selectedValueIds, setSelectedValueIds] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};

    baseAttributes.forEach((attribute) => {
      const preselected = attribute.values.find((value) => value.isSelected) ?? attribute.values[0];
      if (preselected) initial[attribute.attributeId] = preselected.valueId;
    });

    return initial;
  });

  const handleValueChange = useCallback((attributeId: number, valueId: string) => {
    setSelectedValueIds((prev) => ({ ...prev, [attributeId]: Number(valueId) }));
  }, []);

  const isComplete = useMemo(
    () => baseAttributes.length > 0 && baseAttributes.every((attribute) => selectedValueIds[attribute.attributeId] != null),
    [baseAttributes, selectedValueIds],
  );

  const matchedVariant = useMemo(() => {
    if (baseAttributes.length === 0) return defaultVariant ?? variants[0] ?? null;
    if (!isComplete) return null;

    return (
      variants.find(
        (variant) =>
          variant.values.length === baseAttributes.length &&
          variant.values.every((value) => selectedValueIds[value.attributeId] === value.valueId),
      ) ?? null
    );
  }, [baseAttributes, variants, selectedValueIds, isComplete, defaultVariant]);

  return { matchedVariant, selectedValueIds, handleValueChange, isComplete } as const;
}
