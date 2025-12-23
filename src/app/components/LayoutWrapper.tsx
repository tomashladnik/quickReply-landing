'use client';

import { usePathname } from 'next/navigation';
import { ServiceBenefitsSection as Header } from './sections/ServiceBenefitsSection';
import { Footer } from './sections/FAQSection';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages that should not show the main header/footer
  const excludedPaths = [
    '/dentalscan',
    '/sales',
    '/patient-scan',
    '/dentist-dashboard',
    '/student',
  ];
  const shouldShowLayout = !excludedPaths.some(path => pathname.startsWith(path));

  if (!shouldShowLayout) {
    // DentalScan and other excluded pages: no header/footer
    return <>{children}</>;
  }

  // Main pages: show header and footer
  return (
    <>
      <Header />
      <main id="main-content" className="w-full flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
