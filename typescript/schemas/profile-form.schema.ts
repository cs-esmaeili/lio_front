import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Edit-profile form — PATCH /profile                                        */
/* -------------------------------------------------------------------------- */

/**
 * Client-side validation for the profile form. All fields are optional at the
 * API level, so an empty value simply means "leave unchanged".
 */
export const ProfileFormSchema = z.object({
  name: z.string().trim().max(255, 'نام نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

  lastName: z.string().trim().max(255, 'نام خانوادگی نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

  nationalCode: z
    .string()
    .trim()
    .refine((value) => value === '' || /^\d{10}$/.test(value), 'کد ملی باید دقیقاً ۱۰ رقم باشد'),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

/**
 * Stricter variant used when the profile is being completed to unlock payment:
 * all three payment-eligibility fields are required.
 */
export const ProfileCompletionSchema = z.object({
  name: z.string().trim().min(1, 'نام را وارد کنید').max(255, 'نام نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

  lastName: z
    .string()
    .trim()
    .min(1, 'نام خانوادگی را وارد کنید')
    .max(255, 'نام خانوادگی نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

  nationalCode: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'کد ملی باید دقیقاً ۱۰ رقم باشد'),
});

/** Empty defaults for a fresh form (before the profile is loaded). */
export const emptyProfileForm: ProfileFormValues = {
  name: '',
  lastName: '',
  nationalCode: '',
};
