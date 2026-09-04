/**
 * Normalize any link format to a decoded pathname like "/shop" or "/محصولات".
 * Handles full URLs, relative paths, query strings, encoding, and trailing slashes.
 */
export function getLinkPath(link: string | undefined): string {
  if (!link) return '';
  let path: string;
  if (link.startsWith('http')) {
    try {
      path = new URL(link).pathname;
    } catch {
      path = link;
    }
  } else {
    path = link.startsWith('/') ? link : `/${link}`;
  }
  // Strip query string
  path = path.split('?')[0];
  try {
    path = decodeURI(path);
  } catch {
    /* keep encoded */
  }
  // Strip trailing slash (except root "/")
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

/**
 * Normalize current pathname for comparison — strip query, decode, strip trailing slash.
 */
export function normalizePathname(p: string | null): string {
  if (!p) return '';
  // Strip query string
  const pathOnly = p.split('?')[0];
  let decoded: string;
  try {
    decoded = decodeURI(pathOnly);
  } catch {
    decoded = pathOnly;
  }
  // Strip trailing slash (except root)
  return decoded.length > 1 && decoded.endsWith('/') ? decoded.slice(0, -1) : decoded;
}

/**
 * Check if the current pathname matches a link path.
 * Uses segment-boundary matching: exact match or starts-with + "/" separator.
 */
export function isPathActive(linkPath: string, currentPathname: string): boolean {
  if (!linkPath) return false;
  return currentPathname === linkPath || currentPathname.startsWith(linkPath + '/');
}

/**
 * Get href from a menu item's link, preserving query params.
 */
export function getHref(item: { link?: string }): string {
  const link = item.link;
  if (!link) return '';

  if (link.startsWith('http')) {
    return link;
  }

  return link.startsWith('/') ? link : `/${link}`;
}
