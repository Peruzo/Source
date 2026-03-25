import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

/**
 * KRITISK: Onboarding-routes ska INTE kräva Auth0.
 * Custom signup + onboarding måste fungera helt utan Auth0.
 * Auth0 är ett val, inte ett hinder.
 * 
 * Middleware tillåter onboarding-routes utan Auth0-autentisering.
 * Auth0 middleware lägger bara till session om den finns, men blockerar inte routes.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip Auth0 middleware for static assets in /public (e.g. videos/images)
  // so large media files aren't intercepted by Auth0 initialization.
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // KRITISK: Onboarding-routes får INTE köra Auth0 middleware
  // Auth0-init får INTE ske för onboarding-routes (förhindrar implicit Auth0-init)
  if (
    pathname.startsWith('/onboarding/') ||
    pathname.startsWith('/api/onboarding/') ||
    pathname.startsWith('/api/github/')
  ) {
    // För onboarding-routes: låt request passera direkt utan Auth0 middleware
    // Backend hanterar anonyma sessioner via cookie
    // Endast Stripe-start kräver Auth0 (hanteras i Stripe-endpoint)
    return NextResponse.next();
  }
  
  // För övriga routes: kör Auth0 middleware normalt
  try {
    return await auth0.middleware(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === 'Invalid URL' || message.includes('Invalid URL')) {
      console.error(
        '[Auth0 middleware] Invalid URL: set APP_BASE_URL or AUTH0_BASE_URL in .env.local (e.g. http://localhost:3004)'
      );
      return NextResponse.next();
    }
    throw error;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
