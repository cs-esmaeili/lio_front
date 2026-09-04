"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { OtpInput } from "@/components/login/otp-input";

const OTP_LENGTH = 4;

type Props = {
  onChange?: (otp: string) => void;
};

export function OtpInputGroup({ onChange }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    onChange?.(otp.join(""));
  }, [otp, onChange]);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        setOtp((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (e.key === "ArrowLeft" && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    if (e.key === "ArrowRight" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent) => {
    e.preventDefault();

    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!digits) return;

    const next = Array(OTP_LENGTH).fill("");
    digits.split("").forEach((d, i) => {
      next[i] = d;
    });

    setOtp(next);
    otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div className="mb-5 flex justify-center gap-3" dir="ltr">
      {otp.map((digit, i) => (
        <OtpInput
          key={i}
          index={i}
          value={digit}
          error={false}
          autoFocus={i === 0}
          inputRef={(el) => {
            otpRefs.current[i] = el;
          }}
          onChange={handleOtpChange}
          onKeyDown={handleOtpKeyDown}
          onPaste={handleOtpPaste}
        />
      ))}
    </div>
  );
}
