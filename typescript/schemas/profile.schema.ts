import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Profile contract — /profile (current session user only)                   */
/* -------------------------------------------------------------------------- */

/**
 * The authenticated user's own profile (`GET /profile`, `PATCH /profile`).
 *
 * `username` is the login identifier (phone number) and is read-only; only
 * `name`, `lastName` and `nationalCode` can be edited.
 */
export const ProfileSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().nullable().catch(null),
  lastName: z.string().nullable().catch(null),
  nationalCode: z.string().nullable().catch(null),
  createdAt: z.string().catch(''),
  updatedAt: z.string().catch(''),
});

export type Profile = z.infer<typeof ProfileSchema>;

/** Editable fields of `PATCH /profile` — a partial update of the profile. */
export const UpdateProfileInputSchema = z.object({
  name: z.string().optional(),
  lastName: z.string().optional(),
  nationalCode: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

/** Error envelope produced by the backend (`AllExceptionsFilter`). */
export const ProfileErrorSchema = z.object({
  statusCode: z.number().optional(),
  message: z.string().optional(),
  details: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
});

/** A field-level error surfaced by the server (e.g. a taken national code). */
export const ProfileFieldErrorSchema = z.object({
  field: z.literal('nationalCode'),
  message: z.string(),
});

export type ProfileFieldError = z.infer<typeof ProfileFieldErrorSchema>;
