/**
 * Canonical server-side base URL för redirects och OAuth-flöden.
 * Validerar att BASE_URL är satt och throwar error om den saknas.
 * Inga silent fallbacks till localhost.
 */

/**
 * Hämtar canonical base URL från environment variables.
 * Prioritering: APP_BASE_URL > AUTH0_BASE_URL > NEXT_PUBLIC_SITE_URL
 * 
 * @throws Error om ingen BASE_URL är satt
 */
export function getBaseUrl(): string {
  const baseUrl =
    process.env.APP_BASE_URL ||
    process.env.AUTH0_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    const error = new Error(
      '[Base URL] APP_BASE_URL, AUTH0_BASE_URL, or NEXT_PUBLIC_SITE_URL must be set. ' +
      'Cannot build redirect URLs without a valid base URL.'
    );
    console.error(error.message);
    throw error;
  }

  // Validera att URL är korrekt formaterad
  try {
    const url = new URL(baseUrl);
    const canonical = `${url.protocol}//${url.host}`;
    return canonical;
  } catch (urlError) {
    const error = new Error(
      `[Base URL] Invalid base URL format: ${baseUrl}. Must be a valid URL (e.g., https://example.com).`
    );
    console.error(error.message, urlError);
    throw error;
  }
}

/**
 * Bygger en fullständig URL från en relativ path.
 * Använder canonical base URL och säkerställer korrekt path-format.
 * 
 * @param path - Relativ path (t.ex. '/onboarding/stripe' eller 'onboarding/stripe')
 * @returns Fullständig URL
 */
export function buildUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
