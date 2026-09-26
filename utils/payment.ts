import type { PaymentFailureReason } from '@/typescript/schemas/payment.schema';

/** User-facing text for every `reason` the backend can append on a failure. */
const FAILURE_MESSAGES: Record<PaymentFailureReason, string> = {
  missing_authority: 'اطلاعات تراکنش ناقص است. لطفاً یک‌بار دیگر تلاش کنید.',
  not_found: 'تراکنش مورد نظر پیدا نشد.',
  canceled: 'پرداخت لغو شد یا توسط بانک تأیید نشد.',
  verify_failed:
    'تأیید پرداخت از سوی بانک ناموفق بود. در صورت کسر وجه، مبلغ تا ۷۲ ساعت آینده به حساب شما بازمی‌گردد.',
  not_payable: 'این سفارش قابل پرداخت نیست.',
};

const DEFAULT_FAILURE_MESSAGE = 'پرداخت با خطا مواجه شد. لطفاً دوباره تلاش کنید.';

export const getPaymentFailureMessage = (reason: PaymentFailureReason | null): string =>
  reason ? FAILURE_MESSAGES[reason] : DEFAULT_FAILURE_MESSAGE;
