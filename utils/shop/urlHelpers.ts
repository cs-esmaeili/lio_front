/** Builds the /shop URL that lists every product matching a header search query. */
export function buildProductsSearchUrl(query: string): string {
  return `/shop?name=${encodeURIComponent(query.trim())}`;
}

export function cloneParams(params: URLSearchParams): URLSearchParams {
  return new URLSearchParams(params.toString());
}

/** Toggle a value in a bracket-array param (key[]=val). Resets page to 1. */
export function toggleArrayParam(params: URLSearchParams, key: string, value: string): URLSearchParams {
  const next = cloneParams(params);
  next.delete(key);
  const current = params.getAll(key);
  const updated = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  updated.forEach((v) => next.append(key, v));
  next.delete('page');
  return next;
}

/** Set or delete a scalar param. Resets page to 1. */
export function setScalarParam(params: URLSearchParams, key: string, value: string | null): URLSearchParams {
  const next = cloneParams(params);
  if (value === null) next.delete(key);
  else next.set(key, value);
  next.delete('page');
  return next;
}

/** Set price range params. Resets page to 1. */
export function setPriceParams(params: URLSearchParams, min: number, max: number): URLSearchParams {
  const next = cloneParams(params);
  if (min > 0) next.set('minPrice', String(min));
  else next.delete('minPrice');
  if (max > 0) next.set('maxPrice', String(max));
  else next.delete('maxPrice');
  next.delete('page');
  return next;
}

export function paramsToObject(sp: URLSearchParams): Record<string, string | string[]> {
  const obj: Record<string, string | string[]> = {};
  sp.forEach((value, key) => {
    const existing = obj[key];
    if (existing === undefined) {
      obj[key] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      obj[key] = [existing, value];
    }
  });
  return obj;
}

export function objectToParams(obj: Record<string, string | string[]>): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach((v) => sp.append(key, v));
    } else {
      sp.set(key, value);
    }
  }
  return sp;
}
