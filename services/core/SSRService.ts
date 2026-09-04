import { ApiError } from '@/utils/api-error';

export async function fetcher<T>(
  url: string,
  options?: RequestInit & {
    next?: {
      revalidate?: number;
      tags?: string[];
    };
  },
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let data: unknown;
    let message = '';

    // Try to parse error body for server-provided message
    try {
      data = await res.json();
      if (data && typeof data === 'object' && 'message' in data) {
        message = (data as { message: string }).message;
      }
    } catch {
      // Response body wasn't JSON — use status text as fallback
      message = res.statusText || '';
    }

    throw new ApiError(
      res.status,
      message || `درخواست با خطا مواجه شد (${res.status})`,
      data,
    );
  }

  return res.json();
}
