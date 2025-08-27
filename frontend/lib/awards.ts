export interface Award {
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
  applicationCount: number
  maxApplications?: number
  status: "open" | "closed" | "upcoming"
}

// Mock awards data
export const mockAwards: Award[] = [
  {
    id: "1",
    title: "Excellence in Engineering Scholarship",
    description: "Recognizing outstanding academic achievement in engineering programs.",
    fullDescription:
      "This prestigious scholarship recognizes students who have demonstrated exceptional academic performance in engineering disciplines. Recipients must maintain a minimum GPA of 3.7 and show leadership potential through extracurricular activities or community involvement. The scholarship supports students in their pursuit of engineering excellence and innovation.",
    value: "$5,000",
    deadline: "2024-03-15",
    eligibility: ["Minimum 3.7 GPA", "Engineering program enrollment", "Full-time student status"],
    faculty: "College of Engineering and Physical Sciences",
    awardType: "scholarship",
    requirements: {
      gpa: 3.7,
      year: ["2", "3", "4"],
      program: ["Engineering"],
      documents: ["Resume", "Transcript", "Personal Statement", "Reference Letter"],
    },
    applicationCount: 45,
    maxApplications: 100,
    status: "open",
  },
  {
    id: "2",
    title: "Community Leadership Award",
    description: "For students demonstrating exceptional community service and leadership.",
    fullDescription:
      "This award celebrates students who have made significant contributions to their communities through volunteer work, leadership roles, and service initiatives. Applicants must demonstrate a sustained commitment to community service and show how their efforts have made a positive impact.",
    value: "$2,500",
    deadline: "2024-04-01",
    eligibility: ["Minimum 100 hours community service", "Leadership experience", "Good academic standing"],
    faculty: "All Faculties",
    awardType: "prize",
    requirements: {
      gpa: 3.0,
      year: ["1", "2", "3", "4"],
      program: [],
      documents: ["Resume", "Community Service Portfolio", "Reference Letters (2)"],
    },
    applicationCount: 32,
    maxApplications: 50,
    status: "open",
  },
  {
    id: "3",
    title: "Research Innovation Grant",
    description: "Supporting undergraduate research projects with innovative potential.",
    fullDescription:
      "This grant provides funding for undergraduate students conducting innovative research projects. The grant supports research expenses, equipment, and conference attendance. Applicants must have a faculty supervisor and a well-defined research proposal.",
    value: "$3,000",
    deadline: "2024-03-30",
    eligibility: ["Faculty supervisor required", "Research proposal", "Minimum 3.5 GPA"],
    faculty: "College of Biological Science",
    awardType: "grant",
    requirements: {
      gpa: 3.5,
      year: ["3", "4"],
      program: ["Biological Sciences", "Chemistry", "Physics"],
      documents: ["Research Proposal", "Faculty Supervisor Letter", "Budget Outline", "Resume"],
    },
    applicationCount: 28,
    maxApplications: 25,
    status: "open",
  },
  {
    id: "4",
    title: "International Student Excellence Award",
    description: "Supporting international students with outstanding academic records.",
    fullDescription:
      "This award recognizes international students who have demonstrated academic excellence while adapting to a new educational environment. Recipients show not only strong academic performance but also cultural leadership and community engagement.",
    value: "$4,000",
    deadline: "2024-04-15",
    eligibility: ["International student status", "Minimum 3.6 GPA", "Cultural leadership activities"],
    faculty: "All Faculties",
    awardType: "scholarship",
    requirements: {
      gpa: 3.6,
      year: ["2", "3", "4"],
      program: [],
      documents: ["Resume", "Cultural Leadership Essay", "Transcript", "Reference Letter"],
    },
    applicationCount: 67,
    maxApplications: 75,
    status: "open",
  },
  {
    id: "5",
    title: "Sustainable Agriculture Innovation Prize",
    description: "Recognizing innovative solutions in sustainable agriculture practices.",
    fullDescription:
      "This prize awards students who have developed innovative approaches to sustainable agriculture, environmental stewardship, or food security. Projects should demonstrate practical application and potential for real-world impact.",
    value: "$3,500",
    deadline: "2024-02-28",
    eligibility: ["Agriculture or related program", "Innovation project", "Sustainability focus"],
    faculty: "Ontario Agricultural College",
    awardType: "prize",
    requirements: {
      gpa: 3.3,
      year: ["2", "3", "4"],
      program: ["Agriculture", "Environmental Sciences", "Food Science"],
      documents: ["Project Portfolio", "Innovation Statement", "Faculty Endorsement", "Resume"],
    },
    applicationCount: 89,
    maxApplications: 80,
    status: "closed",
  },
  {
    id: "6",
    title: "First-Year Academic Achievement Bursary",
    description: "Financial support for first-year students with demonstrated need and merit.",
    fullDescription:
      "This bursary provides financial assistance to first-year students who demonstrate both academic potential and financial need. The award helps students focus on their studies without the burden of financial stress.",
    value: "$1,500",
    deadline: "2024-05-01",
    eligibility: ["First-year student", "Financial need", "Minimum 3.0 GPA"],
    faculty: "All Faculties",
    awardType: "bursary",
    requirements: {
      gpa: 3.0,
      year: ["1"],
      program: [],
      documents: ["Financial Need Assessment", "High School Transcript", "Personal Statement"],
    },
    applicationCount: 0,
    maxApplications: 200,
    status: "upcoming",
  },
]

export const getAwards = (filters?: {
  search?: string
  faculty?: string
  awardType?: string
  status?: string
}): Award[] => {
  let filteredAwards = [...mockAwards]

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filteredAwards = filteredAwards.filter(
      (award) =>
        award.title.toLowerCase().includes(searchLower) ||
        award.description.toLowerCase().includes(searchLower) ||
        award.faculty.toLowerCase().includes(searchLower),
    )
  }

  if (filters?.faculty && filters.faculty !== "all") {
    filteredAwards = filteredAwards.filter((award) => award.faculty === filters.faculty)
  }

  if (filters?.awardType && filters.awardType !== "all") {
    filteredAwards = filteredAwards.filter((award) => award.awardType === filters.awardType)
  }

  if (filters?.status && filters.status !== "all") {
    filteredAwards = filteredAwards.filter((award) => award.status === filters.status)
  }

  return filteredAwards
}

export const getAwardById = (id: string): Award | undefined => {
  return mockAwards.find((award) => award.id === id)
}

export const getFaculties = (): string[] => {
  const faculties = [...new Set(mockAwards.map((award) => award.faculty))]
  return faculties.sort()
}
