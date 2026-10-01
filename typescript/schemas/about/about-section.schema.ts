import { z } from 'zod';

const AboutStatisticSchema = z.object({
  id: z.number(),
  title: z.string().catch(''),
  description: z.string().catch(''),
  number: z.number().catch(0),
});

/**
 * GET /page-sections/section?location=ABOUT
 * Envelope: { statusCode, data: { ...section, data: AboutSectionData }, message }
 */
export const AboutSectionSchema = z
  .object({
    statusCode: z.number(),
    data: z.object({
      data: z.object({
        headerTitle: z.string().nullable().catch(null),
        headerDescription: z.string().nullable().catch(null),
        headerFileUrl: z.string().nullable().catch(null),
        historyTitle: z.string().nullable().catch(null),
        historyDescription: z.string().nullable().catch(null),
        founderTitle: z.string().nullable().catch(null),
        founderSubtitle: z.string().nullable().catch(null),
        founderDescription: z.string().nullable().catch(null),
        founderFileUrl: z.string().nullable().catch(null),
        founderSignatureFileUrl: z.string().nullable().catch(null),
        statistics: z.array(AboutStatisticSchema).default([]),
      }),
    }),
    message: z.string().optional(),
  })
  .transform((response) => response.data.data);

export type AboutData = z.infer<typeof AboutSectionSchema>;
export type AboutStatistic = z.infer<typeof AboutStatisticSchema>;
