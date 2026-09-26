import { redirect } from 'next/navigation';

/**
 * Legacy result URL. The bank callback now redirects to `/payment/result`
 * (`PAYMENT_FRONTEND_RESULT_URL`); this route only forwards old links while the
 * backend configuration catches up, preserving the query string.
 */
export default async function LegacyPaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') query.set(key, value);
    else if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
  }

  const queryString = query.toString();
  redirect(`/payment/result${queryString ? `?${queryString}` : ''}`);
}
