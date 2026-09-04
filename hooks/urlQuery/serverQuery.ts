// Utility for Server Components — zero React/Next.js client dependencies.
// Builds a backend-compatible query string from Next.js searchParams.
// URL uses bracket-array format (brands[]=410&brands[]=432) which is
// directly compatible with Laravel/NestJS backends.

export function buildQueryString(
  searchParams: Record<string, string | string[]>,
  encodeFarsi = false
): string {
  const encode = (val: string): string => {
    if (encodeFarsi) return encodeURIComponent(val);
    return encodeURIComponent(val).replace(/%[0-9A-Fa-f]{2}/g, (match) => {
      const char = decodeURIComponent(match);
      return /[؀-ۿ]/.test(char) ? char : match;
    });
  };

  const parts: string[] = [];

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === null || value === undefined || value === '') continue;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === null || v === undefined || v === '') return;
        parts.push(`${encode(key)}=${encode(String(v))}`);
      });
    } else {
      parts.push(`${encode(key)}=${encode(String(value))}`);
    }
  }

  return parts.join('&');
}
