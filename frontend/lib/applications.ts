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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...formData,
  };

  const { data, error } = await supabase
    .from("applications")
    .insert([applicationData])
    .select()
    .single();

  if (error) {
    console.error("Error creating application:", error);
    console.error("Application data:", applicationData);
    console.error("Award ID:", awardId);
    console.error("Student ID:", studentId);
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
 * Transform form data to match database schema with dynamic field mapping
 */
export function transformFormDataToApplication(
  formData: Record<string, string>,
  documents: Record<string, string>,
  essayResponses: Record<string, string>,
  requirements?: Array<{ field_name: string; type: string; field_config?: any }>
): ApplicationFormData {
  const transformed: ApplicationFormData = {};

  console.log("transformFormDataToApplication called with:", {
    formData,
    documents,
    essayResponses,
    requirements
  });

  // Map form fields
  Object.entries(formData).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      transformed[key as keyof ApplicationFormData] = value;
    }
  });

  // Map document URLs dynamically based on requirements
  Object.entries(documents).forEach(([key, url]) => {
    if (url && url.trim() !== "") {
      // Find the corresponding requirement to get the field_name
      const requirement = requirements?.find(req => 
        req.field_name === key || 
        req.field_name.toLowerCase() === key.toLowerCase()
      );
      
      if (requirement) {
        let fieldName: keyof ApplicationFormData;
        
        if (requirement.type === 'file') {
          // Special handling for resume fields
          if (requirement.field_config?.file_type === 'resume' || 
              requirement.field_name === 'resume_upload' || 
              requirement.field_name === 'resume') {
            fieldName = 'resume_url' as keyof ApplicationFormData;
          } else {
            // For file types, check if field_name already ends with _url
            if (requirement.field_name.endsWith('_url')) {
              fieldName = requirement.field_name as keyof ApplicationFormData;
            } else {
              fieldName = `${requirement.field_name}_url` as keyof ApplicationFormData;
            }
          }
        } else {
          fieldName = requirement.field_name as keyof ApplicationFormData;
        }
        
        transformed[fieldName] = url;
        console.log(`Mapped document ${key} to field ${fieldName}`);
      } else {
        // Fallback: append _url for unknown fields, but avoid double _url
        const fieldName = key.endsWith('_url') 
          ? key as keyof ApplicationFormData
          : `${key}_url` as keyof ApplicationFormData;
        transformed[fieldName] = url;
        console.log(`Fallback mapped document ${key} to field ${fieldName}`);
      }
    }
  });

  // Add essay responses as JSON
  if (Object.keys(essayResponses).length > 0) {
    transformed.essay_responses = essayResponses;
  }

  console.log("Final transformed data:", transformed);
  return transformed;
}

/**
 * Extract form data from an existing application for display
 */
