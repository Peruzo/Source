import { Metadata } from 'next';

// The page itself is a client component, so its metadata lives here – the same pattern as
// app/ai-assistent/layout.tsx. No numbers or package prices.
export const metadata: Metadata = {
  title: 'Bokningssystem - kunderna bokar på din hemsida',
  description:
    'Låt kunderna boka på din hemsida, med dina tjänster, tider, personal och resurser, och ta betalt vid bokningen om du vill. Se också vilket paket varje funktion ingår i.',
};

export default function BokningssystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
