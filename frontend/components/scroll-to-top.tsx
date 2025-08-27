"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global component that scrolls to top on every route change
 * This ensures users always start at the top of the page when navigating
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
}
