'use client';

import { useForm, Controller } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';

import { TicketFormSchema, type TicketFormValues } from '@/typescript/schemas/ticket-form.schema';

import { usePartsList } from '@/hooks/ticket/usePartsList';
import { useOrdersIdList } from '@/hooks/useOrdersIdList';

interface TicketFormProps {
  onSubmit: (data: TicketFormValues) => void;
}

export default function TicketForm({ onSubmit }: TicketFormProps) {
  const { parts, loading: partsLoading } = usePartsList();
  const { orders, loading: ordersLoading } = useOrdersIdList();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: standardSchemaResolver(TicketFormSchema),
    defaultValues: {
      part_id: '',
      order_id: '',
      title: '',
      message: '',
    },
  });

  //--------------------------------------------------------

  return (
    <form id="ticket-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5">
        {/* بخش + دسته بندی */}

        <div className="grid grid-cols-2 gap-4">

          <div className="flex flex-col gap-2">
            <label className="text-sm text-secondary-1">واحد پشتیبانی</label>

            <Controller
              control={control}
              name="part_id"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={partsLoading}
                >
                  <SelectTrigger className="!h-12 w-full" dir="rtl">
                    <SelectValue
                      placeholder={partsLoading ? 'در حال دریافت...' : 'بخش مورد نظر را انتخاب کنید'}
                    />
                  </SelectTrigger>

                  <SelectContent dir="rtl" position="popper" className="z-50" onCloseAutoFocus={(e) => e.preventDefault()}>
                    {parts.map((part) => (
                      <SelectItem key={part.id} value={String(part.id)}>
                        {part.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.part_id && <p className="text-xs text-red-500">{errors.part_id.message}</p>}
          </div>


          <div className="flex flex-col gap-2">
            <label className="text-sm text-secondary-1">شماره سفارش</label>

            <Controller
              control={control}
              name="order_id"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={ordersLoading}
                >
                  <SelectTrigger className="!h-12 w-full" dir="rtl">
                    <SelectValue
                      placeholder={ordersLoading ? 'در حال دریافت...' : 'سفارش مورد نظر را انتخاب کنید'}
                    />
                  </SelectTrigger>

                  <SelectContent dir="rtl" position="popper" className="z-50" onCloseAutoFocus={(e) => e.preventDefault()}>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={String(order.id)}>
                        {order.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.order_id && <p className="text-xs text-red-500">{errors.order_id.message}</p>}
          </div>

          {/* دسته بندی */}

          {/* <div className="flex flex-col gap-2">
            <label className="text-sm text-secondary-1">دسته‌بندی</label>

            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  category: value,
                }))
              }>
              <SelectTrigger className="!h-12 w-full" dir="rtl">
                <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
              </SelectTrigger>

              <SelectContent dir="rtl" position="popper" className="z-50" onCloseAutoFocus={(e) => e.preventDefault()}>
                <SelectItem value="order">سفارش</SelectItem>

                <SelectItem value="payment">پرداخت</SelectItem>

                <SelectItem value="support">پشتیبانی</SelectItem>

                <SelectItem value="other">سایر</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        {/* عنوان */}

        <div className="flex flex-col gap-2">
          <label className="text-sm text-secondary-1">عنوان تیکت</label>

          <Input className="h-12" placeholder="عنوان تیکت" {...register('title')} />

          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        {/* متن */}

        <div className="flex flex-col gap-2">
          <label className="text-sm text-secondary-1">متن تیکت</label>

          <Textarea
            className="min-h-[180px] resize-none"
            placeholder="متن تیکت را وارد کنید..."
            {...register('message')}
          />

          {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
        </div>

        {/* فایل پیوست */}

        {/* <div className="flex flex-col gap-2">
          <label className="text-sm text-secondary-1">فایل پیوست</label>

          <Input type="file" className="h-12" onChange={handleFileChange} />

          {formData.attachment && (
            <span className="text-xs text-gray-500">{formData.attachment.name}</span>
          )}
        </div> */}
      </div>
    </form>
  );
}
