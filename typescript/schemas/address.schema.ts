import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Address & location contract — /addresses, /locations                      */
/* -------------------------------------------------------------------------- */

/** Province/city pair shared by every address (`GET /locations`). */
export const LocationSchema = z.object({
  id: z.number(),
  province: z.string(),
  city: z.string(),
  createdAt: z.string().optional().catch(undefined),
  updatedAt: z.string().optional().catch(undefined),
});

export type Location = z.infer<typeof LocationSchema>;

/**
 * Address returned by `/addresses`.
 *
 * The API nests the province/city under `location`; the domain model flattens
 * it (and casts `id` to a string) so the existing UI keeps working unchanged.
 */
export const AddressSchema = z
  .object({
    id: z.number(),
    title: z.string().catch(''),
    address: z.string().catch(''),
    postalCode: z.string().catch(''),
    isMain: z.boolean().catch(false),
    locationId: z.number(),
    location: LocationSchema,
    createdAt: z.string().optional().catch(undefined),
    updatedAt: z.string().optional().catch(undefined),
  })
  .transform((address) => ({
    id: String(address.id),
    title: address.title,
    address: address.address,
    postalCode: address.postalCode,
    isMain: address.isMain,
    locationId: address.locationId,
    province: address.location.province,
    city: address.location.city,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
  }));

export type Address = z.infer<typeof AddressSchema>;
