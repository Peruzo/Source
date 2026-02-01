import { NextRequest, NextResponse } from 'next/server';

const AUTH_RETURN = '/onboarding/questions';

/**
 * POST /api/auth/signup
 * Skapar användare i Auth0 (database connection) med förnamn och efternamn i user_metadata.
 * Efter lyckad signup returneras loginUrl så klienten kan redirecta till inloggning.
 */
export async function POST(request: NextRequest) {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const connection =
    process.env.AUTH0_SIGNUP_CONNECTION ?? 'Username-Password-Authentication';

  if (!domain || !clientId) {
    return NextResponse.json(
      { error: 'Auth0 är inte konfigurerad' },
      { status: 500 }
    );
  }

  let body: { firstName?: string; lastName?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Ogiltig JSON' },
      { status: 400 }
    );
  }

  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: 'Förnamn och efternamn krävs' },
      { status: 400 }
    );
  }
  if (!email) {
    return NextResponse.json(
      { error: 'E-post krävs' },
      { status: 400 }
    );
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: 'Lösenord måste vara minst 8 tecken' },
      { status: 400 }
    );
  }

  const signupUrl = `https://${domain}/dbconnections/signup`;
  const appBaseUrl =
    process.env.APP_BASE_URL ||
    process.env.AUTH0_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    '';

  const res = await fetch(signupUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      connection,
      email,
      password,
      name: `${firstName} ${lastName}`.trim(),
      user_metadata: {
        given_name: firstName,
        family_name: lastName,
      },
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data.code === 'invalid_signup'
        ? data.description || 'E-postadressen används redan eller ogiltiga uppgifter'
        : data.description || data.message || 'Kunde inte skapa konto';
    return NextResponse.json(
      { error: message },
      { status: res.status >= 400 && res.status < 500 ? res.status : 400 }
    );
  }

  const loginUrl = `${appBaseUrl.replace(/\/$/, '')}/api/auth/login?${new URLSearchParams({
    returnTo: AUTH_RETURN,
    login_hint: email,
  }).toString()}`;

  return NextResponse.json({ loginUrl });
}
