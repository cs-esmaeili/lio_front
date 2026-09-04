'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { dashboardInfo } from '@/services/dashboard.service';
import { isApiError, getApiErrorMessage } from '@/utils/api-error';

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  const getDashboard = async () => {
    setLoading(true);

    try {
      const response = await dashboardInfo();

      setDashboard(response.data.data);

      return response.data.data;
    } catch (error: unknown) {
      if (isApiError(error) && error.handled) {
        return null;
      }

      toast.error(getApiErrorMessage(error, 'دریافت اطلاعات داشبورد با خطا مواجه شد'));

      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await getDashboard();
    };

    loadDashboard();
  }, []);

  return {
    dashboard,
    loading,
    refreshDashboard: getDashboard,
  };
}
