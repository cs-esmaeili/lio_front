// typescript/schemas/phone-form.schema.ts
import { z } from 'zod'

// --- Phone Form Schema ---

export const PhoneFormSchema = z.object({
  phone: z
    .string()
    .min(1, 'شماره همراه الزامی است')
    .regex(/^09\d{9}$/, 'شماره موبایل وارد شده معتبر نیست'),
})

// --- Types ---

export type PhoneFormValues = z.infer<typeof PhoneFormSchema>
