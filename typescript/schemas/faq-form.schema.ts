// typescript/schemas/contact-us-form.schema.ts

import { z } from 'zod'

// --- Contact Us Form Schema ---

export const FaqFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'نام و نام خانوادگی الزامی است')
    .min(3, 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد')
    .max(100, 'نام و نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

  mobile: z
    .string()
    .trim()
    .min(1, 'شماره همراه الزامی است')
    .regex(/^09\d{9}$/, 'شماره موبایل وارد شده معتبر نیست'),

  description: z
    .string()
    .trim()
    .min(1, 'توضیحات  الزامی است')
    .min(10, 'توضیحات باید حداقل ۱۰ کاراکتر باشد')
    .max(1000, 'توضیحات نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد'),
})

// --- Types ---

export type FaqFormValues = z.infer<typeof FaqFormSchema>
