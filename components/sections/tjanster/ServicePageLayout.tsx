import type { ReactNode } from 'react';

/**
 * Frame for a service page (/tjanster/*). Renders the page's sections and,
 * when there is one, the closing block shared by all service pages (a video,
 * planned). Without `outro` nothing extra is rendered – no placeholder.
 */
export function ServicePageLayout({ children, outro }: { children: ReactNode; outro?: ReactNode }) {
  return (
    <>
      {children}
      {outro ?? null}
    </>
  );
}
