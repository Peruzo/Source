import type { Metadata } from 'next';
import { NyStartsida } from '@/components/ny-startsida/NyStartsida';

// NY STARTSIDA: redesign 1 som egen sida, för granskning innan den eventuellt ersätter /.
// Indexeras inte. Bytet av / görs i en separat PR.
export const metadata: Metadata = {
  title: 'Ny startsida',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function NyStartsidaPage() {
  return <NyStartsida />;
}
