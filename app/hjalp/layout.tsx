import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hjälpcenter - Source',
  description: 'Hitta svar på dina frågor om Source. Sök eller bläddra bland kategorier för att hitta den information du behöver.',
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


