'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useCsrf } from '@/hooks/useCsrf';
import { createPaymentCSR, getPaymentNotAllowedReasons } from '@/services/payment.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { PaymentEligibilityReason } from '@/typescript/schemas/payment-eligibility.schema';

/**
 * Outcome of a payment attempt. On success the browser navigates away, so
 * `redirecting` is mostly a terminal state; the other variants let the caller
 * react (open the profile dialog, show a toast) without inspecting the error.
 */
export type StartPaymentResult =
  | { status: 'redirecting' }
  | { status: 'not-allowed'; reasons: PaymentEligibilityReason[] }
  | { status: 'failed' }
  | { status: 'busy' };

/**
 * Starts the online-payment flow: `POST /payments` with a fresh CSRF token,
 * then a full-page navigation to the gateway. A synchronous in-flight guard
 * prevents the double-submit that would otherwise create two orders.
 *
 * A `409 PAYMENT_NOT_ALLOWED` is returned to the caller (not toasted) so the
 * checkout page can open the profile-completion dialog with its `reasons`.
 */
export function usePayment() {
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const { ensureCsrfToken } = useCsrf();

  const startPayment = useCallback(
    async (addressId: number): Promise<StartPaymentResult> => {
      if (inFlight.current) return { status: 'busy' };
      inFlight.current = true;
      setPending(true);

      try {
        const headers = new Headers({ 'Content-Type': 'application/json', Accept: 'application/json' });
        const csrf = await ensureCsrfToken();
        if (csrf) headers.set('X-CSRF-Token', csrf);

        const payment = await createPaymentCSR(addressId, headers);

        // Full browser navigation — the user must reach the bank, not a fetch.
        window.location.assign(payment.paymentUrl);
        return { status: 'redirecting' };
      } catch (error) {
        const reasons = getPaymentNotAllowedReasons(error);
        if (reasons) {
          inFlight.current = false;
          setPending(false);
          return { status: 'not-allowed', reasons };
        }

        // The payment call bypasses the axios interceptor, so replicate its 401
        // handling: drop the stale session and let AuthListener reset the app.
        if (isApiError(error) && error.status === 401 && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        if (!isApiError(error) || !error.handled) {
          toast.error(getApiErrorMessage(error, 'خطا در شروع پرداخت. دوباره تلاش کنید.'));
        }

        inFlight.current = false;
        setPending(false);
        return { status: 'failed' };
      }
    },
    [ensureCsrfToken],
  );

  return { startPayment, pending } as const;
}
