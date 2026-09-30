import { Metadata } from 'next';

// The page itself is a client component, so its metadata lives here – the same pattern as
// app/kontakt/layout.tsx and app/portfolio/layout.tsx. No numbers, times or package prices.
export const metadata: Metadata = {
  title: 'Source AI - AI-assistenten i kundportalen',
  description:
    'Fråga Source AI om fakturor, ordrar, betalningar och lager direkt i kundportalen. Se också bokföringshjälpen, kampanjassistenten och vilket paket varje AI-funktion ingår i.',
};

export default function AIAssistentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
