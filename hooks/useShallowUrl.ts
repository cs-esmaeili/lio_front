'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useSyncExternalStore } from 'react';

const SHALLOW = 'shallow-url-change';

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb);
  window.addEventListener(SHALLOW, cb);
  return () => {
    window.removeEventListener('popstate', cb);
    window.removeEventListener(SHALLOW, cb);
  };
}

export function useLiveSearchParams() {
  const server = useSearchParams();

  const getSnapshot = useCallback(() => window.location.search, []);
  const getServer = useCallback(
    () => (server.toString() ? `?${server.toString()}` : ''),
    [server]
  );
  const search = useSyncExternalStore(subscribe, getSnapshot, getServer);
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function shallowReplace(url: string) {
  window.history.replaceState(null, '', url);
  window.dispatchEvent(new Event(SHALLOW));
}

export function shallowPush(url: string) {
  window.history.pushState(null, '', url);
  window.dispatchEvent(new Event(SHALLOW));
}
