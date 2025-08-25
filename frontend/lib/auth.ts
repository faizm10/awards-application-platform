import { createClient } from '@/supabase/client';

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
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
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
