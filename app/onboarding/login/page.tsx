import { Suspense } from 'react';
import { LoginClient } from './login-client';

export default function OnboardingLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="onboarding-login-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f1117' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>Laddar...</p>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
