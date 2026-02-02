import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { uploadCodePackageZip } from '@/lib/storage/code-packages';
import { getBaseUrl, buildUrl } from '@/lib/utils/base-url';

/**
 * GET /api/github/callback?code=...&state=...
 * GitHub OAuth callback: exchange code for token, verify repo access, fetch repo as ZIP,
 * build CodePackage (github), send to admin, redirect to /onboarding/stripe.
 * Token is never stored.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const stateRaw = request.nextUrl.searchParams.get('state');
  const errorParam = request.nextUrl.searchParams.get('error');

  if (errorParam) {
    console.warn('[GitHub Callback] OAuth error:', errorParam);
    return NextResponse.redirect(buildUrl('/onboarding/code?github=denied'));
  }

  if (!code || !stateRaw) {
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }

  let state: { repo: string; sessionId: string };
  try {
    state = JSON.parse(
      Buffer.from(stateRaw, 'base64url').toString('utf8')
    ) as { repo: string; sessionId: string };
  } catch {
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }

  const { repo, sessionId } = state;
  const match = repo.match(/^([^/]+)\/([^/]+)$/);
  if (!match) {
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }
  const [, owner, repoName] = match;

  const session = await auth0.getSession();
  if (!session?.user || session.user.sub !== sessionId) {
    return NextResponse.redirect(buildUrl('/onboarding/login'));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error('[GitHub Callback] Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }

  // Använd canonical base URL (throwar error om den saknas)
  const baseUrl = getBaseUrl();
  const redirectUri = `${baseUrl}/api/github/callback`;

  // Exchange code for access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenData.access_token) {
    console.warn('[GitHub Callback] No access_token:', tokenData.error, tokenData.error_description);
    return NextResponse.redirect(buildUrl('/onboarding/code?github=denied'));
  }

  const token = tokenData.access_token;

  try {
    // Verify user has read access to the repo
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!repoRes.ok) {
      return NextResponse.redirect(buildUrl('/onboarding/code?github=access_denied'));
    }

    // Fetch repo as ZIP (302 redirect; follow with same auth)
    const zipRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/zipball/HEAD`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
      }
    );

    if (!zipRes.ok) {
      return NextResponse.redirect(buildUrl('/onboarding/code?github=download_failed'));
    }

    const zipBuffer = Buffer.from(await zipRes.arrayBuffer());
    const repoUrl = `https://github.com/${owner}/${repoName}`;
    const retrievedAt = new Date().toISOString();

    let uploadResult: { objectUrl: string; sizeBytes: number; fileName: string };
    try {
      uploadResult = await uploadCodePackageZip({
        buffer: zipBuffer,
        userSub: sessionId,
        repo,
        contentType: 'application/zip',
        fileName: `${repoName}.zip`,
      });
    } catch (uploadError) {
      console.error('[GitHub Callback] GCS upload failed:', uploadError);
      return NextResponse.redirect(buildUrl('/onboarding/code?github=upload_failed'));
    }

    // zipBuffer and zipRes are local variables in this scope and not included in payload
    // Only uploadResult (metadata) is used below

    const payload = {
      idempotencyKey: `onboarding-${sessionId}-code-github-${repo}`,
      sessionId,
      step: 'code',
      onboardingStatus: 'påbörjad',
      user: {
        email: session.user.email,
        name: session.user.name,
        sub: session.user.sub,
      },
      codePackage: {
        type: 'github',
        source: 'public_onboarding',
        status: 'received',
        github: {
          repoUrl,
          isPrivate: true,
          accessStatus: 'granted',
          retrievedVia: 'oauth',
          retrievedAt,
        },
        zip: {
          fileName: uploadResult.fileName,
          sizeBytes: uploadResult.sizeBytes,
          storage: {
            type: 'gcs',
            objectUrl: uploadResult.objectUrl,
          },
        },
      },
      submittedAt: retrievedAt,
      source: 'public_onboarding',
    };

    // Guard: verify no zip buffer, response objects, or external data leaked into payload
    // Measure and log payload size; hard-fail if > 100 KB
    const payloadJson = JSON.stringify(payload);
    const payloadSizeBytes = Buffer.byteLength(payloadJson, 'utf8');
    const payloadSizeKB = payloadSizeBytes / 1024;
    
    console.log(`[GitHub Callback] Payload size: ${payloadSizeKB.toFixed(2)} KB (${payloadSizeBytes} bytes)`);
    
    // Explicit guard: hard-fail if payload exceeds 100 KB
    const MAX_PAYLOAD_SIZE_BYTES = 100 * 1024; // 100 KB
    if (payloadSizeBytes > MAX_PAYLOAD_SIZE_BYTES) {
      console.error(
        `[GitHub Callback] Payload too large: ${payloadSizeKB.toFixed(2)} KB exceeds ${MAX_PAYLOAD_SIZE_BYTES / 1024} KB limit. ` +
        `Payload keys: ${Object.keys(payload).join(', ')}. ` +
        `CodePackage keys: ${Object.keys(payload.codePackage).join(', ')}`
      );
      return NextResponse.redirect(buildUrl('/onboarding/code?github=payload_too_large'));
    }

    // Verify no zip buffer or response objects leaked
    const payloadStr = payloadJson.toLowerCase();
    if (
      payloadStr.includes('buffer') ||
      payloadStr.includes('arraybuffer') ||
      payloadStr.includes('response') ||
      payloadStr.includes('zipbuffer') ||
      payloadStr.includes('zipres') ||
      payloadStr.includes('base64') ||
      payloadStr.includes('content:') ||
      payloadStr.includes('data:')
    ) {
      console.error(
        `[GitHub Callback] Suspicious content detected in payload. ` +
        `Size: ${payloadSizeKB.toFixed(2)} KB. ` +
        `Payload preview (first 500 chars): ${payloadJson.slice(0, 500)}`
      );
      return NextResponse.redirect(buildUrl('/onboarding/code?github=payload_error'));
    }

    await sendToAdminPortal('onboarding', payload);
  } finally {
    // Token is not stored; it goes out of scope here. No DB or session persistence.
  }

  // Använd canonical base URL för redirect (throwar error om den saknas)
  const redirectUrl = buildUrl('/onboarding/stripe');
  console.log(`[GitHub Callback] Redirecting to: ${redirectUrl}`);
  return NextResponse.redirect(redirectUrl);
}
