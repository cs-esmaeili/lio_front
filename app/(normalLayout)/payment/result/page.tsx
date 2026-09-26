import type { Metadata } from 'next';

import PaymentResult from '@/components/shop/payment/PaymentResult';
import { parsePaymentResultQuery } from '@/services/payment.service';

export const metadata: Metadata = {
  title: 'نتیجه پرداخت',
};

/**
 * Landing target of the backend's callback redirect
 * (`PAYMENT_FRONTEND_RESULT_URL`). The bank never reaches this route directly;
 * the backend verifies the payment and redirects here with the result in the
 * query string.
 */
export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const result = parsePaymentResultQuery(params);

  return <PaymentResult result={result} />;
}
