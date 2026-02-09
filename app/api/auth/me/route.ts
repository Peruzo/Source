import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

/**
 * GET /api/auth/me
 * Kontrollerar om användaren har en aktiv Auth0-session.
 * Används av client components för att avgöra om login-knapp ska visas.
 */
export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    return NextResponse.json({ 
      user: {
        sub: session.user.sub,
        email: session.user.email,
        name: session.user.name,
      }
    });
  } catch (error) {
    console.error('[Auth Me] Error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
