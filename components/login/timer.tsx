'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/shadcn/button';

type Props = {
  seconds: number;
  onResend: () => void;
};

export function Timer({ seconds, onResend }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const onResendRef = useRef(onResend);
  onResendRef.current = onResend;

  useEffect(() => {
    if (remaining <= 0) return;

    const id = setTimeout(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [remaining]);

  const handleResend = useCallback(() => {
    setRemaining(seconds);
    onResendRef.current();
  }, [seconds]);

  if (remaining <= 0) {
    return (
      <Button
        type="button"
        variant="link"
        onClick={handleResend}
        className="text-sm text-primary-1 hover:text-primary-2 cursor-pointer p-0 h-auto"
      >
        ارسال دوباره کد تایید
      </Button>
    );
  }

  return (
    <span className='text-gray-3 text-sm'>
      <span className="font-medium tabular-nums">
        {remaining}
      </span>{' '}
        ثانیه مانده تا دریافت مجدد کد {' '}
    </span>
  );
}
