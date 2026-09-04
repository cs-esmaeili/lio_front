import { z } from 'zod';

export const TicketFormSchema = z.object({
  part_id: z.string().min(1, 'انتخاب بخش الزامی است'),
  order_id: z.string().min(1, 'انتخاب بخش الزامی است'),
  title: z.string().min(1, 'عنوان تیکت الزامی است'),
  message: z.string().min(1, 'متن تیکت الزامی است'),
});

export type TicketFormValues = z.infer<typeof TicketFormSchema>;
