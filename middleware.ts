import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function middleware(request: NextRequest) {
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
