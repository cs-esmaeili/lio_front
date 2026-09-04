'use client';

import CurrencyLabel from '@/components/global/Cards/CurrencyLabel';

interface OrderInvoiceProps {
  subtotal: number;

  shippingCost: number;

  discount: number;

  totalPrice: number;

  currency: string;
}

export default function OrderInvoice({ subtotal, shippingCost, discount, totalPrice, currency }: OrderInvoiceProps) {
  //------------------------------------------------------

  const formatPrice = (price: number) => `${price.toLocaleString('fa-IR')}`;

  //------------------------------------------------------

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 pt-3.5'>
      <InvoiceRow title='جمع کالا : ' value={formatPrice(subtotal)} />

      <InvoiceRow title='هزینه ارسال : ' value={formatPrice(shippingCost)} />

      <InvoiceRow title='تخفیف : ' value={formatPrice(discount)} />
      <div className='border-t border-gray-200 col-span-1 lg:col-span-3' />
      <div />
      <div />
      <InvoiceRow title='مبلغ نهایی : ' value={formatPrice(totalPrice)} bold />
    </div>
  );
}

interface InvoiceRowProps {
  title: string;

  value: string;

  bold?: boolean;
}

function InvoiceRow({ title, value, bold = false }: InvoiceRowProps) {
  return (
    <div className='flex items-center gap-1 whitespace-nowrap'>
      <div className='flex-1 flex'>
        <span className={bold ? 'font-regular text-secondary-1' : 'text-gray-400'}>{title}</span>

        <span className={bold ? 'font-semibold text-secondary-1 px-2' : 'text-gray-400 px-2'}>{value}</span>
        <CurrencyLabel />
      </div>
    </div>
  );
}
