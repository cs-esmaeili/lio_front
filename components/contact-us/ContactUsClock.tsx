"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const AnalogClock: React.FC = () => {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false); // ← اضافه شد

  useEffect(() => {
    setMounted(true); // ← اضافه شد

    const updateClock = () => {
      const now = new Date();
      setTime({
        hours: now.getHours() % 12,
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const secondDeg = time.seconds * 6;
  const minuteDeg = time.minutes * 6 + time.seconds * 0.1;
  const hourDeg = time.hours * 30 + time.minutes * 0.5;

  // نسخه SSR (قبل از mount شدن روی کلاینت)
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[117px] w-[117px] bg-secondary-black-3 rounded-full">
        <div
          className="relative rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center"
          style={{ width: "97px", height: "97px" }}
        >
          <Image
            src="/contact-us/clock.png"
            width={60}
            height={60}
            alt="clock"
          />
          <div className="absolute w-1.5 h-1.5 bg-primary rounded-full z-20" />
        </div>
      </div>
    );
  }

  // نسخه Client (بعد از mount شدن)
  return (
    <div className="flex items-center justify-center h-[117px] w-[117px] bg-secondary-black-3 rounded-full">
      <div
        className="relative rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center"
        style={{ width: "97px", height: "97px" }}
      >
        <Image src="/contact-us/clock.png" width={60} height={60} alt="clock" />

        {/* عقربه ساعت */}
        <div
          className="absolute bg-secondary-black-3 rounded-full origin-bottom"
          style={{
            width: "3px",
            height: "15px",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
          }}
        />

        {/* عقربه دقیقه */}
        <div
          className="absolute bg-secondary-black-3 rounded-full origin-bottom"
          style={{
            width: "2px",
            height: "20px",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
          }}
        />

        {/* عقربه ثانیه */}
        <div
          className="absolute bg-primary rounded-full origin-bottom"
          style={{
            width: "1.5px",
            height: "20px",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
          }}
        />

        {/* مرکز ساعت */}
        <div className="absolute w-1.5 h-1.5 bg-primary rounded-full z-20" />
      </div>
    </div>
  );
};

export default AnalogClock;
