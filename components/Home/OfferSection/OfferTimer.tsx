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
    <div className="flex flex-col items-center justify-center gap-2">
      <span className="text-sm hidden lg:block mb-1">فــــرصت بــــاقی‌مــــانده خــــرید</span>
      <span className="text-md md:text-xl tracking-[2px] md:tracking-[10px]">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}