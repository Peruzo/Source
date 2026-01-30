'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const showIcon = `
  <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`;
const hideIcon = `
  <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="3" y1="3" x2="21" y2="21"/>
  </svg>`;

const AUTH_RETURN = '/onboarding/questions';

export default function OnboardingLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const authBase = useMemo(() => {
    const params = new URLSearchParams({
      returnTo: AUTH_RETURN,
      login_hint: email || '',
    });
    return `/api/auth/login?${params.toString()}`;
  }, [email]);

  const signupUrl = useMemo(() => {
    const params = new URLSearchParams({
      returnTo: AUTH_RETURN,
      screen_hint: 'signup',
      login_hint: email || '',
    });
    return `/api/auth/login?${params.toString()}`;
  }, [email]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(authBase);
  };

  const handleOAuth = (connection: string) => {
    const params = new URLSearchParams({
      returnTo: AUTH_RETURN,
      connection,
    });
    router.push(`/api/auth/login?${params.toString()}`);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((current) => !current);
  };

  return (
    <div className="container">
        <div className="left">
          <img src="/source-logo.png" alt="Source" className="logo" />
        </div>
        <div className="right">
          <div className="login-box">
            <h1>Logga in</h1>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="E-post"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <div className="password-container">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Lösenord"
                  required
                />
                <span
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label="Visa/dölj lösenord"
                  dangerouslySetInnerHTML={{
                    __html: passwordVisible ? hideIcon : showIcon,
                  }}
                />
              </div>
              <button type="submit">Logga in</button>
            </form>

            <div className="register-link">
              Har du inget konto? <a href={signupUrl}>Skapa konto</a>
            </div>

            <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
              <button type="button" onClick={() => handleOAuth('google-oauth2')}>
                Fortsätt med Google
              </button>
              <button type="button" onClick={() => handleOAuth('github')}>
                Fortsätt med GitHub
              </button>
              <button type="button" onClick={() => handleOAuth('apple')}>
                Fortsätt med Apple
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
