"use client";

import { useState, useEffect } from "react";

type TimerProps = {
  expiryTime?: number; // زمان انقضا به ثانیه
  onExpire?: () => void; // callback وقتی تایمر تموم شد
};

export default function Timer({ expiryTime = 3600, onExpire }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(expiryTime);

  // تابع تبدیل ثانیه به فرمت ساعت:دقیقه:ثانیه
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  return (
    <div className="relative flex flex-col items-center justify-center gap-2 text-custom-white">
      <span className="mb-1 hidden text-sm text-custom-white/80 lg:block">فــــرصت بــــاقی‌مــــانده خــــرید</span>
      <span className="text-lg tracking-[2px] md:text-2xl md:tracking-[8px]">{formatTime(timeLeft)}</span>
    </div>
  );
}
