'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'iconsax-reactjs';

import ReusableModal from '@/components/global/Modal/ReusableModal';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import Icon from '@/components/global/Icon';

import { useUpdateMobilePhone, type MobilePhoneStep } from '@/hooks/dashboard/useUpdateMobilePhone';

interface PhoneUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhone: string;
  onSuccess?: () => void;
}

// ─── Step Titles ──────────────────────────────────────

const stepTitles: Record<MobilePhoneStep, string> = {
  idle: '',
  'enter-new-phone': 'تغییر شماره موبایل',
  'verify-current-phone': 'تایید شماره فعلی',
  'verify-new-phone': 'تایید شماره جدید',
};

// ─── OTP Input ────────────────────────────────────────

function OtpInput({
  value,
  onChange,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
}) {
  return (
    <Input
      className="h-14 text-center text-lg tracking-[0.5em] font-mono"
      placeholder="•••••"
      inputMode="numeric"
      maxLength={5}
      dir="ltr"
      value={value}
      disabled={loading}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, '').slice(0, 5);
        onChange(v);
      }}
    />
  );
}

// ─── Countdown Timer ──────────────────────────────────

function OtpTimer({ seconds, onResend }: { seconds: number; onResend: () => void }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [remaining]);

  if (remaining <= 0) {
    return (
      <button
        type="button"
        className="text-sm text-primary-1 hover:underline cursor-pointer"
        onClick={onResend}
      >
        ارسال مجدد کد
      </button>
    );
  }

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  return (
    <div className="flex items-center gap-1 text-sm text-secondary-2">
      <Icon IconComponent={Clock} className="text-secondary-2" size={16} variant="Linear" />
      <span>
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────

export default function PhoneUpdateModal({
  open,
  onOpenChange,
  currentPhone,
  onSuccess,
}: PhoneUpdateModalProps) {
  const {
    step,
    loading,
    newPhone,
    smsTtl,
    submitNewPhone,
    sendCodeToCurrentPhone,
    verifyCurrentPhoneCode,
    verifyNewPhoneCode,
    reset,
    start,
  } = useUpdateMobilePhone(currentPhone);

  // Local field state
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Start flow when modal opens
  useEffect(() => {
    if (open && step === 'idle') {
      start();
    }
  }, [open, step, start]);

  // Auto-send code when entering verify-current-phone step
  useEffect(() => {
    if (step === 'verify-current-phone' && open) {
      sendCodeToCurrentPhone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, open]);

  // Reset on close
  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);
    if (!value) {
      reset();
      setPhoneInput('');
      setOtpInput('');
      setPhoneError('');
    }
  };

  // ── Step: Enter New Phone ────────────────────────

  const handleEnterNewPhone = async () => {
    setPhoneError('');

    const cleaned = phoneInput.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 10) {
      setPhoneError('شماره موبایل معتبر وارد کنید');
      return;
    }

    // Format for API: 09XXXXXXXXX
    const mobile = cleaned.startsWith('0') ? cleaned : `0${cleaned}`;

    const result = await submitNewPhone(mobile);
    if (result) {
      setOtpInput('');
    }
  };

  // ── Step: Verify Current Phone Code ──────────────

  const handleVerifyCurrent = async () => {
    if (otpInput.length < 4) return;
    const result = await verifyCurrentPhoneCode(otpInput);
    if (result) {
      setOtpInput('');
    }
  };

  // ── Step: Verify New Phone Code ──────────────────

  const handleVerifyNew = async () => {
    if (otpInput.length < 4) return;
    const result = await verifyNewPhoneCode(otpInput);
    if (result) {
      handleOpenChange(false);
      onSuccess?.();
    }
  };

  // ── Primary button action ────────────────────────

  const handlePrimaryAction = () => {
    switch (step) {
      case 'enter-new-phone':
        handleEnterNewPhone();
        break;
      case 'verify-current-phone':
        handleVerifyCurrent();
        break;
      case 'verify-new-phone':
        handleVerifyNew();
        break;
    }
  };

  const primaryLabel = () => {
    switch (step) {
      case 'enter-new-phone':
        return 'ادامه';
      case 'verify-current-phone':
      case 'verify-new-phone':
        return loading ? 'در حال بررسی...' : 'تایید کد';
      default:
        return '';
    }
  };

  // ── Render ───────────────────────────────────────

  const title = stepTitles[step] || 'تغییر شماره موبایل';

  const footer = (
    <div className="flex flex-row items-center justify-between gap-3">
      <Button
        type="button"
        className="basis-1/3 h-12 rounded-xl bg-white hover:bg-white text-primary-1 hover:text-primary-1 border border-primary-1 cursor-pointer"
        variant="outline"
        disabled={loading}
        onClick={() => handleOpenChange(false)}
      >
        انصراف
      </Button>

      <Button
        type="button"
        className="basis-2/3 h-12 rounded-xl bg-primary-1 hover:bg-primary-black-1 text-white border border-primary-1 cursor-pointer"
        disabled={loading || (step !== 'enter-new-phone' && otpInput.length < 4)}
        onClick={handlePrimaryAction}
      >
        {primaryLabel()}
      </Button>
    </div>
  );

  return (
    <ReusableModal
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      footer={footer}
      size="sm"
    >
      <div className="flex flex-col gap-6">
        {/* ── Step: Enter New Phone ── */}
        {step === 'enter-new-phone' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-secondary-2">
              شماره موبایل جدید خود را وارد کنید. کد تایید به شماره فعلی شما ارسال خواهد شد.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-secondary-2">شماره موبایل جدید</label>
              <Input
                className="h-12"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                inputMode="numeric"
                maxLength={11}
                dir="ltr"
                value={phoneInput}
                disabled={loading}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 11);
                  setPhoneInput(v);
                  setPhoneError('');
                }}
              />
              {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
            </div>
          </div>
        )}

        {/* ── Step: Verify Current Phone ── */}
        {step === 'verify-current-phone' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-secondary-2">
              کد تایید ۵ رقمی ارسال شده به شماره{' '}
              <span className="font-medium text-secondary-1" dir="ltr">{currentPhone}</span> را وارد کنید.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-secondary-2">کد تایید</label>
              <OtpInput value={otpInput} onChange={setOtpInput} loading={loading} />
            </div>

            <div className="flex items-center justify-between">
              <OtpTimer seconds={smsTtl} onResend={sendCodeToCurrentPhone} />
            </div>
          </div>
        )}

        {/* ── Step: Verify New Phone ── */}
        {step === 'verify-new-phone' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-secondary-2">
              کد تایید ۵ رقمی ارسال شده به شماره جدید{' '}
              <span className="font-medium text-secondary-1" dir="ltr">{newPhone}</span> را وارد کنید.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-secondary-2">کد تایید</label>
              <OtpInput value={otpInput} onChange={setOtpInput} loading={loading} />
            </div>

            <OtpTimer seconds={smsTtl} onResend={() => sendCodeToCurrentPhone()} />
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-2xl">
            <Spinner className="size-8 text-primary-1" />
          </div>
        )}
      </div>
    </ReusableModal>
  );
}
