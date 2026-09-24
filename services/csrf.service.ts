const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

// GET /auth/csrf
export const getCsrfTokenCSR = (): Promise<Response> =>
  fetch(`${csrPrefixUrl}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  });
