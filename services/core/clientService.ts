import axios, { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiError } from '@/utils/api-error';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT,
  // Session lives in an HttpOnly cookie — cookies must ride every request,
  // and the readable `csrf_token` cookie must be echoed as X-CSRF-Token.
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'csrf_token',
  xsrfHeaderName: 'X-CSRF-Token',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
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

    // 401 — session expired or invalid → trigger logout
    if (status === 401) {
      if (typeof window !== 'undefined') {
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

    // 403 — permission denied (or missing/invalid CSRF token)
    if (status === 403) {
      const apiError = new ApiError(
        status,
        message || 'شما دسترسی لازم برای این عملیات را ندارید.',
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
