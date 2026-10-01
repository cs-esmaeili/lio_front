'use client';

import dynamic from 'next/dynamic';
import type { LngLatInput } from '@/components/global/NeshanMap';

const Map = dynamic(() => import('@/components/global/NeshanMap'), {
  ssr: false,
});

interface ContactUsMapProps {
  center: LngLatInput;
  zoom?: number;
}

export default function ContactUsMap({ center, zoom = 14 }: ContactUsMapProps) {
  return <Map center={center} zoom={zoom} initialMarker={center} marker disableMarkerMove />;
}
