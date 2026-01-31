'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  getPlan,
  getStoredPlanId,
  setStoredPlanId,
  type SelectedPlan,
} from '@/lib/onboarding/selected-plan';
import './onboarding-login.css';

/* Öga-ikon enligt customer portal design-spec (stroke #ffffffaa) */
const showIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffffaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`;
const hideIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffffaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="3" y1="3" x2="21" y2="21"/>
  </svg>`;

const AUTH_RETURN = '/onboarding/questions';

export function LoginClient() {
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const planIdFromUrl = searchParams.get('plan');
    const planId = planIdFromUrl ?? getStoredPlanId();
    if (planIdFromUrl) setStoredPlanId(planIdFromUrl);
    setSelectedPlan(getPlan(planId));
  }, [searchParams]);

  const signupUrl = useMemo(() => {
    const params = new URLSearchParams({
      returnTo: AUTH_RETURN,
      screen_hint: 'signup',
      login_hint: email || '',
    });
    return `/api/auth/login?${params.toString()}`;
  }, [email]);

  const handleCreateAccount = (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    if (password !== confirmPassword) {
      setPasswordError('Lösenorden matchar inte');
      return;
    }
    if (password.length < 8) {
      setPasswordError('Lösenordet måste vara minst 8 tecken');
      return;
    }
    window.location.href = signupUrl;
  };

  const handleOAuth = (connection: string) => {
    const params = new URLSearchParams({
      returnTo: AUTH_RETURN,
      connection,
    });
    window.location.href = `/api/auth/login?${params.toString()}`;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((current) => !current);
  };

  const toggleConfirmVisibility = () => {
    setConfirmVisible((current) => !current);
  };

  return (
    <div className="onboarding-login-page">
      <div className="container">
        <div className="left">
          <div className="login-box">
            {selectedPlan && (
              <div className="valt-paket">
                <h2 className="valt-paket-title">Valt paket</h2>
                <p className="valt-paket-name">{selectedPlan.name}</p>
                <p className="valt-paket-price">
                  {selectedPlan.price === 'Pris på förfrågan'
                    ? selectedPlan.price
                    : `${selectedPlan.price} ${selectedPlan.currency}/${selectedPlan.interval}`}
                </p>
                <ul className="valt-paket-features">
                  {selectedPlan.features.slice(0, 4).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link href="/priser" className="valt-paket-change">
                  Ändra paket
                </Link>
              </div>
            )}
            <h1>Skapa konto</h1>
            <form onSubmit={handleCreateAccount}>
              <input
                type="email"
                name="email"
                placeholder="E-post"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="password-container">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="Lösenord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label="Visa/dölj lösenord"
                  role="button"
                  dangerouslySetInnerHTML={{
                    __html: passwordVisible ? hideIcon : showIcon,
                  }}
                />
              </div>
              <div className="password-container">
                <input
                  type={confirmVisible ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Lösenord igen"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  minLength={8}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={toggleConfirmVisibility}
                  aria-label="Visa/dölj lösenord"
                  role="button"
                  dangerouslySetInnerHTML={{
                    __html: confirmVisible ? hideIcon : showIcon,
                  }}
                />
              </div>
              {passwordError && (
                <p className="form-error" role="alert">
                  {passwordError}
                </p>
              )}
              <button type="submit">Skapa konto</button>
            </form>
            <div className="oauth-buttons">
              <button type="button" onClick={() => handleOAuth('google-oauth2')} className="oauth-btn oauth-btn-google">
                <img src="/Images/google-icon-logo-svgrepo-com.svg" alt="" className="oauth-icon" />
                <span>Fortsätt med Google</span>
              </button>
              <button type="button" onClick={() => handleOAuth('github')} className="oauth-btn oauth-btn-github">
                <img src="/Images/github-142-svgrepo-com.svg" alt="" className="oauth-icon oauth-icon-invert" />
                <span>Fortsätt med GitHub</span>
              </button>
              <button type="button" onClick={() => handleOAuth('apple')} className="oauth-btn oauth-btn-apple">
                <img src="/Images/apple-black-logo-svgrepo-com.svg" alt="" className="oauth-icon oauth-icon-invert" />
                <span>Fortsätt med Apple</span>
              </button>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="logo-wrapper">
            <img src="/source-logo.png" alt="Source logga" className="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
