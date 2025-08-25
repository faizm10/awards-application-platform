import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Custom hook to scroll to top when the pathname changes
 * This ensures users always start at the top of the page when navigating
 */
export function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);
}

/**
 * Alternative hook that scrolls to top on component mount
 * Use this when you want to scroll to top only when the component first loads
 */
export function useScrollToTopOnMount() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
}
