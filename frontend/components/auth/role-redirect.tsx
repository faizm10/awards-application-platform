"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function RoleRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if still loading or no user
    if (loading || !user) return;

    // Simple admin check
    const isAdmin = user.email?.includes('admin') || user.email?.includes('administrator');
    
    // Don't redirect if already on the correct page
    const currentPath = pathname;

    // Define role-based redirects
    const targetPath = isAdmin ? '/admin-dashboard' : '/awards';
    
    // Redirect if user is not on their appropriate page
    if (targetPath && currentPath !== targetPath) {
      // Only redirect from certain pages to avoid infinite loops
      const shouldRedirect = [
        '/',
        '/login',
        '/sign-up',
        '/auth/confirm',
        '/auth/error'
      ].includes(currentPath) || currentPath.startsWith('/auth/');

      if (shouldRedirect) {
        router.push(targetPath);
      }
    }
  }, [user, loading, router, pathname]);

  return null; // This component doesn't render anything
}
