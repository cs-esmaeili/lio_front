'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { faqForm } from '@/services/faq.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useFaqForm() {

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sendFaqForm = async (name : string, phone:number , subject: string , mobile:string, message:string) => {
    setLoading(true);

    try {
      const response = await faqForm({name , phone , subject , mobile, message});
      toast.success('پیام شما با موفقیت ارسال شد.');
      setSubmitted(true);
      return response.data;
    } catch (error: unknown) {
      // Interceptor already handled global errors (401, 403, 5xx, network) —
      // skip showing a second toast unless we want to override
      if (isApiError(error) && error.handled) {
        return null;
      }

      const message = getApiErrorMessage(
        error,
        'در ارسال اطلاعات خطایی به وجود آمد',
      );

      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendFaqForm, loading, submitted };
}
