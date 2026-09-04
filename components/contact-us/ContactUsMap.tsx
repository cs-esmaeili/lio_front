'use client';

import dynamic from 'next/dynamic';
import type { LngLatInput } from '@/components/global/NeshanMap';

const Map = dynamic(() => import('@/components/global/NeshanMap'), {
  ssr: false,
});

interface ContactUsMapProps {
  center: LngLatInput;
  zoom: number;
  traffic: boolean;
  poi: boolean;
}

const testCoords = { lng: 51.396941658332565, lat: 35.76436591885894 };

export default function ContactUsMap(props: ContactUsMapProps) {
  return (
    <Map
      {...props}
      center={testCoords}
      initialMarker={testCoords}
      marker
      disableMarkerMove
    />
  );
}
