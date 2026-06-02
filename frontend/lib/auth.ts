import { createClient } from '@/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { formatSupabaseError } from '@/lib/supabase-errors';

export type UserRole = "student" | "reviewer" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  studentId?: string
  faculty?: string
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  user_type: 'student' | 'reviewer' | 'admin';
  created_at: string;
  updated_at: string;
  committee?: string;
}

/**
 * Get user profile data including user_type
 */
/** Map seed / dev login emails to roles when auto-creating a profile row. */
const SEED_EMAIL_ROLES: Record<string, UserProfile['user_type']> = {
  'admin@uoguelph.ca': 'admin',
  'reviewer@uoguelph.ca': 'reviewer',
};

/** Fallback when profiles row is not loaded yet (dev / first sign-in). */
export function roleFromEmail(email: string | undefined): UserRole {
  if (!email) return 'student';
  if (SEED_EMAIL_ROLES[email]) return SEED_EMAIL_ROLES[email];
  if (email.includes('admin') || email.includes('administrator')) return 'admin';
  if (email.includes('reviewer')) return 'reviewer';
  return 'student';
}

export function resolveUserRole(
  profile: UserProfile | null | undefined,
  email: string | undefined
): UserRole {
  return profile?.user_type ?? roleFromEmail(email);
}

/**
 * Create a profiles row for the signed-in user when missing (e.g. after auth-only mock-seed).
 */
export async function ensureUserProfile(user: SupabaseUser): Promise<void> {
  const supabase = createClient();

  const { data: existing, error: lookupError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (lookupError) {
    console.error('Error checking user profile:', formatSupabaseError(lookupError));
    return;
  }
  if (existing) return;

  const email = user.email;
  if (!email) return;

  const user_type = SEED_EMAIL_ROLES[email] ?? roleFromEmail(email);
  const full_name =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : null;

  const { error: insertError } = await supabase.from('profiles').insert({
    id: user.id,
    email,
    full_name,
    user_type,
  });

  if (!insertError) return;

  // Sign-in can run ensureUserProfile twice in parallel; the second insert loses the race.
  if (insertError.code === '23505') return;

  console.error('Failed to create user profile:', formatSupabaseError(insertError));
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', formatSupabaseError(error));
    return null;
  }

  return data ?? null;
}

/**
 * Get user type (student, reviewer, admin)
 */
export async function getUserType(userId: string): Promise<'student' | 'reviewer' | 'admin' | null> {
  const profile = await getUserProfile(userId);
  return profile?.user_type || null;
}

// Mock authentication - in a real app, this would connect to your auth provider
export const mockUsers: User[] = [
  {
    id: "1",
    email: "student@uoguelph.ca",
    name: "John Smith",
    role: "student",
    studentId: "1234567",
    faculty: "College of Engineering and Physical Sciences",
  },
  {
    id: "2",
    email: "reviewer@uoguelph.ca",
    name: "Dr. Jane Wilson",
    role: "reviewer",
    faculty: "College of Arts",
  },
  {
    id: "3",
    email: "admin@uoguelph.ca",
    name: "Sarah Johnson",
    role: "admin",
  },
]

export const getCurrentUser = (): User | null => {
  // Mock current user - in a real app, this would get from session/token
  return mockUsers[0] // Default to student for demo
}

export const login = async (email: string, password: string): Promise<User | null> => {
  // Mock login - in a real app, this would authenticate with your backend
  const user = mockUsers.find((u) => u.email === email)
  return user || null
}

export const logout = async (): Promise<void> => {
  // Mock logout - in a real app, this would clear session/token
  console.log("User logged out")
}
