'use client';

import { useState } from 'react';
import Image from 'next/image';
import fadeStyles from '@/styles/modules/imageFade.module.css';

const ZOOM_SCALE = 1.5;

const ZoomWrapper = ({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) => {
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
      className='relative w-full h-full overflow-hidden'
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}>
      <div
        className='relative w-full h-full transition-transform duration-300 ease-out will-change-transform'
        style={{
          transform: isZoomed ? `scale(${ZOOM_SCALE})` : 'scale(1)',
          transformOrigin: `${position.x}% ${position.y}%`,
        }}>
        <Image
          src={src}
          alt={alt}
          fill
          onLoad={() => setLoaded(true)}
          className={`object-cover ${loaded ? fadeStyles.fadeIn : 'opacity-0'}`}
          priority={priority}
        />
      </div>
    </div>
  );
};

export default ZoomWrapper;
