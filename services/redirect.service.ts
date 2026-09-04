import { fetcher } from '@/services/core/SSRService';

const REDIRECT_LOOKUP_URL = `${process.env.BACKEND_ENDPOINT_SSR}/redirects/lookup`;

export interface RedirectResult {
  from_url: string;
  to_url: string;
  code: number;
}

interface RedirectApiResponse {
  status: number;
  data: RedirectResult;
}

export async function lookupRedirect(fromUrl: string): Promise<RedirectResult | null> {
  try {
    // Decode first (browser may send percent-encoded path like %D8%A2...),
    // then re-encode so Persian chars are encoded once for the query string
    const decoded = decodeURI(fromUrl);
    const url = `${REDIRECT_LOOKUP_URL}?from_url=${encodeURI(decoded)}`;
    
    const res = await fetcher<RedirectApiResponse>(url, {
      cache: 'no-store',
    });

    if (res?.status === 200 && res?.data?.to_url) {
      return res.data;
    }

    return null;
  } catch {
    return null;
  }
}
