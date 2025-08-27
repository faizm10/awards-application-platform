// Application Routes Constants
export const ROUTES = {
  // Main pages
  HOME: '/',
  AWARDS: '/awards',
  MY_APPLICATIONS: '/my-applications',
  
  // Award specific routes
  AWARD_DETAILS: (id: string) => `/awards/${id}`,
  AWARD_APPLY: (id: string) => `/awards/${id}/apply`,
  
  // Application specific routes
  APPLICATION_DETAILS: (id: string) => `/my-applications/${id}`,
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin-dashboard',
  ADMIN_AWARDS: '/admin-dashboard/awards',
  ADMIN_CREATE_AWARD: '/admin-dashboard/awards/create',
  
  // Reviewer routes
  REVIEWER_DASHBOARD: '/reviewer-dashboard',
  
  // Auth routes
  LOGIN: '/auth/login',
  SIGNUP: '/auth/sign-up',
  SIGNUP_SUCCESS: '/auth/sign-up-success',
  FORGOT_PASSWORD: '/auth/forgot-password',
} as const;

// Navigation menu items
export const NAVIGATION_ITEMS = [
  {
    title: 'Home',
    href: ROUTES.HOME,
    icon: 'Home',
  },
  {
    title: 'Browse Awards',
    href: ROUTES.AWARDS,
    icon: 'Award',
  },
  {
    title: 'My Applications',
    href: ROUTES.MY_APPLICATIONS,
    icon: 'FileText',
  },
] as const;

// Admin navigation items
export const ADMIN_NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    href: ROUTES.ADMIN_DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    title: 'Awards',
    href: ROUTES.ADMIN_AWARDS,
    icon: 'Award',
  },
  {
    title: 'Create Award',
    href: ROUTES.ADMIN_CREATE_AWARD,
    icon: 'Plus',
  },
] as const;

// Reviewer navigation items
export const REVIEWER_NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    href: ROUTES.REVIEWER_DASHBOARD,
    icon: 'LayoutDashboard',
  },
] as const;
