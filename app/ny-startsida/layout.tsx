import localFont from 'next/font/local';

// NY STARTSIDA: General Sans är designsystemets typsnitt (app/fonts/GeneralSans-Variable.woff2,
// ITF Free Font License, se app/fonts/GeneralSans-FFL.txt). Det laddas bara här, så att
// resten av sajten (Inter via app/layout.tsx) inte påverkas.
const generalSans = localFont({
  src: '../fonts/GeneralSans-Variable.woff2',
  weight: '200 700',
  display: 'swap',
  variable: '--font-general-sans',
  adjustFontFallback: 'Arial',
});

export default function NyStartsidaLayout({ children }: { children: React.ReactNode }) {
  return <div className={generalSans.variable}>{children}</div>;
}
