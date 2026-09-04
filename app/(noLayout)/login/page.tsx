"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthHeader } from "@/components/login/login-header";
import { PhoneForm } from "@/components/login/phone-form";
import { OtpForm } from "@/components/login/otp-form";


type Step = "phone" | "otp";

const formatPhone = (value: string) =>
  value.length === 11
    ? value.replace(/(\d{4})(\d{3})(\d{4})/, "$1-$2-$3")
    : value;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || undefined;
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");

  const handlePhoneSubmit = (phoneValue: string) => {
    setPhone(phoneValue);
    setStep("otp");
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
      return;
    }
    router.push("/");
  };

  const formattedPhone = formatPhone(phone);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-black-2">
      <div
        className="w-full max-w-100 rounded-2xl border border-primary-1 p-8 shadow-[0_0_48px_rgba(228,209,185,0.08)]"
      >
        <AuthHeader onBack={handleBack} />

        {step === "phone" && (
          <PhoneForm onSubmit={handlePhoneSubmit} />
        )}

        {step === "otp" && (
          <OtpForm
            phone={phone}
            formattedPhone={formattedPhone}
            onBack={handleBack}
            returnUrl={returnUrl}
          />
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
