import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt - Vi svarar inom 24 timmar',
  description: 'Har du frågor om Source? Kontakta oss via formulär, e-post eller telefon. Vi svarar inom 24 timmar. Boka även en kostnadsfri demo.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}







