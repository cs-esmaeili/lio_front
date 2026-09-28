'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getProfileCSR } from '@/services/profile.service';
import { getApiErrorMessage, isApiError } from '@/utils/api-error';

import type { Profile } from '@/typescript/schemas/profile.schema';

/** Reads the current user's own profile (`GET /profile`). */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const request = useCallback(async (): Promise<Profile | null> => {
    try {
      return await getProfileCSR();
    } catch (error) {
      if (isApiError(error) && error.handled) return null;

      toast.error(getApiErrorMessage(error, 'خطا در دریافت اطلاعات کاربری'));
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    request().then((data) => {
      if (!active) return;

      if (data) setProfile(data);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [request]);

  const refetch = useCallback(async (): Promise<Profile | null> => {
    setLoading(true);

    const data = await request();
    if (data) setProfile(data);
    setLoading(false);

    return data;
  }, [request]);

  return { profile, loading, refetch } as const;
}
