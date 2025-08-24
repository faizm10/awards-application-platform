import { createClient } from '@/supabase/client';

export interface AwardFormField {
  id: string
  type: "text" | "textarea" | "select" | "number" | "date" | "file"
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select fields
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface AwardTemplate {
  id: string
  title: string
  description: string
  fullDescription: string
  value: string
  deadline: string
  eligibility: string[]
  faculty: string
  awardType: "scholarship" | "grant" | "bursary" | "prize"
  requirements: {
    gpa?: number
    year?: string[]
    program?: string[]
    documents: string[]
  }
  customFields: AwardFormField[]
  maxApplications?: number
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface AwardStats {
  totalAwards: number;
  activeAwards: number;
  draftAwards: number;
  totalApplications: number;
  averageApplicationsPerAward: number;
  totalValue: number;
}

export interface AwardWithStats {
  id: string;
  title: string;
  code: string;
  donor: string;
  value: string;
  deadline: string;
  citizenship: string[];
  description: string;
  eligibility: string;
  application_method: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  application_count: number;
  status: 'open' | 'closed' | 'upcoming';
}

/**
 * Get award statistics for admin dashboard
 */
export async function getAwardStats(): Promise<AwardStats> {
  const supabase = createClient();
  
  try {
    // Get total awards
    const { data: awards, error: awardsError } = await supabase
      .from('awards')
      .select('*');
    
    if (awardsError) throw awardsError;
    
    // Get total applications
    const { data: applications, error: applicationsError } = await supabase
      .from('applications')
      .select('*');
    
    if (applicationsError) throw applicationsError;
    
    const totalAwards = awards?.length || 0;
    const activeAwards = awards?.filter(award => award.is_active).length || 0;
    const draftAwards = totalAwards - activeAwards;
    const totalApplications = applications?.length || 0;
    const averageApplicationsPerAward = totalAwards > 0 ? Math.round(totalApplications / totalAwards) : 0;
    
    // Calculate total value (assuming value is stored as string like "$5,000")
    const totalValue = awards?.reduce((sum, award) => {
      const valueStr = award.value.replace(/[$,]/g, '');
      const value = parseFloat(valueStr) || 0;
      return sum + value;
    }, 0) || 0;
    
    return {
      totalAwards,
      activeAwards,
      draftAwards,
      totalApplications,
      averageApplicationsPerAward,
      totalValue,
    };
  } catch (error) {
    console.error('Error fetching award stats:', error);
    return {
      totalAwards: 0,
      activeAwards: 0,
      draftAwards: 0,
      totalApplications: 0,
      averageApplicationsPerAward: 0,
      totalValue: 0,
    };
  }
}

/**
 * Get all awards with application counts
 */
export async function getAwardsWithStats(): Promise<AwardWithStats[]> {
  const supabase = createClient();
  
  try {
    // Get all awards
    const { data: awards, error: awardsError } = await supabase
      .from('awards')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (awardsError) throw awardsError;
    
    // Get application counts for each award
    const { data: applications, error: applicationsError } = await supabase
      .from('applications')
      .select('award_id');
    
    if (applicationsError) throw applicationsError;
    
    // Count applications per award
    const applicationCounts = applications?.reduce((acc, app) => {
      acc[app.award_id] = (acc[app.award_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    // Transform awards with stats
    const awardsWithStats = awards?.map(award => {
      const now = new Date();
      const deadline = new Date(award.deadline);
      
      // Determine status based on deadline and is_active
      let status: 'open' | 'closed' | 'upcoming';
      if (!award.is_active) {
        status = 'closed';
      } else if (deadline < now) {
        status = 'closed';
      } else if (deadline <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) { // 30 days from now
        status = 'open';
      } else {
        status = 'upcoming';
      }
      
      return {
        ...award,
        application_count: applicationCounts[award.id] || 0,
        status,
      };
    }) || [];
    
    return awardsWithStats;
  } catch (error) {
    console.error('Error fetching awards with stats:', error);
    return [];
  }
}

/**
 * Get application statistics for a specific award
 */
export async function getApplicationStatsByAward(awardId: string): Promise<{
  total: number;
  submitted: number;
  draft: number;
  under_review: number;
  approved: number;
  rejected: number;
}> {
  const supabase = createClient();
  
  try {
    const { data: applications, error } = await supabase
      .from('applications')
      .select('status')
      .eq('award_id', awardId);
    
    if (error) throw error;
    
    const stats = {
      total: applications?.length || 0,
      submitted: applications?.filter(app => app.status === 'submitted').length || 0,
      draft: applications?.filter(app => app.status === 'draft').length || 0,
      under_review: applications?.filter(app => app.status === 'under_review').length || 0,
      approved: applications?.filter(app => app.status === 'approved').length || 0,
      rejected: applications?.filter(app => app.status === 'rejected').length || 0,
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching application stats:', error);
    return {
      total: 0,
      submitted: 0,
      draft: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
    };
  }
}

export const createAward = (awardData: Omit<AwardTemplate, "id" | "createdAt" | "updatedAt">): AwardTemplate => {
  const newAward: AwardTemplate = {
    ...awardData,
    id: `award-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In a real app, this would save to database
  console.log("Created award:", newAward)
  return newAward
}

export const updateAward = (id: string, updates: Partial<AwardTemplate>): AwardTemplate | null => {
  // In a real app, this would update in database
  const updatedAward = {
    id,
    ...updates,
    updatedAt: new Date().toISOString(),
  } as AwardTemplate

  console.log("Updated award:", updatedAward)
  return updatedAward
}

export const deleteAward = (id: string): boolean => {
  // In a real app, this would delete from database
  console.log("Deleted award:", id)
  return true
}

export const defaultFormFields: AwardFormField[] = [
  {
    id: "gpa",
    type: "number",
    label: "Current GPA",
    placeholder: "3.75",
    required: true,
    validation: { min: 0, max: 4.0 },
  },
  {
    id: "year",
    type: "select",
    label: "Current Year",
    required: true,
    options: ["1", "2", "3", "4", "5+"],
  },
  {
    id: "program",
    type: "text",
    label: "Program of Study",
    placeholder: "e.g., Computer Engineering",
    required: true,
  },
  {
    id: "faculty",
    type: "select",
    label: "Faculty",
    required: true,
    options: [
      "College of Engineering and Physical Sciences",
      "College of Arts",
      "College of Biological Science",
      "Ontario Agricultural College",
      "College of Business and Economics",
      "College of Social and Applied Human Sciences",
    ],
  },
  {
    id: "personalStatement",
    type: "textarea",
    label: "Personal Statement",
    placeholder: "Tell us about yourself and why you deserve this award...",
    required: false,
  },
]
