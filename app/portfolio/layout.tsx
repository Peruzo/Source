import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Projekt vi är stolta över',
  description:
    'Från e-handel till SaaS. Se ett urval av projekt byggda av Source – design, e-handel, betalningar, hosting och support i en och samma plattform.',
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
