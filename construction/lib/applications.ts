export interface Application {
  id: string
  awardId: string
  studentId: string
  studentName: string
  studentEmail: string
  status: "draft" | "submitted" | "under_review" | "shortlisted" | "rejected" | "awarded"
  submittedAt?: string
  reviewedAt?: string
  reviewerComments?: string
  formData: Record<string, string>
  documents: Record<string, string>
  essayResponses?: Record<string, string>
  createdAt: string
  updatedAt: string
}

// Mock applications data
export const mockApplications: Application[] = [
  {
    id: "app-1",
    awardId: "1",
    studentId: "1",
    studentName: "John Smith",
    studentEmail: "student@uoguelph.ca",
    status: "submitted",
    submittedAt: "2024-02-15T10:30:00Z",
    formData: {
      personalStatement: "I am passionate about engineering and have maintained a 3.8 GPA throughout my studies...",
      gpa: "3.8",
      year: "3",
      program: "Engineering",
      faculty: "College of Engineering and Physical Sciences",
    },
    documents: {
      resume: "john_smith_resume.pdf",
      transcript: "john_smith_transcript.pdf",
      personalStatement: "john_smith_statement.pdf",
    },
    createdAt: "2024-02-10T09:00:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "app-2",
    awardId: "2",
    studentId: "1",
    studentName: "John Smith",
    studentEmail: "student@uoguelph.ca",
    status: "under_review",
    submittedAt: "2024-02-20T14:15:00Z",
    reviewedAt: "2024-02-22T09:00:00Z",
    formData: {
      personalStatement: "My community service experience includes volunteering at local food banks...",
      gpa: "3.8",
      year: "3",
      program: "Engineering",
      faculty: "College of Engineering and Physical Sciences",
      additionalInfo: "I have completed over 150 hours of community service this year.",
    },
    documents: {
      resume: "john_smith_resume.pdf",
      "Community Service Portfolio": "community_service_portfolio.pdf",
      "Reference Letter 1": "reference_1.pdf",
      "Reference Letter 2": "reference_2.pdf",
    },
    createdAt: "2024-02-18T11:00:00Z",
    updatedAt: "2024-02-22T09:00:00Z",
  },
  {
    id: "app-3",
    awardId: "4",
    studentId: "1",
    studentName: "John Smith",
    studentEmail: "student@uoguelph.ca",
    status: "draft",
    formData: {
      gpa: "3.8",
      year: "3",
      program: "Engineering",
      faculty: "College of Engineering and Physical Sciences",
    },
    documents: {
      resume: "john_smith_resume.pdf",
    },
    createdAt: "2024-02-25T16:30:00Z",
    updatedAt: "2024-02-25T16:30:00Z",
  },
]

export const getApplicationsByStudent = (studentId: string): Application[] => {
  return mockApplications.filter((app) => app.studentId === studentId)
}

export const getApplicationById = (id: string): Application | undefined => {
  return mockApplications.find((app) => app.id === id)
}

export const getApplicationByAwardAndStudent = (awardId: string, studentId: string): Application | undefined => {
  return mockApplications.find((app) => app.awardId === awardId && app.studentId === studentId)
}

export const createApplication = (
  awardId: string,
  studentId: string,
  formData: Application["formData"],
  documents: Application["documents"],
): Application => {
  const newApplication: Application = {
    id: `app-${Date.now()}`,
    awardId,
    studentId,
    studentName: "John Smith", // In real app, get from user data
    studentEmail: "student@uoguelph.ca", // In real app, get from user data
    status: "draft",
    formData,
    documents,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockApplications.push(newApplication)
  return newApplication
}

export const updateApplication = (
  id: string,
  updates: Partial<Pick<Application, "formData" | "documents" | "status" | "essayResponses" | "submittedAt">>,
): Application | null => {
  const index = mockApplications.findIndex((app) => app.id === id)
  if (index === -1) return null

  mockApplications[index] = {
    ...mockApplications[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    ...(updates.status === "submitted" && !mockApplications[index].submittedAt
      ? { submittedAt: new Date().toISOString() }
      : {}),
  }

  return mockApplications[index]
}

export const getStatusColor = (status: Application["status"]) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "submitted":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "under_review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "shortlisted":
      return "bg-green-100 text-green-800 border-green-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    case "awarded":
      return "bg-primary/10 text-primary border-primary/20"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getStatusLabel = (status: Application["status"]) => {
  switch (status) {
    case "draft":
      return "Draft"
    case "submitted":
      return "Submitted"
    case "under_review":
      return "Under Review"
    case "shortlisted":
      return "Shortlisted"
    case "rejected":
      return "Not Selected"
    case "awarded":
      return "Awarded"
    default:
      return "Unknown"
  }
}
