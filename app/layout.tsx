import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://source.com'),
  title: {
    default: 'Source - Allt du behöver på ett ställe',
    template: '%s | Source',
  },
  description: 'AI-driven design, e-handel och analys för företagstillväxt. Komplett lösning med konkreta rekommendationer, inte bara data. Från 2,995 kr/mån.',
  keywords: ['ai driven webbdesign', 'e-handel helhetslösning', 'webbdesign prenumeration', 'ai webbanalys', 'e-handelsplattform sverige'],
  authors: [{ name: 'Source' }],
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://source.com',
    siteName: 'Source',
    title: 'Source - Allt du behöver på ett ställe',
    description: 'AI-driven design, e-handel och analys för företagstillväxt.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={inter.variable}>
      <body className="font-sans antialiased">
        <ScrollProgress />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
