"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function RoleRedirect() {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if still loading or no user
    if (loading || !user) return;

    const currentPath = pathname;
    const role = userRole ?? 'student';
    const targetPath =
      role === 'admin'
        ? '/admin-dashboard'
        : role === 'reviewer'
          ? '/reviewer-dashboard'
          : '/awards';
    
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
  }, [user, loading, userRole, router, pathname]);

  return null; // This component doesn't render anything
}
