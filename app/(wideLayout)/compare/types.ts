// ---------------------------------------------------------------------------
// API response types for /product/compare
// ---------------------------------------------------------------------------

export type AttrValues = string[] | Record<string, string> | null | undefined;

export interface ApiAttribute {
  id: number;
  title: string;
  values?: AttrValues;
}

export interface ApiAttributeGroup {
  id: number;
  title: string;
  attributes: Record<string, ApiAttribute>;
}

export interface CompareProduct {
  product: {
    id: number;
    title: string;
    slug: string;
    barcode: string;
    brand: string;
    image: string;
    labels: unknown[];
    default_variant: {
      id: number;
      barcode: string;
      amount: number;
      final_amount: number;
      discount_percent: number;
      currency_symbol: string;
      attributes: string;
      is_available: boolean;
    };
  };
  attribute_groups: Record<string, ApiAttributeGroup>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function flattenAttrValues(values: AttrValues): string {
  if (!values) return '-';
  if (Array.isArray(values)) return values.join(' | ');
  return Object.values(values).join(' | ');
}

export function getUniqueAttrTitles(products: CompareProduct[]): string[] {
  const seen = new Set<string>();
  const titles: string[] = [];
  for (const p of products) {
    for (const group of Object.values(p.attribute_groups)) {
      for (const attr of Object.values(group.attributes)) {
        if (!seen.has(attr.title)) {
          seen.add(attr.title);
          titles.push(attr.title);
        }
      }
    }
  }
  return titles;
}

export function getAttrValue(product: CompareProduct, title: string): string {
  for (const group of Object.values(product.attribute_groups)) {
    for (const attr of Object.values(group.attributes)) {
      if (attr.title === title) {
        return flattenAttrValues(attr.values);
      }
    }
  }
  return '-';
}
