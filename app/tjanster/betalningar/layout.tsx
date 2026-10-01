import { Metadata } from 'next';

// The page itself is a client component, so its metadata lives here – the same pattern as
// app/ai-assistent/layout.tsx. No numbers, fees or package prices.
export const metadata: Metadata = {
  title: 'Betalningar - kort, betalningslänk, faktura och prenumeration',
  description:
    'Ta betalt med kort i din butik, via betalningslänk, faktura eller prenumeration, och se alla betalningar på ett ställe. Pengarna går till ditt eget Stripe-konto. Se också vilket paket varje funktion ingår i.',
};

export default function BetalningarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
