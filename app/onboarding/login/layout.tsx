import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  minimumScale: 0.5,
  maximumScale: 3,
};

export const metadata = {
  title: 'Logga in – Source',
};

export default function OnboardingLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
