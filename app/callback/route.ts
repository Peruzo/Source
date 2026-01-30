import { NextResponse } from 'next/server';

export function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUrl = new URL('/api/auth/callback', url.origin);
  redirectUrl.search = url.search;
  return NextResponse.redirect(redirectUrl);
}
