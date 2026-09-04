// typescript/schemas/address-form.schema.ts

import { z } from 'zod';

// --- Address Form Schema ---

export const AddressFormSchema = z
  .object({
    id: z.string().optional(),

    lat: z.union([z.number(), z.string()]).optional(),
    lng: z.union([z.number(), z.string()]).optional(),

    province_id: z
      .number({ error: 'استان الزامی است' })
      .int()
      .positive('استان الزامی است'),

    place_id: z
      .number({ error: 'شهر الزامی است' })
      .int()
      .positive('شهر الزامی است'),

    name_family: z
      .string()
      .trim()
      .min(1, 'نام خانوادگی الزامی است')
      .max(150, 'نام خانوادگی نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد'),

    province: z.string().trim().default(''),

    city: z.string().trim().default(''),

    title: z
      .string()
      .trim()
      .min(1, 'عنوان آدرس الزامی است')
      .max(50, 'عنوان آدرس نمی‌تواند بیشتر از ۵۰ کاراکتر باشد'),

    postalCode: z
      .string()
      .trim()
      .min(1, 'کد پستی الزامی است')
      .regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد'),

    address: z
      .string()
      .trim()
      .min(1, 'آدرس پستی کامل الزامی است')
      .min(10, 'آدرس پستی باید حداقل ۱۰ کاراکتر باشد'),

    receiverType: z.enum(['self', 'other']),

    receiverName: z.string().trim().optional().default(''),
    receiverPhone: z.string().trim().optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.receiverType === 'other') {
      if (!data.receiverName || data.receiverName.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['receiverName'],
          message: 'نام و نام خانوادگی گیرنده الزامی است',
        });
      }

      if (!data.receiverPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['receiverPhone'],
          message: 'شماره تماس گیرنده الزامی است',
        });
      } else if (!/^09\d{9}$/.test(data.receiverPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['receiverPhone'],
          message: 'شماره موبایل وارد شده معتبر نیست',
        });
      }
    }
  });

// --- Types ---

export type AddressFormValues = z.infer<typeof AddressFormSchema>;
