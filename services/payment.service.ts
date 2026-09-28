import { ApiError, isApiError } from '@/utils/api-error';
import {
  CreatePaymentEnvelopeSchema,
  CreatePaymentSchema,
  PaymentErrorBodySchema,
  PaymentResultSchema,
  type CreatePayment,
  type PaymentResult,
} from '@/typescript/schemas/payment.schema';
import {
  PaymentNotAllowedBodySchema,
  type PaymentEligibilityReason,
} from '@/typescript/schemas/payment-eligibility.schema';

const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

function extractMessage(body: unknown): string {
  const parsed = PaymentErrorBodySchema.safeParse(body);
  if (parsed.success) {
    if (parsed.data.message) return parsed.data.message;
    if (parsed.data.details?.length) {
      return parsed.data.details.map((detail) => detail.message).join('، ');
    }
  }
  return 'درخواست با خطا مواجه شد';
}

/**
 * `POST /payments` — builds the order from the cart, reserves stock, registers
 * the payment and returns the gateway URL. Validation/transform happens here, at
 * the service boundary.
 */
export const createPaymentCSR = async (addressId: number, headers: Headers): Promise<CreatePayment> => {
  const response = await fetch(`${csrPrefixUrl}/payments`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ addressId }),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, extractMessage(body), body);
  }

  const envelope = CreatePaymentEnvelopeSchema.safeParse(body);
  if (!envelope.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', envelope.error);
  }

  const parsed = CreatePaymentSchema.safeParse(envelope.data.data);
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', parsed.error);
  }

  return parsed.data;
};

/**
 * Extracts the unmet requirements from the `409 PAYMENT_NOT_ALLOWED` error so
 * the UI can open the profile-completion dialog. Returns `null` for any other
 * error (including a `409` that carries a different shape).
 */
export const getPaymentNotAllowedReasons = (error: unknown): PaymentEligibilityReason[] | null => {
  if (!isApiError(error) || error.status !== 409) return null;

  const parsed = PaymentNotAllowedBodySchema.safeParse(error.data);
  return parsed.success ? parsed.data.reasons : null;
};

/**
 * Validates the query string the backend appends to the result redirect. A
 * query-string value may be an array when repeated, so only the first is used.
 */
export const parsePaymentResultQuery = (
  params: Record<string, string | string[] | undefined>,
): PaymentResult => {
  const first = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

  const parsed = PaymentResultSchema.safeParse({
    status: first(params.status),
    orderId: first(params.orderId),
    orderNumber: first(params.orderNumber),
    refId: first(params.refId),
    reason: first(params.reason),
  });

  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', parsed.error);
  }

  return parsed.data;
};
