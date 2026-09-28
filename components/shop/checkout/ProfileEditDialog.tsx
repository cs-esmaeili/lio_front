'use client';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import ProfileEditForm from '@/components/profile/ProfileEditForm';

import type { PaymentEligibilityReason } from '@/typescript/schemas/payment-eligibility.schema';
import type { Profile } from '@/typescript/schemas/profile.schema';

/**
 * Maps a reason `code` to a user-facing (Persian) text. `code` is the stable
 * contract, so unknown codes fall back to the server-provided `message`.
 */
const ELIGIBILITY_MESSAGES: Record<string, string> = {
  PROFILE_INCOMPLETE: 'برای پرداخت، ابتدا نام، نام خانوادگی و کد ملی خود را در پروفایل ثبت کنید.',
};

const getEligibilityReasonText = (reason: PaymentEligibilityReason): string =>
  ELIGIBILITY_MESSAGES[reason.code] ?? reason.message;

/**
 * Checkout dialog that reuses the profile edit form to complete the data the
 * backend requires before payment. Shown with the `reasons` returned by
 * `GET /checkout` or by a `409 PAYMENT_NOT_ALLOWED` from `POST /payments`.
 */
export default function ProfileEditDialog({
  open,
  onOpenChange,
  reasons = [],
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reasons?: PaymentEligibilityReason[];
  onSaved?: (profile: Profile) => void;
}) {
  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title='تکمیل اطلاعات کاربری' size='md'>
      <div className='flex w-full flex-col gap-5'>
        {reasons.length > 0 && (
          <div className='rounded-xl bg-gray-1 p-4 text-sm text-secondary-1'>
            <p className='mb-2 font-medium'>برای پرداخت، موارد زیر را تکمیل کنید:</p>

            <ul className='list-disc space-y-1 pr-5'>
              {reasons.map((reason, index) => (
                <li key={`${reason.code}-${index}`}>{getEligibilityReasonText(reason)}</li>
              ))}
            </ul>
          </div>
        )}

        <ProfileEditForm requireComplete submitLabel='ذخیره و ادامه' onSaved={onSaved} />
      </div>
    </ReusableModal>
  );
}
