import { z } from 'zod';
import { resolveFileUrl } from '@/utils/fileUrl';

const ContactSocialSchema = z
  .object({
    key: z.string(),
    title: z.string(),
    image: z.string(),
    fullUrl: z.string(),
  })
  .transform((social) => ({
    key: social.key,
    title: social.title,
    image: resolveFileUrl(social.image) ?? '',
    fullUrl: social.fullUrl,
  }));

/**
 * GET /page-sections/section?location=CONTACT
 * Envelope: { statusCode, data: { ...section, data: ContactSectionData }, message }
 */
export const ContactSectionSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({
      data: z.object({
        address: z.string().nullable().catch(null),
        email: z.string().nullable().catch(null),
        supportHour: z.string().nullable().catch(null),
        mapLat: z.number().nullable().catch(null),
        mapLng: z.number().nullable().catch(null),
        supportPhone: z.string().nullable().catch(null),
        socials: z.array(ContactSocialSchema).default([]),
      }),
    }),
    message: z.string().optional(),
  })
  .transform((response) => response.data.data);

export type ContactData = z.infer<typeof ContactSectionSchema>;
export type ContactSocial = z.infer<typeof ContactSocialSchema>;
