'use server';

import { compareSSR } from '@/services/compare.service';

export async function fetchCompareData(barcodes: string[]) {
  if (!barcodes.length) return [];

  const queryString = barcodes
    .map((b, i) => `products[${i}]=${encodeURIComponent(b)}`)
    .join('&');

  try {
    const result = await compareSSR(queryString);
    if (result?.status === 200 && Array.isArray(result?.data)) {
      return result.data;
    }
    return [];
  } catch {
    return [];
  }
}
