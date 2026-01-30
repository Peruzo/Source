import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/debug-log
 * Tar emot felinfo från klienten och loggar till server (terminal).
 * Används av HydrationErrorBoundary för att felsöka #418.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, name, stack, digest, url, userAgent } = body;
    console.error('[DEBUG-LOG] Hydration/React error from client:', {
      name: name ?? 'Error',
      message: message ?? body.message,
      digest: digest ?? body.digest,
      url: url ?? request.headers.get('referer'),
      userAgent: userAgent ?? request.headers.get('user-agent'),
      stack: stack ?? body.stack,
      full: JSON.stringify(body, null, 2),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[DEBUG-LOG] Failed to parse body:', e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
