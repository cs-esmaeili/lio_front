"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  prefix?: string;
  className?: string;
}

export default function Counter({
  end,
  suffix = "",
  duration = 2000,
  prefix = "",
  className = "",
}: CounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end]);

  const startCounting = () => {
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(
        startValue + (end - startValue) * (1 - Math.pow(1 - progress, 3)),
      );

      setCount(current);
      countRef.current = current;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  };

  const combinedClassName = twMerge("counter font-rajdhani", className);

  return (
    <span ref={elementRef} className={combinedClassName}>
      {prefix}
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
