'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthHeader } from '@/components/login/login-header';
import { PhoneForm } from '@/components/login/phone-form';
import { OtpForm } from '@/components/login/otp-form';
import { PasswordForm } from '@/components/login/password-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';

type Step = 'phone' | 'otp';
type LoginTab = 'otp' | 'password';

type Props = {
  logo?: string;
};

const formatPhone = (value: string) =>
  value.length === 11 ? value.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3') : value;

export function LoginContent({ logo }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || undefined;
  const [tab, setTab] = useState<LoginTab>('otp');
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');

  const handlePhoneSubmit = (phoneValue: string) => {
    setPhone(phoneValue);
    setStep('otp');
  };

  const handleTabChange = (value: string) => {
    setTab(value as LoginTab);
    setStep('phone');
  };

  const handleBack = () => {
    if (tab === 'otp' && step === 'otp') {
      setStep('phone');
      return;
    }
    router.push('/');
  };

  const formattedPhone = formatPhone(phone);

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <div className='w-full max-w-100 rounded-2xl border border-primary-1 p-8 shadow-[0_0_48px_rgba(200,30,46,0.06)]'>
        <AuthHeader onBack={handleBack} logo={logo} />

        <Tabs value={tab} onValueChange={handleTabChange} className='w-full'>
          <TabsList variant='line' className='mx-auto mb-8 gap-8'>
            <TabsTrigger
              value='otp'
              className='text-sm text-secondary-2 data-active:text-primary-1 hover:text-secondary-1 after:bg-primary-1'>
              ورود با کد تایید
            </TabsTrigger>
            <TabsTrigger
              value='password'
              className='text-sm text-secondary-2 data-active:text-primary-1 hover:text-secondary-1 after:bg-primary-1'>
              ورود با رمز عبور
            </TabsTrigger>
          </TabsList>

          <TabsContent value='otp'>
            {step === 'phone' && <PhoneForm onSubmit={handlePhoneSubmit} />}

            {step === 'otp' && (
              <OtpForm
                phone={phone}
                formattedPhone={formattedPhone}
                onBack={handleBack}
                returnUrl={returnUrl}
              />
            )}
          </TabsContent>

          <TabsContent value='password'>
            <PasswordForm returnUrl={returnUrl} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
