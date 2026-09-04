'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapComponent, MapTypes } from '@neshan-maps-platform/mapbox-gl-react';
import nmpMapbox from '@neshan-maps-platform/mapbox-gl';
import type SDKMap from '@neshan-maps-platform/mapbox-gl/dist/src/core/Map';
import '@/styles/neshan.css';

export type MarkerCoords = { lng: number; lat: number };
export type LngLatInput = MarkerCoords | [number, number]; // tuple = [lng, lat]

type MapboxMarkerInstance = {
  setLngLat: (c: [number, number]) => MapboxMarkerInstance;
  addTo: (map: unknown) => MapboxMarkerInstance;
  remove: () => void;
};

type MapClickEvent = { lngLat: { lng: number; lat: number } };

interface NeshanMapProps {
  center?: LngLatInput;
  zoom?: number;
  height?: string;
  traffic?: boolean;
  poi?: boolean;
  marker?: boolean;
  markerListener?: (coords: MarkerCoords) => void;
  initialMarker?: LngLatInput;
  disableMarkerMove?: boolean;
}

function toLngLatTuple(input: LngLatInput | undefined): [number, number] | null {
  if (!input) return null;
  if (Array.isArray(input)) {
    const [lng, lat] = input;
    if (typeof lng !== 'number' || typeof lat !== 'number' || Number.isNaN(lng) || Number.isNaN(lat)) return null;
    return [lng, lat];
  }
  const { lng, lat } = input;
  if (typeof lng !== 'number' || typeof lat !== 'number' || Number.isNaN(lng) || Number.isNaN(lat)) return null;
  return [lng, lat];
}

export default function NeshanMapComponent({
  center,
  zoom = 13,
  height = '100%',
  traffic = false,
  poi = false,
  marker = false,
  markerListener,
  initialMarker,
  disableMarkerMove = false,
}: NeshanMapProps) {
  const mapKey = process.env.NEXT_PUBLIC_NESHAN_KEY || '';

  const centerTuple = useMemo<[number, number]>(
    () => toLngLatTuple(center) ?? [51.389, 35.6892], // تهران fallback [lng, lat]
    [center],
  );
  const initialMarkerTuple = useMemo(() => toLngLatTuple(initialMarker), [initialMarker]);

  const [mapInstance, setMapInstance] = useState<SDKMap | null>(null);
  const markerRef = useRef<MapboxMarkerInstance | null>(null);
  const listenerRef = useRef<((coords: MarkerCoords) => void) | undefined>(markerListener);

  useEffect(() => {
    listenerRef.current = markerListener;
  }, [markerListener]);

  const handleMapReady = useCallback((map: SDKMap) => {
    setMapInstance(map);
  }, []);

  useEffect(() => {
    if (!mapInstance) return;
    const m = mapInstance as unknown as {
      setCenter: (c: [number, number]) => void;
      setZoom: (z: number) => void;
    };
    m.setCenter(centerTuple);
    m.setZoom(zoom);
  }, [mapInstance, centerTuple, zoom]);

  const placeMarker = useCallback((map: SDKMap, lng: number, lat: number) => {
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
      return;
    }
    const MarkerCtor = (nmpMapbox as unknown as { Marker: new () => MapboxMarkerInstance }).Marker;
    markerRef.current = new MarkerCtor().setLngLat([lng, lat]).addTo(map);
  }, []);

  useEffect(() => {
    if (!mapInstance || !initialMarkerTuple) return;
    placeMarker(mapInstance, initialMarkerTuple[0], initialMarkerTuple[1]);
  }, [mapInstance, initialMarkerTuple, placeMarker]);

  useEffect(() => {
    if (!mapInstance || !marker || disableMarkerMove) return;

    const handleClick = (e: MapClickEvent) => {
      const { lng, lat } = e.lngLat;
      placeMarker(mapInstance, lng, lat);
      listenerRef.current?.({ lng, lat });
    };

    const mapAsEmitter = mapInstance as unknown as {
      on: (type: 'click', cb: (e: MapClickEvent) => void) => void;
      off: (type: 'click', cb: (e: MapClickEvent) => void) => void;
    };
    mapAsEmitter.on('click', handleClick);

    return () => {
      mapAsEmitter.off('click', handleClick);
    };
  }, [mapInstance, marker, disableMarkerMove, placeMarker]);

  useEffect(() => {
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
    };
  }, []);

  const options = useMemo(() => ({
    mapKey,
    mapType: MapTypes.neshanVector,
    traffic,
    poi,
  }), [mapKey, traffic, poi]);

  const mapStyle = useMemo(() => ({
    width: '100%' as const,
    height,
    borderRadius: '20px' as const,
  }), [height]);

  return (
    <div className='map-wrapper h-full rounded-2xl shadow-[0_4px_4px_0_rgb(0,0,0,0.25)]'>
      <MapComponent
        options={options}
        mapSetter={handleMapReady}
        style={mapStyle}
      />
    </div>
  );
}
