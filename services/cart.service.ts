const csrPrefixUrl = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CLIENT}`;

// GET /cart
export const getCartCSR = (headers: Headers): Promise<Response> =>
  fetch(`${csrPrefixUrl}/cart`, {
    method: 'GET',
    credentials: 'include',
    headers,
  });

// POST /cart/items
export const addCartItemCSR = (
  variantId: number,
  quantity: number,
  headers: Headers,
): Promise<Response> =>
  fetch(`${csrPrefixUrl}/cart/items`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ variantId, quantity }),
  });

// PATCH /cart/items/:variantId
export const updateCartItemCSR = (
  variantId: number,
  quantity: number,
  headers: Headers,
): Promise<Response> =>
  fetch(`${csrPrefixUrl}/cart/items/${variantId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers,
    body: JSON.stringify({ quantity }),
  });

// DELETE /cart/items/:variantId
export const removeCartItemCSR = (
  variantId: number,
  headers: Headers,
): Promise<Response> =>
  fetch(`${csrPrefixUrl}/cart/items/${variantId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers,
  });
