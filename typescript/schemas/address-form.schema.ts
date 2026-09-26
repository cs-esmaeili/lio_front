// typescript/schemas/address-form.schema.ts

import { z } from 'zod';

// --- Address Form Schema ---

export const AddressFormSchema = z.object({
  id: z.string().optional(),

  title: z
    .string()
    .trim()
    .min(1, 'عنوان آدرس الزامی است')
    .max(255, 'عنوان آدرس نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

  address: z
    .string()
    .trim()
    .min(1, 'نشانی دقیق الزامی است')
    .max(1000, 'نشانی دقیق نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد'),

  postalCode: z
    .string()
    .trim()
    .min(1, 'کد پستی الزامی است')
    .regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد'),

  province: z.string().trim().min(1, 'استان الزامی است'),

  locationId: z
    .number({ error: 'شهر الزامی است' })
    .int()
    .positive('شهر الزامی است'),

  /** Send as the default address for this user. */
  isMain: z.boolean().default(false),
});

// --- Types ---

export type AddressFormValues = z.infer<typeof AddressFormSchema>;

/** Empty defaults for a fresh create form. */
export const emptyAddressForm: AddressFormValues = {
  id: undefined,
  title: '',
  address: '',
  postalCode: '',
  province: '',
  locationId: 0,
  isMain: false,
};