export function extractFormDataFromApplication(
  application: Application,
  requirements?: Array<{ field_name: string; type: string; field_config?: any }>
): {
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
        // This is a document URL - find the original field name from requirements
        const fieldName = key.replace('_url', '');
        const requirement = requirements?.find(req => 
          req.field_name === fieldName || 
          req.field_name === key || // Handle cases where field_name already has _url
          `${req.field_name}_url` === key
        );
        
        // Special handling for resume_url
        if (key === 'resume_url') {
          const resumeRequirement = requirements?.find(req => 
            req.field_config?.file_type === 'resume' || 
            req.field_name === 'resume_upload' || 
            req.field_name === 'resume'
          );
          const originalFieldName = resumeRequirement?.field_name || 'resume_upload';
          documents[originalFieldName] = value;
        } else {
          // Use the original field_name from requirements if found, otherwise use the key
          const originalFieldName = requirement?.field_name || fieldName;
          documents[originalFieldName] = value;
        }
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

/**
 * Generate a professional PDF of the application data
 */
export async function generateApplicationPDF(application: Application, award: any, requirements?: Array<{ field_name: string; label: string; type: string; required?: boolean; field_config?: any }>): Promise<Blob | null> {
  try {
    // Extract form data
    const { formData, essayResponses } = extractFormDataFromApplication(application, requirements);
    
    // Create PDF content using jsPDF
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Set up styling
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;
    
    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, y: number, fontSize: number = 12, fontStyle: string = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, y);
      return y + (lines.length * fontSize * 0.4);
    };
    
    // Helper function to add section header
    const addSectionHeader = (title: string, y: number) => {
      yPosition = addWrappedText(title, y, 16, 'bold');
      yPosition += 5;
      return yPosition;
    };
    
    // Helper function to add field
    const addField = (label: string, value: string, y: number) => {
      if (!value || value.trim() === '') return y;
      
      const labelText = `${label}:`;
      const valueText = value;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(labelText, margin, y);
      
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(valueText, contentWidth - 30);
      doc.text(lines, margin + 30, y);
      
      return y + (lines.length * 10 * 0.4) + 5;
    };
    
    // Header
    yPosition = addWrappedText('AWARD APPLICATION', yPosition, 20, 'bold');
    yPosition += 10;
    
    // Award Information
    yPosition = addSectionHeader('Award Information', yPosition);
    yPosition = addField('Award Title', award?.title || 'N/A', yPosition);
    yPosition = addField('Award Value', award?.value || 'N/A', yPosition);
    yPosition = addField('Category', award?.category || 'N/A', yPosition);
    yPosition = addField('Application Status', getStatusLabel(application.status), yPosition);
    yPosition = addField('Submitted Date', application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : 'N/A', yPosition);
    yPosition += 10;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }
    
    // Personal Information
    yPosition = addSectionHeader('Personal Information', yPosition);
    yPosition = addField('First Name', formData.first_name || '', yPosition);
    yPosition = addField('Last Name', formData.last_name || '', yPosition);
    yPosition = addField('Student ID', formData.student_id_text || '', yPosition);
    yPosition = addField('Email', formData.email || '', yPosition);
    yPosition = addField('Major/Program', formData.major_program || '', yPosition);
    yPosition = addField('Credits Completed', formData.credits_completed || '', yPosition);
    yPosition += 10;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }
    
    // Application Responses
    const hasResponses = formData.response_text || formData.travel_description || formData.travel_benefit || formData.budget;
    if (hasResponses) {
      yPosition = addSectionHeader('Application Responses', yPosition);
      yPosition = addField('Response', formData.response_text || '', yPosition);
      yPosition = addField('Travel Description', formData.travel_description || '', yPosition);
      yPosition = addField('Travel Benefit', formData.travel_benefit || '', yPosition);
      yPosition = addField('Budget', formData.budget || '', yPosition);
      yPosition += 10;
    }
    
    // Essay Responses
    if (essayResponses && Object.keys(essayResponses).length > 0) {
      // Check if we need a new page
      if (yPosition > 200) {
        doc.addPage();
        yPosition = margin;
      }
      
      yPosition = addSectionHeader('Essay Responses', yPosition);
      
      Object.entries(essayResponses).forEach(([key, response], index) => {
        if (response && response.trim() !== '') {
          const essayTitle = `Essay ${index + 1}`;
          yPosition = addField(essayTitle, response, yPosition);
          
          // Check if we need a new page for long essays
          if (yPosition > 250) {
            doc.addPage();
            yPosition = margin;
          }
        }
      });
      yPosition += 10;
    }
    
    // Document List (without URLs)
    if (requirements) {
      const fileRequirements = requirements.filter(req => req.type === 'file');
      if (fileRequirements.length > 0) {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = margin;
        }
        
        yPosition = addSectionHeader('Submitted Documents', yPosition);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        fileRequirements.forEach((req, index) => {
          const isRequired = req.required ? ' (Required)' : ' (Optional)';
          const docText = `${index + 1}. ${req.label}${isRequired}`;
          doc.text(docText, margin, yPosition);
          yPosition += 5;
        });
      }
    }
    
    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 30, doc.internal.pageSize.getHeight() - 10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, doc.internal.pageSize.getHeight() - 10);
    }
    
    // Generate PDF blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}


