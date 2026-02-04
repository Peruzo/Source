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
  
  // Tillåt onboarding-routes utan Auth0-krav
  // Auth0 middleware lägger bara till session om den finns, men blockerar inte
  if (
    pathname.startsWith('/onboarding/') ||
    pathname.startsWith('/api/onboarding/') ||
    pathname.startsWith('/api/github/')
  ) {
    // För onboarding-routes: kör Auth0 middleware för att lägga till session om den finns,
    // men låt request passera även om ingen session finns
    try {
      const response = await auth0.middleware(request);
      // Om middleware redirectar till login, låt det passera för onboarding-routes
      // (frontend hanterar Auth0-krav vid Stripe-steget)
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message === 'Invalid URL' || message.includes('Invalid URL')) {
        console.error(
          '[Auth0 middleware] Invalid URL: set APP_BASE_URL or AUTH0_BASE_URL in .env.local (e.g. http://localhost:3004)'
        );
        return NextResponse.next();
      }
      // För onboarding-routes: låt request passera även vid Auth0-fel
      return NextResponse.next();
    }
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
