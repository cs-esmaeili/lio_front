import axios, { isAxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { ApiError } from '@/utils/api-error';

const SESSION_MAX_AGE = Number(process.env.NEXT_PUBLIC_SESSION_MAX_AGE) || 7200;

function getAuthToken(): string {
  if (typeof document === 'undefined') return '';

  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function refreshAuthCookie(): void {
  if (typeof document === 'undefined') return;

  const token = getAuthToken();
  if (!token) return;

  document.cookie = `auth_token=${token}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${decodeURIComponent(token)}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    // Refresh session cookie on every successful API call
    refreshAuthCookie();
    return response;
  },
  (error: unknown) => {
    // Network error (no response at all)
    if (!isAxiosError(error) || !error.response) {
      const apiError = new ApiError(
        0,
        'خطا در ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.',
        undefined,
        error,
        true, // handled — interceptor already showed toast
      );
      toast.error(apiError.message);
      return Promise.reject(apiError);
    }

    const status = error.response.status;
    const message: string = error.response?.data?.message || '';
    const data = error.response?.data;

    // 401 — token expired or invalid → trigger logout
    if (status === 401 || message === 'token expired' || message === 'token is wrong') {
      // Clear invalid token cookie so components re-read auth state correctly
      if (typeof window !== 'undefined') {
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
      const apiError = new ApiError(
        status,
        message || 'نشست شما منقضی شده است. لطفا دوباره وارد شوید.',
        data,
        error,
        true, // handled
      );
      toast.error(apiError.message);
      return Promise.reject(apiError);
    }

    // 403 — permission denied
    if (status === 403 || message === 'permission denied') {
      const apiError = new ApiError(
        status,
        'شما دسترسی لازم برای این عملیات را ندارید.',
        data,
        error,
        true, // handled
      );
      toast.error(apiError.message);
      return Promise.reject(apiError);
    }

    // 5xx — server error
    if (status >= 500) {
      const apiError = new ApiError(
        status,
        'مشکلی در ارتباط با سرور پیش آمد. دوباره تلاش کنید.',
        data,
        error,
        true, // handled
      );
      toast.error(apiError.message);
      return Promise.reject(apiError);
    }

    // Other client errors (400, 404, 422, etc.) — don't show global toast,
    // let hooks handle them with specific messages from response body
    // handled defaults to false — hooks will show their own toast
    const apiError = new ApiError(status, message, data, error);
    return Promise.reject(apiError);
  },
);

export default {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
  axios: api,
};
