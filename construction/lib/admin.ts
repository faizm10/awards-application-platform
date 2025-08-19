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

// Mock admin data
export const getAwardStats = () => {
  const totalAwards = 6
  const activeAwards = 4
  const totalApplications = 261
  const totalValue = 2400000 // $2.4M

  return {
    totalAwards,
    activeAwards,
    draftAwards: 1,
    archivedAwards: 1,
    totalApplications,
    totalValue,
    averageApplicationsPerAward: Math.round(totalApplications / activeAwards),
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

export const getApplicationStatsByAward = (awardId: string) => {
  // Mock data - in real app, this would query the database
  const mockStats = {
    "1": { total: 45, submitted: 45, draft: 0, underReview: 30, shortlisted: 8, awarded: 1 },
    "2": { total: 32, submitted: 32, draft: 0, underReview: 25, shortlisted: 5, awarded: 1 },
    "3": { total: 28, submitted: 28, draft: 0, underReview: 20, shortlisted: 4, awarded: 1 },
    "4": { total: 67, submitted: 60, draft: 7, underReview: 45, shortlisted: 10, awarded: 2 },
    "5": { total: 89, submitted: 89, draft: 0, underReview: 0, shortlisted: 15, awarded: 3 },
    "6": { total: 0, submitted: 0, draft: 0, underReview: 0, shortlisted: 0, awarded: 0 },
  }

  return (
    mockStats[awardId as keyof typeof mockStats] || {
      total: 0,
      submitted: 0,
      draft: 0,
      underReview: 0,
      shortlisted: 0,
      awarded: 0,
    }
  )
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
