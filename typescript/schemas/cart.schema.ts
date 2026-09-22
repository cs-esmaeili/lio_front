import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Cart contract — /cart, /cart/items                                        */
/* -------------------------------------------------------------------------- */

const CartProductSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
  })
  .catch({ id: 0, name: '', slug: '' });

const CartVariantSchema = z.object({
  id: z.number(),
  sku: z.string().nullable().catch(null),
  price: z.number().catch(0),
  compareAtPrice: z.number().nullable().catch(null),
  stock: z.number().catch(0),
});

export const CartItemSchema = z.object({
  variantId: z.number(),
  quantity: z.number().int().nonnegative().catch(1),
  lineTotal: z.number().catch(0),
  product: CartProductSchema,
  variant: CartVariantSchema,
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema).catch([]),
  itemCount: z.number().catch(0),
  distinctItemCount: z.number().catch(0),
  subtotal: z.number().catch(0),
});

/** Success envelope: `{ statusCode, data, message }`. */
export const CartEnvelopeSchema = z.object({
  statusCode: z.number().optional().catch(undefined),
  data: z.unknown(),
  message: z.string().optional().catch(undefined),
});

/** Error envelope produced by `AllExceptionsFilter`. */
export const CartErrorBodySchema = z.object({
  statusCode: z.number().optional(),
  message: z.string().optional(),
  details: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
});

export type CartProduct = z.infer<typeof CartProductSchema>;
export type CartVariant = z.infer<typeof CartVariantSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;

export const EMPTY_CART: Cart = {
  items: [],
  itemCount: 0,
  distinctItemCount: 0,
  subtotal: 0,
};
