const imageBaseUrl = process.env.NEXT_PUBLIC_BACKEND_IMAGE ?? '';

export function resolveFileUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  return `${imageBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}
