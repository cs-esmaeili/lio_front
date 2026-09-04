export type SelectedAttributeFilter = {
  attribute_id: number;
  values: number[];
};

export interface SigaretobesazSearchParams {
  attributes: SelectedAttributeFilter[];
  madeIran: string | null;
  priceFrom: number | null;
  priceTo: number | null;
}

/**
 * Builds the query string expected by the sigaretobesaz search endpoint:
 * attributes[0][attribute_id]=71&attributes[0][values][]=1078&attributes[0][values][]=1080&
 * attributes[1][attribute_id]=72&attributes[1][values][]=1087
 *
 * Only attributes that actually have a selected value are included (attribute_id
 * with an empty `values` array is skipped).
 */
export const buildAttributesQuery = (params: SigaretobesazSearchParams, page?: number): string => {
  const searchParams = new URLSearchParams();
  let index = 0;

  params.attributes.forEach((attr) => {
    if (!attr.values.length) return;

    searchParams.append(`attributes[${index}][attribute_id]`, String(attr.attribute_id));
    attr.values.forEach((value) => {
      searchParams.append(`attributes[${index}][values][]`, String(value));
    });

    index += 1;
  });

  if (page && page > 1) {
    searchParams.append('page', String(page));
  }

  if (params.madeIran) {
    searchParams.append('made_iran', params.madeIran);
  }

  if (params.priceFrom !== null) {
    searchParams.append('min_amount', String(params.priceFrom));
  }

  if (params.priceTo !== null) {
    searchParams.append('max_amount', String(params.priceTo));
  }

  return searchParams.toString();
};