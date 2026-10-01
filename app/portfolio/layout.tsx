import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Projekt vi är stolta över',
  description:
    'Se ett urval av hemsidor som Source har byggt. Varje hemsida är kopplad till kundportalen, där butik, betalningar och kunder samlas på ett ställe.',
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
