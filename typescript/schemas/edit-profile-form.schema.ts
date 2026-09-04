import { z } from 'zod';

export const EditProfileFormSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'نام الزامی است')
            .max(70, 'نام نمی‌تواند بیشتر از ۷۰ کاراکتر باشد')
            .optional(),

        last_name: z
            .string()
            .trim()
            .min(1, 'نام خانوادگی الزامی است')
            .max(110, 'نام خانوادگی نمی‌تواند بیشتر از ۱۱۰ کاراکتر باشد')
            .optional(),

        national_code: z
            .string()
            .trim()
            .regex(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد')
            .optional(),

        email: z
            .string()
            .trim()
            .max(250, 'ایمیل نمی‌تواند بیشتر از ۲۵۰ کاراکتر باشد')
            .email('فرمت ایمیل وارد شده معتبر نیست')
            .optional(),

        password: z
            .string()
            .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
            .optional()
            .or(z.literal('')),

        password_confirmation: z
            .string()
            .optional()
            .or(z.literal('')),

        birth_year: z
            .string()
            .regex(/^\d{4}$/, 'سال تولد باید ۴ رقم باشد')
            .optional(),

        birth_month: z
            .string()
            .regex(/^\d+$/, 'ماه تولد باید عدد باشد')
            .refine((value) => {
                const month = Number(value);
                return month >= 1 && month <= 12;
            }, 'ماه تولد باید بین ۱ تا ۱۲ باشد')
            .optional(),

        birth_day: z
            .string()
            .regex(/^\d+$/, 'روز تولد باید عدد باشد')
            .refine((value) => {
                const day = Number(value);
                return day >= 1 && day <= 31;
            }, 'روز تولد باید بین ۱ تا ۳۱ باشد')
            .optional(),
    })
    .superRefine((data, ctx) => {
        // password → password_confirmation
        if (data.password) {
            if (!data.password_confirmation) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['password_confirmation'],
                    message: 'تکرار رمز عبور الزامی است',
                });
            } else if (data.password !== data.password_confirmation) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['password_confirmation'],
                    message: 'تکرار رمز عبور با رمز عبور یکسان نیست',
                });
            }
        }

        // Birthday required_with logic
        const hasYear = Boolean(data.birth_year);
        const hasMonth = Boolean(data.birth_month);
        const hasDay = Boolean(data.birth_day);

        if (hasYear || hasMonth || hasDay) {
            if (!hasYear) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['birth_year'],
                    message: 'سال تولد الزامی است',
                });
            }

            if (!hasMonth) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['birth_month'],
                    message: 'ماه تولد الزامی است',
                });
            }

            if (!hasDay) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['birth_day'],
                    message: 'روز تولد الزامی است',
                });
            }
        }
    });

export type EditProfileFormValues = z.infer<typeof EditProfileFormSchema>;