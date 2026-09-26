'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/shadcn/button';
import { OtpInputGroup } from '@/components/login/otp-input-group';
import { LoginSubmitButton } from '@/components/login/login-submit-button';
import { Timer } from '@/components/login/timer';
import { useCheckOtp } from '@/hooks/login/useCheckOtp';
import { useSendOtp } from '@/hooks/login/useSendOtp';
import { useCart } from '@/hooks/cart/useCart';

type Props = {
  phone: string;
  formattedPhone: string;
  onBack: () => void;
  returnUrl?: string;
};

export function OtpForm({ phone, formattedPhone, onBack, returnUrl }: Props) {
  const [otpCode, setOtpCode] = useState('');
  const [otpKey, setOtpKey] = useState(0);
  const { checkOtp, loading } = useCheckOtp();
  const { sendOtp } = useSendOtp();
  const { mergeAfterLogin } = useCart();

  const handleSubmit = async () => {
    if (loading || otpCode.length !== 4) return;

    const result = await checkOtp(phone, otpCode);

    if (!result) {
      return;
    }

    await mergeAfterLogin();

    window.location.href = returnUrl || '/dashboard';
  };

  const handleResend = async () => {
    const result = await sendOtp(phone);
    if (result) {
      toast.success('کد تایید دوباره ارسال شد.');
      setOtpCode('');
      setOtpKey((k) => k + 1);
    }
  };

  useEffect(() => {
    if (otpCode.length === 4 && !loading) {
      handleSubmit();
    }
  }, [otpCode]);

  return (
    <div>
      <div className='mb-6'>
        <h1 className='mb-4 text-xl font-bold text-gray-1'>کد تایید را وارد کنید</h1>
        <p className='text-sm leading-6 text-gray-3'>
          کد تایید برای شماره{' '}
          <span className='font-semibold' dir='ltr'>
            {formattedPhone}
          </span>{' '}
          پیامک شد.
        </p>
      </div>

      <OtpInputGroup
        key={otpKey}
        onChange={(otp: string) => {
          setOtpCode(otp);
        }}
      />

      <div className='mb-5 text-center text-sm text-slate-500'>
        <Timer seconds={120} onResend={handleResend} />
      </div>

      <div onClick={handleSubmit}>
        <LoginSubmitButton loading={loading} text='ارسال' />
      </div>

      <div className='mt-2 text-center'>
        <Button type='button' variant='link' onClick={onBack} className='text-sm text-primary-2 hover:text-primary-1 cursor-pointer'>
          ویرایش شماره 
        </Button>
      </div>
    </div>
  );
}
