export interface ReviewerAssignment {
  id: string
  reviewerId: string
  awardId: string
  assignedAt: string
}

export interface ApplicationReview {
  id: string
  applicationId: string
  reviewerId: string
  decision: "pending" | "shortlisted" | "not_shortlisted"
  comments: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

// Mock reviewer assignments
export const mockReviewerAssignments: ReviewerAssignment[] = [
  {
    id: "assign-1",
    reviewerId: "2", // Dr. Jane Wilson
    awardId: "1", // Excellence in Engineering Scholarship
    assignedAt: "2024-02-01T09:00:00Z",
  },
  {
    id: "assign-2",
    reviewerId: "2", // Dr. Jane Wilson
    awardId: "2", // Community Leadership Award
    assignedAt: "2024-02-01T09:00:00Z",
  },
  {
    id: "assign-3",
    reviewerId: "2", // Dr. Jane Wilson
    awardId: "4", // International Student Excellence Award
    assignedAt: "2024-02-01T09:00:00Z",
  },
]

// Mock application reviews
export const mockApplicationReviews: ApplicationReview[] = [
  {
    id: "review-1",
    applicationId: "app-1",
    reviewerId: "2",
    decision: "pending",
    comments: "",
    createdAt: "2024-02-16T10:00:00Z",
    updatedAt: "2024-02-16T10:00:00Z",
  },
  {
    id: "review-2",
    applicationId: "app-2",
    reviewerId: "2",
    decision: "shortlisted",
    comments:
      "Excellent community service record. Strong leadership experience demonstrated through multiple volunteer roles.",
    reviewedAt: "2024-02-22T09:00:00Z",
    createdAt: "2024-02-21T14:00:00Z",
    updatedAt: "2024-02-22T09:00:00Z",
  },
]

export const getReviewerAssignments = (reviewerId: string): ReviewerAssignment[] => {
  return mockReviewerAssignments.filter((assignment) => assignment.reviewerId === reviewerId)
}

export const getApplicationReview = (applicationId: string, reviewerId: string): ApplicationReview | undefined => {
  return mockApplicationReviews.find(
    (review) => review.applicationId === applicationId && review.reviewerId === reviewerId,
  )
}

export const createOrUpdateReview = (
  applicationId: string,
  reviewerId: string,
  decision: ApplicationReview["decision"],
  comments: string,
): ApplicationReview => {
  const existingReviewIndex = mockApplicationReviews.findIndex(
    (review) => review.applicationId === applicationId && review.reviewerId === reviewerId,
  )

  const reviewData = {
    applicationId,
    reviewerId,
    decision,
    comments,
    reviewedAt: decision !== "pending" ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  }

  if (existingReviewIndex >= 0) {
    // Update existing review
    mockApplicationReviews[existingReviewIndex] = {
      ...mockApplicationReviews[existingReviewIndex],
      ...reviewData,
    }
    return mockApplicationReviews[existingReviewIndex]
  } else {
    // Create new review
    const newReview: ApplicationReview = {
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...reviewData,
    }
    mockApplicationReviews.push(newReview)
    return newReview
  }
}

export const getReviewStats = (reviewerId: string) => {
  const assignments = getReviewerAssignments(reviewerId)
  const reviews = mockApplicationReviews.filter((review) => review.reviewerId === reviewerId)

  const totalAssigned = assignments.length
  const totalReviewed = reviews.filter((review) => review.decision !== "pending").length
  const shortlisted = reviews.filter((review) => review.decision === "shortlisted").length
  const notShortlisted = reviews.filter((review) => review.decision === "not_shortlisted").length

  return {
    totalAssigned,
    totalReviewed,
    shortlisted,
    notShortlisted,
    pending: totalAssigned - totalReviewed,
  }
}

export const getDecisionColor = (decision: ApplicationReview["decision"]) => {
  switch (decision) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "shortlisted":
      return "bg-green-100 text-green-800 border-green-200"
    case "not_shortlisted":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getDecisionLabel = (decision: ApplicationReview["decision"]) => {
  switch (decision) {
    case "pending":
      return "Pending Review"
    case "shortlisted":
      return "Shortlisted"
    case "not_shortlisted":
      return "Not Shortlisted"
    default:
      return "Unknown"
  }
}
