import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Payment eligibility contract                                              */
/*                                                                            */
/*  Shared by `GET /checkout` (`data.paymentEligibility`) and the `409`        */
/*  `PAYMENT_NOT_ALLOWED` body of `POST /payments`. New reason codes may be    */
/*  added later, so `code` stays a free string and callers must switch on it.  */
/* -------------------------------------------------------------------------- */

export const PaymentEligibilityReasonSchema = z.object({
  code: z.string(),
  message: z.string().catch(''),
  fields: z.array(z.string()).optional(),
});

export type PaymentEligibilityReason = z.infer<typeof PaymentEligibilityReasonSchema>;

export const PaymentEligibilitySchema = z.object({
  eligible: z.boolean().catch(true),
  reasons: z.array(PaymentEligibilityReasonSchema).catch([]),
});

export type PaymentEligibility = z.infer<typeof PaymentEligibilitySchema>;

/** Fallback used when the backend omits `paymentEligibility` (older API). */
export const paymentEligibilityUnknown: PaymentEligibility = { eligible: true, reasons: [] };

/**
 * Error body of `POST /payments` when the payment requirements are not met.
 * `code`/`reasons` only exist on this specific `409`, so it is parsed on its own.
 */
export const PaymentNotAllowedBodySchema = z.object({
  statusCode: z.number().optional(),
  message: z.string().optional(),
  code: z.literal('PAYMENT_NOT_ALLOWED'),
  reasons: z.array(PaymentEligibilityReasonSchema).catch([]),
});

export type PaymentNotAllowedBody = z.infer<typeof PaymentNotAllowedBodySchema>;
