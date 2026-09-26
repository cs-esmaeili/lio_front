import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Payment contract — POST /payments, redirect result of GET /payments/callback */
/* -------------------------------------------------------------------------- */

/**
 * `POST /payments` success payload. `paymentUrl` is where the browser must be
 * sent with a full navigation (`window.location.assign`), never via fetch.
 */
export const CreatePaymentSchema = z.object({
  orderId: z.number().int().positive(),
  orderNumber: z.string(),
  amount: z.number().catch(0),
  provider: z.string().catch(''),
  paymentUrl: z.string().url(),
});

export type CreatePayment = z.infer<typeof CreatePaymentSchema>;

/** Success envelope: `{ statusCode, data, message }`. */
export const CreatePaymentEnvelopeSchema = z.object({
  statusCode: z.number().optional().catch(undefined),
  data: z.unknown(),
  message: z.string().optional().catch(undefined),
});

/** Error envelope produced by `AllExceptionsFilter`. */
export const PaymentErrorBodySchema = z.object({
  statusCode: z.number().optional(),
  message: z.string().optional(),
  details: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
});

/* -------------------------------------------------------------------------- */
/*  Result redirect — query params the backend appends after the bank callback  */
/* -------------------------------------------------------------------------- */

export const PaymentResultStatusSchema = z.enum(['success', 'failed']);
export type PaymentResultStatus = z.infer<typeof PaymentResultStatusSchema>;

/** `reason` is only present on failures. */
export const PaymentFailureReasonSchema = z.enum([
  'missing_authority',
  'not_found',
  'canceled',
  'verify_failed',
  'not_payable',
]);
export type PaymentFailureReason = z.infer<typeof PaymentFailureReasonSchema>;

/**
 * Parsed `/payment/result` query string. Every field is defensive: a malformed
 * or missing value degrades to a null/failed result instead of throwing, so the
 * page always renders something meaningful.
 */
export const PaymentResultSchema = z.object({
  status: PaymentResultStatusSchema.catch('failed'),
  orderId: z.coerce.number().int().positive().nullable().catch(null),
  orderNumber: z.string().nullable().catch(null),
  refId: z.string().nullable().catch(null),
  reason: PaymentFailureReasonSchema.nullable().catch(null),
});

export type PaymentResult = z.infer<typeof PaymentResultSchema>;
