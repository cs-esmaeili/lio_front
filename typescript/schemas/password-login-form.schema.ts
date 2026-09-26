import { z } from 'zod';

// --- Password Login Form Schema ---

export const PasswordLoginFormSchema = z.object({
  phone: z
    .string()
    .min(1, 'شماره همراه الزامی است')
    .regex(/^09\d{9}$/, 'شماره موبایل وارد شده معتبر نیست'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

// --- Types ---

export type PasswordLoginFormValues = z.infer<typeof PasswordLoginFormSchema>;
