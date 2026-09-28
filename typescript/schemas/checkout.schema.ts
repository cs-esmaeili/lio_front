import { z } from 'zod';

import { AddressSchema } from '@/typescript/schemas/address.schema';
import { CartItemSchema } from '@/typescript/schemas/cart.schema';
import { PaymentEligibilitySchema, paymentEligibilityUnknown } from '@/typescript/schemas/payment-eligibility.schema';

/* -------------------------------------------------------------------------- */
/*  Checkout contract — GET /checkout                                          */
/* -------------------------------------------------------------------------- */

const CheckoutShippingSchema = z.object({
  enabled: z.boolean().catch(false),
  cost: z.number().catch(0),
  freeOver: z.number().catch(0),
});

const CheckoutCustomerSchema = z.object({
  id: z.number(),
  phone: z.string().catch(''),
  name: z.string().nullable().catch(null),
  lastName: z.string().nullable().catch(null),
});

const CheckoutPaymentSchema = z.object({
  provider: z.string().catch(''),
});

/**
 * Single payload rendered by the checkout page. The line shape is identical to
 * a cart line, so it reuses `CartItemSchema`; addresses reuse `AddressSchema`
 * so the UI keeps the flattened `Address` model.
 */
export const CheckoutSchema = z.object({
  items: z.array(CartItemSchema).catch([]),
  itemCount: z.number().catch(0),
  distinctItemCount: z.number().catch(0),
  subtotal: z.number().catch(0),
  shippingCost: z.number().catch(0),
  orderDiscount: z.number().catch(0),
  totalDiscount: z.number().catch(0),
  total: z.number().catch(0),
  shipping: CheckoutShippingSchema.catch({ enabled: false, cost: 0, freeOver: 0 }),
  customer: CheckoutCustomerSchema.catch({ id: 0, phone: '', name: null, lastName: null }),
  addresses: z.array(AddressSchema).catch([]),
  defaultAddressId: z.number().nullable().catch(null),
  payment: CheckoutPaymentSchema.catch({ provider: '' }),
  /** Server-owned gate for `POST /payments`. */
  paymentEligibility: PaymentEligibilitySchema.catch(paymentEligibilityUnknown),
});

export type CheckoutShipping = z.infer<typeof CheckoutShippingSchema>;
export type CheckoutCustomer = z.infer<typeof CheckoutCustomerSchema>;
export type CheckoutPayment = z.infer<typeof CheckoutPaymentSchema>;
export type CheckoutItem = z.infer<typeof CartItemSchema>;
export type Checkout = z.infer<typeof CheckoutSchema>;
