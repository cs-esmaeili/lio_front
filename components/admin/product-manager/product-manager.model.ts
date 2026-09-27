import {
  variantCombinationKey,
  type AdminAvailableAttribute,
  type AdminProduct,
  type ProductVariantInput,
  type SaveProductPayload,
} from '@/typescript/schemas/products/admin-product.schema';

/** A product image held in the editor before it is mapped back to the API payload. */
export interface ProductImageDraft {
  fileId: number;
  url: string | null;
  isPrimary: boolean;
  isThumbnail: boolean;
}

/** One generated variant as edited in the form (numbers stay strings for inputs). */
export interface VariantDraft {
  sku: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  isDefault: boolean;
}

/** attributeId -> selected value ids (spec attributes; single or multi per attribute). */
export type SpecSelection = Record<number, number[]>;
/** attributeId -> selected value ids used to build variant combinations. */
export type AxisSelection = Record<number, number[]>;
/** Combination key -> edited variant. */
export type VariantDrafts = Record<string, VariantDraft>;

export interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  categoryIds: number[];
  images: ProductImageDraft[];
  specValues: SpecSelection;
  variantAxes: AxisSelection;
  variants: VariantDrafts;
}

export interface VariantCombination {
  key: string;
  values: Array<{ attributeId: number; attributeValueId: number }>;
}

export function emptyVariantDraft(isDefault = false): VariantDraft {
  return { sku: '', price: '', compareAtPrice: '', stock: '0', isDefault };
}

export function emptyFormState(): ProductFormState {
  return {
    name: '',
    slug: '',
    description: '',
    categoryIds: [],
    images: [],
    specValues: {},
    variantAxes: {},
    variants: {},
  };
}

/**
 * Cartesian product of the selected axis values. A product with no axis values
 * still gets one base combination so it can carry a single price and stock.
 */
export function buildCombinations(axes: AxisSelection): VariantCombination[] {
  const active = Object.entries(axes)
    .map(([attributeId, valueIds]) => ({ attributeId: Number(attributeId), valueIds }))
    .filter((axis) => axis.valueIds.length > 0)
    .sort((a, b) => a.attributeId - b.attributeId);

  if (active.length === 0) {
    return [{ key: '', values: [] }];
  }

  let combinations: Array<Array<{ attributeId: number; attributeValueId: number }>> = [[]];
  for (const axis of active) {
    combinations = combinations.flatMap((combination) =>
      axis.valueIds.map((valueId) => [...combination, { attributeId: axis.attributeId, attributeValueId: valueId }]),
    );
  }

  return combinations.map((values) => ({ key: variantCombinationKey(values), values }));
}

/** Turns a stored product into the form model. */
export function toFormState(product: AdminProduct): ProductFormState {
  const specValues: SpecSelection = {};
  for (const value of product.specValues) {
    specValues[value.attributeId] = [...(specValues[value.attributeId] ?? []), value.attributeValueId];
  }

  const variantAxes: AxisSelection = {};
  for (const axis of product.variantAxes) {
    variantAxes[axis.attributeId] = [...axis.valueIds];
  }

  const variants: VariantDrafts = {};
  for (const variant of product.variants) {
    variants[variantCombinationKey(variant.values)] = {
      sku: variant.sku,
      price: String(variant.price),
      compareAtPrice: variant.compareAtPrice === null ? '' : String(variant.compareAtPrice),
      stock: String(variant.stock),
      isDefault: variant.isDefault,
    };
  }

  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',
    categoryIds: product.categories.map((category) => category.id),
    images: product.images.map((image) => ({
      fileId: image.fileId,
      url: image.url,
      isPrimary: image.isPrimary,
      isThumbnail: image.isThumbnail,
    })),
    specValues,
    variantAxes,
    variants,
  };
}

/** Keeps the edited variants for combinations that still exist and drops the rest. */
export function syncVariantDrafts(combinations: VariantCombination[], current: VariantDrafts): VariantDrafts {
  const next: VariantDrafts = {};
  combinations.forEach((combination, index) => {
    next[combination.key] = current[combination.key] ?? emptyVariantDraft(index === 0);
  });

  if (!Object.values(next).some((draft) => draft.isDefault) && combinations.length > 0) {
    next[combinations[0].key].isDefault = true;
  }

  return next;
}

/** Maps the form model to the API save payload. */
export function toSavePayload(state: ProductFormState): SaveProductPayload {
  const specValues = Object.entries(state.specValues).flatMap(([attributeId, valueIds]) =>
    valueIds.map((valueId) => ({ attributeId: Number(attributeId), attributeValueId: valueId })),
  );

  const variantAxes = Object.entries(state.variantAxes)
    .map(([attributeId, valueIds]) => ({ attributeId: Number(attributeId), valueIds }))
    .filter((axis) => axis.valueIds.length > 0);

  const combinations = buildCombinations(state.variantAxes);
  const variants: ProductVariantInput[] = combinations.map((combination, index) => {
    const draft = state.variants[combination.key] ?? emptyVariantDraft(index === 0);
    const price = Number(draft.price);
    const compareAtPrice = draft.compareAtPrice.trim() === '' ? null : Number(draft.compareAtPrice);

    return {
      sku: draft.sku.trim() || undefined,
      price: Number.isFinite(price) ? price : 0,
      compareAtPrice: compareAtPrice !== null && Number.isFinite(compareAtPrice) ? compareAtPrice : null,
      stock: Number.isFinite(Number(draft.stock)) ? Math.max(0, Math.trunc(Number(draft.stock))) : 0,
      isDefault: draft.isDefault,
      values: combination.values,
    };
  });

  if (variants.length > 0 && !variants.some((variant) => variant.isDefault)) {
    variants[0].isDefault = true;
  }

  return {
    name: state.name.trim(),
    slug: state.slug.trim(),
    description: state.description.trim() ? state.description : null,
    categoryIds: state.categoryIds,
    images: state.images.map((image, index) => ({
      fileId: image.fileId,
      isPrimary: image.isPrimary,
      isThumbnail: image.isThumbnail,
      sortOrder: index,
    })),
    specValues,
    variantAxes,
    variants,
  };
}

/** `1,234,000` in the Persian locale, or a dash when there is no price. */
export function formatPrice(value: number | null): string {
  return value === null ? '—' : value.toLocaleString('fa-IR');
}

/**
 * Drops selected attributes/values that are no longer exposed by the chosen
 * categories (e.g. after the user changes the category) and resyncs variants.
 */
export function pruneFormState(state: ProductFormState, attributes: AdminAvailableAttribute[]): ProductFormState {
  const specAttributes = new Map(attributes.filter((attribute) => attribute.usage === 'SPEC').map((attribute) => [attribute.id, new Set(attribute.values.map((value) => value.id))]));
  const variantAttributes = new Map(attributes.filter((attribute) => attribute.usage === 'VARIANT').map((attribute) => [attribute.id, new Set(attribute.values.map((value) => value.id))]));

  const prune = (selection: SpecSelection, allowed: Map<number, Set<number>>): SpecSelection => {
    const next: SpecSelection = {};
    for (const [attributeId, valueIds] of Object.entries(selection)) {
      const validValues = allowed.get(Number(attributeId));
      if (!validValues) continue;
      const kept = valueIds.filter((valueId) => validValues.has(valueId));
      if (kept.length > 0) next[Number(attributeId)] = kept;
    }
    return next;
  };

  const specValues = prune(state.specValues, specAttributes);
  const variantAxes = prune(state.variantAxes, variantAttributes);
  const variants = syncVariantDrafts(buildCombinations(variantAxes), state.variants);

  return { ...state, specValues, variantAxes, variants };
}
