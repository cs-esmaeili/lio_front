"use client";

import { usePathname } from "next/navigation";

const HIDDEN_ROUTES = [ "/shop/", ] as const;

type HiddenRoute = typeof HIDDEN_ROUTES[number];

export const useRouteMatcher = (): boolean => {
  const pathname = usePathname();
  
  if (!pathname) return false;
  
  return HIDDEN_ROUTES.some((route: HiddenRoute) => 
    pathname.startsWith(route)
  );
};