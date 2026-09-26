import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Auth contract — /auth/csrf, /auth/otp/*, /auth/me, /auth/logout           */
/* -------------------------------------------------------------------------- */

/** Public user shape returned by `/auth/otp/verify`, `/auth/me` and `/auth/logout`. */
export const AuthUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().nullable().catch(null),
  lastName: z.string().nullable().catch(null),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

export const MeSchema = z.object({
  authenticated: z.boolean().catch(false),
  user: AuthUserSchema.nullable().catch(null),
  loading: z.boolean().catch(false),
});

export type Me = z.infer<typeof MeSchema>;

export const OtpRequestSchema = z.object({
  ttlSeconds: z.number().catch(120),
});

export type OtpRequest = z.infer<typeof OtpRequestSchema>;

export const LogoutSchema = z.object({
  ok: z.boolean().catch(true),
});

/** Success envelope: `{ statusCode, data, message }`. */
export const AuthEnvelopeSchema = z.object({
  statusCode: z.number().optional().catch(undefined),
  data: z.unknown(),
  message: z.string().optional().catch(undefined),
});

/** Error envelope produced by `AllExceptionsFilter`. */
export const AuthErrorBodySchema = z.object({
  statusCode: z.number().optional(),
  message: z.string().optional(),
  details: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
});
