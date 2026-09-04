"use client";

import { useState } from 'react';
import Image from 'next/image';
import fadeStyles from '@/styles/modules/imageFade.module.css';

interface ZoomWrapperProps {
  src: string;
  alt: string;
  priority?: boolean;
}

const ZoomWrapper = ({ src, alt, priority = false }: ZoomWrapperProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [loaded, setLoaded] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
    >
      <div
        className="relative w-full h-full transition-all duration-200"
        style={{
          transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          onLoad={() => setLoaded(true)}
          className={`object-cover ${loaded ? fadeStyles.fadeIn : 'opacity-0'}`}
          priority={priority}
        />
      </div>
      {isZoomed && (
        <div
          className="absolute w-32 h-32 rounded-full border-2 border-white pointer-events-none hidden md:block"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
      )}
    </div>
  );
};

export default ZoomWrapper;