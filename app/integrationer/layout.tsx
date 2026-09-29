import { IntegrationerSections } from '@/components/sections/tjanster/integrationer/IntegrationerSections';

// The hero is the page itself (page.tsx) and stays as it is; the service sections
// follow it here.
export default function IntegrationerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <IntegrationerSections />
    </>
  );
}
