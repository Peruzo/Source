import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { AIAssistantProvider } from "@/components/ui/AIAssistantProvider";
import { HydrationErrorBoundary } from "@/components/HydrationErrorBoundary";

// Self-hosted Inter (rsms/inter 4.1, OFL – see app/fonts/Inter-OFL.txt), so the
// build never fetches from Google Fonts: with next/font/google every build was a
// lottery – Google occasionally answers with `/l/font?kit=…&…` URLs that break
// Turbopack's font loader (vercel/next.js#99114). The file is the variable font
// instanced to opsz 14 and wght 300–700 (what Google served us) and subset to
// latin + latin-ext with all OpenType features kept (tabular-nums is used).
const inter = localFont({
  src: './fonts/InterVariable-latin.woff2',
  weight: '300 700',
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: 'Arial',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sourcesolutions.se'),
  title: {
    default: 'Source - Allt du behöver på ett ställe',
    template: '%s | Source',
  },
  description: 'Source Solutions samlar allt du behöver för att sälja, på ett ställe. Butik, betalningar, frakt, kunder och bokföring i en plattform.',
  keywords: ['ai driven webbdesign', 'e-handel helhetslösning', 'webbdesign prenumeration', 'ai webbanalys', 'e-handelsplattform sverige'],
  authors: [{ name: 'Source' }],
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://sourcesolutions.se',
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
  const serverYear = new Date().getFullYear();
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_HYDRATION === '1') {
    console.log('[Layout SSR] serverYear=', serverYear);
  }
  return (
    <html lang="sv" className={inter.variable}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <HydrationErrorBoundary>
          <ScrollProgress />
          <Header />
          <main>{children}</main>
          <Footer serverYear={serverYear} />
          <AIAssistantProvider />
        </HydrationErrorBoundary>
      </body>
    </html>
  );
}
