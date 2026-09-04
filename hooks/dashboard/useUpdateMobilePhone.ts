'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  updateMobilePhone,
  sendCurrentPhoneCode,
  confirmCurrentPhoneCode,
  confirmNewPhoneCode,
  type UpdateMobilePhonePayload,
  type ConfirmCodePayload,
} from '@/services/profile.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export type MobilePhoneStep =
  | 'idle'
  | 'enter-new-phone'
  | 'verify-current-phone'
  | 'verify-new-phone';

interface UseUpdateMobilePhoneReturn {
  step: MobilePhoneStep;
  loading: boolean;
  currentPhone: string;
  newPhone: string;
  smsTtl: number;
  /** Submit new mobile number → moves to verify-current-phone */
  submitNewPhone: (mobile: string) => Promise<boolean>;
  /** Request OTP for current phone */
  sendCodeToCurrentPhone: () => Promise<boolean>;
  /** Verify OTP on current phone → moves to verify-new-phone */
  verifyCurrentPhoneCode: (code: string) => Promise<boolean>;
  /** Verify OTP on new phone → completes flow */
  verifyNewPhoneCode: (code: string) => Promise<boolean>;
  /** Reset to idle */
  reset: () => void;
  /** Start the flow */
  start: () => void;
}

export function useUpdateMobilePhone(
  currentPhoneNumber: string,
): UseUpdateMobilePhoneReturn {
  const [step, setStep] = useState<MobilePhoneStep>('idle');
  const [loading, setLoading] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [smsTtl, setSmsTtl] = useState(0);

  const start = () => {
    setStep('enter-new-phone');
    setNewPhone('');
    setSmsTtl(0);
  };

  const reset = () => {
    setStep('idle');
    setNewPhone('');
    setSmsTtl(0);
    setLoading(false);
  };

  /** Step 1: Submit new mobile */
  const submitNewPhone = async (mobile: string): Promise<boolean> => {
    setLoading(true);
    try {
      const payload: UpdateMobilePhonePayload = { mobile };
      const res = await updateMobilePhone(payload);
      const type = (res.data?.data as { type?: string })?.type;

      if (type === 'two-step') {
        setNewPhone(mobile);
        setStep('verify-current-phone');
        toast.success('کد تایید به شماره فعلی شما ارسال شد');
        return true;
      }

      toast.success('شماره موبایل با موفقیت به‌روزرسانی شد');
      reset();
      return true;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) return false;

      if (isApiError(error) && error.status === 422 && error.data) {
        const serverData = error.data as Record<string, unknown>;
        const errors = serverData?.errors as Record<string, string[]> | undefined;
        if (errors) {
          toast.error(Object.values(errors).flat()[0] || 'شماره موبایل نامعتبر است');
          return false;
        }
      }

      toast.error(getApiErrorMessage(error, 'خطا در ثبت شماره موبایل جدید'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  /** Step 2: Send code to current phone */
  const sendCodeToCurrentPhone = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await sendCurrentPhoneCode();
      const data = res.data?.data as { phone?: string; sms_ttl?: number } | undefined;
      setSmsTtl(data?.sms_ttl ?? 180);
      toast.success('کد تایید به شماره فعلی شما ارسال شد');
      return true;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) return false;
      toast.error(getApiErrorMessage(error, 'خطا در ارسال کد تایید'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  /** Step 3: Verify current phone code */
  const verifyCurrentPhoneCode = async (code: string): Promise<boolean> => {
    setLoading(true);
    try {
      const payload: ConfirmCodePayload = { code };
      const res = await confirmCurrentPhoneCode(payload);
      const data = res.data?.data as { phone?: string; sms_ttl?: number } | undefined;
      setSmsTtl(data?.sms_ttl ?? 180);
      toast.success('کد تایید به شماره جدید ارسال شد');
      setStep('verify-new-phone');
      return true;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) return false;

      if (isApiError(error) && error.status === 422 && error.data) {
        const serverData = error.data as Record<string, unknown>;
        const errors = serverData?.errors as Record<string, string[]> | undefined;
        if (errors) {
          toast.error(Object.values(errors).flat()[0] || 'کد وارد شده نامعتبر است');
          return false;
        }
      }

      toast.error(getApiErrorMessage(error, 'کد تایید نامعتبر است'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  /** Step 4: Verify new phone code → complete */
  const verifyNewPhoneCode = async (code: string): Promise<boolean> => {
    setLoading(true);
    try {
      const payload: ConfirmCodePayload = { code };
      await confirmNewPhoneCode(payload);
      toast.success('شماره موبایل با موفقیت تغییر کرد');
      reset();
      return true;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) return false;

      if (isApiError(error) && error.status === 422 && error.data) {
        const serverData = error.data as Record<string, unknown>;
        const errors = serverData?.errors as Record<string, string[]> | undefined;
        if (errors) {
          toast.error(Object.values(errors).flat()[0] || 'کد وارد شده نامعتبر است');
          return false;
        }
      }

      toast.error(getApiErrorMessage(error, 'کد تایید نامعتبر است'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    loading,
    currentPhone: currentPhoneNumber,
    newPhone,
    smsTtl,
    submitNewPhone,
    sendCodeToCurrentPhone,
    verifyCurrentPhoneCode,
    verifyNewPhoneCode,
    reset,
    start,
  };
}
