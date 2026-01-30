import { Auth0Client } from '@auth0/nextjs-auth0/server';

const appBaseUrl =
  process.env.APP_BASE_URL ||
  process.env.AUTH0_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL;

if (!appBaseUrl) {
  console.warn(
    '[Auth0] Set APP_BASE_URL or AUTH0_BASE_URL or NEXT_PUBLIC_SITE_URL so the middleware can build valid URLs (e.g. http://localhost:3004 or your production URL).'
  );
}

export const auth0 = new Auth0Client({
  appBaseUrl: appBaseUrl || undefined,
  authorizationParameters: {
    scope: 'openid profile email',
  },
  routes: {
    login: '/api/auth/login',
    callback: '/api/auth/callback',
    logout: '/api/auth/logout',
  },
});
