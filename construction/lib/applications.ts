import { createClient } from "@/supabase/client";

export interface Application {
  id: string;
  award_id: string;
  student_id: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "reviewed";
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  
  // Form fields
  first_name?: string;
  last_name?: string;
  student_id_text?: string;
  major_program?: string;
  credits_completed?: string;
  email?: string;
  
  // Document URLs
  resume_url?: string;
  letter_url?: string;
  community_letter_url?: string;
  international_intent_url?: string;
  certificate_url?: string;
  
  // Text responses
  response_text?: string;
  travel_description?: string;
  travel_benefit?: string;
  budget?: string;
  
  // Essay responses stored as JSON
  essay_responses?: Record<string, string>;
  
  // Related data (from joins)
  award?: any; // Award data from join
  student?: any; // Student data from join
}

export interface ApplicationFormData {
  // Standard fields
  first_name?: string;
  last_name?: string;
  student_id_text?: string;
  major_program?: string;
  credits_completed?: string;
  email?: string;
  
  // Document URLs
  resume_url?: string;
  letter_url?: string;
  community_letter_url?: string;
  international_intent_url?: string;
  certificate_url?: string;
  
  // Text responses
  response_text?: string;
  travel_description?: string;
  travel_benefit?: string;
  budget?: string;
  
  // Essay responses
  essay_responses?: Record<string, string>;
  
  // Allow additional dynamic fields
  [key: string]: string | Record<string, string> | undefined;
}

/**
 * Get application by award ID and student ID
 */
export async function getApplicationByAwardAndStudent(
  awardId: string,
  studentId: string
): Promise<Application | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("award_id", awardId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching application:", error);
    return null;
  }

  return data;
}

/**
 * Get all applications for a student
 */
export async function getApplicationsByStudent(
  studentId: string
): Promise<Application[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      award:awards (
        id,
        title,
        code,
        value,
        category
      )
    `)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }

  return data || [];
}

/**
 * Get application by ID
 */
export async function getApplicationById(
  id: string
): Promise<Application | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      award:awards (
        id,
        title,
        code,
        value,
        category,
        description
      ),
      student:profiles (
        id,
        full_name,
        email
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching application:", error);
    return null;
  }

  return data;
}

/**
 * Create a new application
 */
export async function createApplication(
  awardId: string,
  studentId: string,
  formData: ApplicationFormData
): Promise<Application | null> {
  const supabase = createClient();
  
  const applicationData = {
    award_id: awardId,
    student_id: studentId,
    status: "draft",
    ...formData,
  };

  const { data, error } = await supabase
    .from("applications")
    .insert([applicationData])
    .select()
    .single();

  if (error) {
    console.error("Error creating application:", error);
    return null;
  }

  return data;
}

/**
 * Update an existing application
 */
export async function updateApplication(
  id: string,
  updates: Partial<ApplicationFormData & { status?: string; submitted_at?: string }>
): Promise<Application | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("applications")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating application:", error);
    return null;
  }

  return data;
}

/**
 * Submit an application (change status to submitted)
 */
export async function submitApplication(
  id: string,
  formData: ApplicationFormData
): Promise<Application | null> {
  const supabase = createClient();
  
  const submissionData = {
    ...formData,
    status: "submitted",
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("applications")
    .update(submissionData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error submitting application:", error);
    return null;
  }

  return data;
}

/**
 * Save application as draft
 */
export async function saveApplicationDraft(
  awardId: string,
  studentId: string,
  formData: ApplicationFormData,
  existingApplicationId?: string
): Promise<Application | null> {
  if (existingApplicationId) {
    return updateApplication(existingApplicationId, formData);
  } else {
    return createApplication(awardId, studentId, formData);
  }
}

/**
 * Get status color for UI display
 */
export function getStatusColor(status: Application["status"]): string {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "submitted":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "under_review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "reviewed":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Get status label for UI display
 */
export function getStatusLabel(status: Application["status"]): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "under_review":
      return "Under Review";
    case "reviewed":
      return "Reviewed";
    case "approved":
      return "Approved";
    case "rejected":
      return "Not Selected";
    default:
      return "Unknown";
  }
}

/**
 * Validate application form data
 */
export function validateApplicationForm(
  formData: ApplicationFormData,
  requiredFields: Array<{ field_name: string; label: string; required: boolean }>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    if (field.required) {
      const value = formData[field.field_name as keyof ApplicationFormData];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors.push(`${field.label} is required`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Transform form data to match database schema
 */
export function transformFormDataToApplication(
  formData: Record<string, string>,
  documents: Record<string, string>,
  essayResponses: Record<string, string>
): ApplicationFormData {
  const transformed: ApplicationFormData = {};

  // Map form fields
  Object.entries(formData).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      transformed[key as keyof ApplicationFormData] = value;
    }
  });

  // Map document URLs - handle common field name mappings
  Object.entries(documents).forEach(([key, url]) => {
    if (url && url.trim() !== "") {
      let fieldName: keyof ApplicationFormData;
      
      // Map common field names to database columns
      switch (key.toLowerCase()) {
        case 'resume':
          fieldName = 'resume_url';
          break;
        case 'letter':
        case 'reference_letter':
        case 'reference letter':
          fieldName = 'letter_url';
          break;
        case 'community_letter':
        case 'community letter':
          fieldName = 'community_letter_url';
          break;
        case 'international_intent':
        case 'international intent':
          fieldName = 'international_intent_url';
          break;
        case 'certificate':
          fieldName = 'certificate_url';
          break;
        default:
          // For other fields, append _url
          fieldName = `${key}_url` as keyof ApplicationFormData;
      }
      
      transformed[fieldName] = url;
    }
  });

  // Add essay responses as JSON
  if (Object.keys(essayResponses).length > 0) {
    transformed.essay_responses = essayResponses;
  }

  return transformed;
}

/**
 * Extract form data from an existing application for display
 */
export function extractFormDataFromApplication(application: Application): {
  formData: Record<string, string>;
  documents: Record<string, string>;
  essayResponses: Record<string, string>;
} {
  const formData: Record<string, string> = {};
  const documents: Record<string, string> = {};
  const essayResponses: Record<string, string> = {};

  // Extract regular form fields
  Object.entries(application).forEach(([key, value]) => {
    if (value && typeof value === 'string' && 
        key !== 'id' && key !== 'award_id' && key !== 'student_id' && 
        key !== 'status' && key !== 'submitted_at' && key !== 'created_at' && 
        key !== 'updated_at' && key !== 'essay_responses') {
      
      if (key.endsWith('_url')) {
        // This is a document URL
        const fieldName = key.replace('_url', '');
        documents[fieldName] = value;
      } else {
        // This is a regular form field
        formData[key] = value;
      }
    }
  });

  // Extract essay responses
  if (application.essay_responses) {
    Object.assign(essayResponses, application.essay_responses);
  }

  return { formData, documents, essayResponses };
}
