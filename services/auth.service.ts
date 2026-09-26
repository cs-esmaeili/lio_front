const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

// GET /auth/me — current session user (or anonymous)
export const getMeCSR = (): Promise<Response> =>
  fetch(`${csrPrefixUrl}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

// POST /auth/otp/request — send a login OTP to the phone number
export const requestOtpCSR = (username: string, headers: Headers): Promise<Response> =>
  fetch(`${csrPrefixUrl}/auth/otp/request`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ username }),
  });

// POST /auth/otp/verify — verify the OTP and establish the session cookie
export const verifyOtpCSR = (username: string, code: string, headers: Headers): Promise<Response> =>
  fetch(`${csrPrefixUrl}/auth/otp/verify`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ username, code }),
  });

// POST /auth/login — login with phone number and password
export const loginCSR = (username: string, password: string, headers: Headers): Promise<Response> =>
  fetch(`${csrPrefixUrl}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ username, password }),
  });

// POST /auth/logout — revoke the session and clear the cookie
export const logoutCSR = (headers: Headers): Promise<Response> =>
  fetch(`${csrPrefixUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers,
  });
