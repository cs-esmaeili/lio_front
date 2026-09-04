/**
 * Structured API error with typed access to status, message, and response data.
 * Wraps Axios errors and fetch errors into a single consistent shape.
 */
export class ApiError extends Error {
  /** HTTP status code. 0 for network errors (no response). */
  status: number;
  /** Server-provided error message from response body, if available. */
  data: unknown;
  /** The original error object (AxiosError, TypeError, etc.) for advanced inspection. */
  originalError: unknown;
  /**
   * Whether the global interceptor already handled this error (showed toast, redirected, etc.).
   * Hooks should skip showing their own toast when this is true, unless they want to override.
   */
  handled: boolean;

  constructor(
    status: number,
    message: string,
    data?: unknown,
    originalError?: unknown,
    handled = false,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.originalError = originalError;
    this.handled = handled;
  }
}

/**
 * Type guard: checks whether an unknown error is an ApiError.
 * Use in catch blocks instead of `error instanceof ApiError` to avoid
 * prototype-chain issues across module boundaries.
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Safely extract a human-readable message from any error.
 *
 * Priority:
 * 1. ApiError.message (already normalized)
 * 2. Axios-style: error.response.data.message
 * 3. The error's own `message` property if it's an Error instance
 * 4. The provided fallback
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    return error.message || fallback;
  }

  // Axios errors that weren't caught by our interceptor (unlikely but defensive)
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosErr = error as { response?: { data?: { message?: string } } };
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}
