"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Eye,
  Star,
  StarOff,
  User,
  Mail,
  Calendar,
  DollarSign,
  Building,
  BookOpen,
  FileImage,
  ArrowLeft,
  ArrowRight,
  Save,
  RotateCcw,
  Filter,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { createClient } from "@/supabase/client"
import { PDFViewer } from "@/components/pdf-viewer"
import { toast } from "sonner"

interface Application {
  id: string
  award_id: string
  student_id: string
  status: string
  submitted_at: string
  created_at: string
  updated_at: string
  first_name?: string
  last_name?: string
  student_id_text?: string
  major_program?: string
  email?: string
  resume_url?: string
  certificate_url?: string
  international_intent_url?: string
  community_letter_url?: string
  travel_benefit?: string
  budget?: string
  essay_responses?: Record<string, string>
  award?: any
  student?: any
}

interface Award {
  id: string
  title: string
  code: string
  donor: string
  value: string
  deadline: string
  description: string
  eligibility: string
  category: string
  is_active: boolean
}

interface ReviewDecision {
  id: string
  application_id: string
  reviewer_id: string
  shortlisted: boolean
  comments: string
  created_at: string
  updated_at: string
}

export default function ReviewerDashboardPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [awards, setAwards] = useState<Award[]>([])
  const [reviews, setReviews] = useState<ReviewDecision[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAward, setSelectedAward] = useState("all")
  const [currentApplicationIndex, setCurrentApplicationIndex] = useState(0)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [currentReview, setCurrentReview] = useState<ReviewDecision | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")

  // Simple reviewer check
  const isReviewer = user?.email?.includes('reviewer') || user?.email?.includes('admin')

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      const supabase = createClient()
      
      try {
        // Fetch awards (for now, all active awards)
        const { data: awardsData } = await supabase
          .from('awards')
          .select('*')
          .eq('is_active', true)
        
        if (awardsData) {
          setAwards(awardsData)
          
          // Fetch applications for these awards
          const { data: applicationsData } = await supabase
            .from('applications')
            .select('*')
            .in('award_id', awardsData.map(a => a.id))
            .eq('status', 'submitted')
          
          if (applicationsData) {
            setApplications(applicationsData)
          }
        }

        // Fetch existing reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('reviewer_id', user.id)
        
        if (reviewsData) {
          setReviews(reviewsData)
        }
      } catch (error) {
        console.error('Error fetching reviewer data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const award = awards.find(a => a.id === app.award_id)
    if (!award) return false

    const matchesSearch = 
      `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.major_program?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAward = selectedAward === "all" || app.award_id === selectedAward

    const existingReview = reviews.find(r => r.application_id === app.id)

    return matchesSearch && matchesAward
  })

  // Get stats
  const stats = {
    total: filteredApplications.length,
    pending: filteredApplications.filter(app => {
      const review = reviews.find(r => r.application_id === app.id)
      return !review
    }).length,
    shortlisted: filteredApplications.filter(app => {
      const review = reviews.find(r => r.application_id === app.id)
      return review?.shortlisted === true
    }).length,
    notShortlisted: filteredApplications.filter(app => {
      const review = reviews.find(r => r.application_id === app.id)
      return review?.shortlisted === false
    }).length,
  }

  // Handle application navigation
  const nextApplication = () => {
    if (currentApplicationIndex < filteredApplications.length - 1) {
      setCurrentApplicationIndex(currentApplicationIndex + 1)
    }
  }

  const previousApplication = () => {
    if (currentApplicationIndex > 0) {
      setCurrentApplicationIndex(currentApplicationIndex - 1)
    }
  }

  // Handle review submission
  const submitReview = async (shortlisted: boolean) => {
    if (!user || !filteredApplications[currentApplicationIndex]) return

    const application = filteredApplications[currentApplicationIndex]
    const supabase = createClient()

    try {
      const reviewData = {
        application_id: application.id,
        reviewer_id: user.id,
        shortlisted,
        comments: reviewNotes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Check if review already exists
      const existingReview = reviews.find(r => r.application_id === application.id)
      
      if (existingReview) {
        // Update existing review
        const { data, error } = await supabase
          .from('reviews')
          .update({
            shortlisted,
            comments: reviewNotes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingReview.id)
          .select()
          .single()

        if (error) throw error

        setReviews(prev => prev.map(r => 
          r.id === existingReview.id ? { ...r, shortlisted, comments: reviewNotes } : r
        ))
      } else {
        // Create new review
        const { data, error } = await supabase
          .from('reviews')
          .insert(reviewData)
          .select()
          .single()

        if (error) throw error

        setReviews(prev => [...prev, data])
      }

      // Move to next application
      if (currentApplicationIndex < filteredApplications.length - 1) {
        setCurrentApplicationIndex(currentApplicationIndex + 1)
      }
      
      setReviewNotes("")
      
      // Show success message
      toast.success(
        shortlisted ? "Application Shortlisted!" : "Application Not Shortlisted",
        {
          description: shortlisted 
            ? "The application has been added to the shortlist." 
            : "The application has been marked as not shortlisted.",
          duration: 3000,
        }
      )
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error("Failed to submit review. Please try again.")
    }
  }

  // Get current application data
  const currentApplication = filteredApplications[currentApplicationIndex]
  const currentAward = currentApplication ? awards.find(a => a.id === currentApplication.award_id) : null
  const currentReviewData = currentApplication ? reviews.find(r => r.application_id === currentApplication.id) : null

  // Update review notes when application changes
  useEffect(() => {
    if (currentReviewData) {
      setReviewNotes(currentReviewData.comments || "")
    } else {
      setReviewNotes("")
    }
  }, [currentApplicationIndex, currentReviewData])

  if (!user || !isReviewer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Access denied. This page is only available to reviewers.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading reviewer dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reviewer Dashboard</h1>
        <p className="text-muted-foreground">Review and evaluate award applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Applications to review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.shortlisted}</div>
            <p className="text-xs text-muted-foreground">Recommended</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Shortlisted</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.notShortlisted}</div>
            <p className="text-xs text-muted-foreground">Not recommended</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
          <CardDescription>Search and filter applications to review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, award, or major..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedAward} onValueChange={setSelectedAward}>
              <SelectTrigger>
                <SelectValue placeholder="All Awards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Awards</SelectItem>
                {awards.map((award) => (
                  <SelectItem key={award.id} value={award.id}>
                    {award.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


          </div>
        </CardContent>
      </Card>

      {/* Application Review Interface */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-6">
          {/* Application Navigation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Application Review</CardTitle>
                  <CardDescription>
                    Application {currentApplicationIndex + 1} of {filteredApplications.length}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousApplication}
                    disabled={currentApplicationIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextApplication}
                    disabled={currentApplicationIndex === filteredApplications.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Current Application Details */}
          {currentApplication && currentAward && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Award Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Award Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Award Title</Label>
                    <p className="text-lg font-semibold">{currentAward.title}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Value</Label>
                      <p className="font-semibold text-primary">{currentAward.value}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <p>{currentAward.category}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground">{currentAward.description}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Eligibility</Label>
                    <p className="text-sm text-muted-foreground">{currentAward.eligibility}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Applicant Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Applicant Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="font-semibold">{currentApplication.first_name} {currentApplication.last_name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Student ID</Label>
                      <p>{currentApplication.student_id_text}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Major/Program</Label>
                      <p>{currentApplication.major_program}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{currentApplication.email}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Submitted</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(currentApplication.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Review Decision */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Review Decision
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentReviewData && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium">Current Decision</Label>
                      <Badge 
                        variant="outline" 
                        className={
                          currentReviewData.shortlisted 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {currentReviewData.shortlisted ? "Shortlisted" : "Not Shortlisted"}
                      </Badge>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="reviewNotes" className="text-sm font-medium">Review Notes</Label>
                    <Textarea
                      id="reviewNotes"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add your review notes and comments..."
                      rows={4}
                    />
                  </div>
                  

                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => submitReview(true)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Shortlist
                    </Button>
                    <Button
                      onClick={() => submitReview(false)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Not Shortlisted
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Application Content */}
          {currentApplication && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Application Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Documents */}
                <div>
                  <h4 className="font-medium mb-3">Uploaded Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentApplication.resume_url && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span className="font-medium">Resume</span>
                        </div>
                        <PDFViewer fileUrl={currentApplication.resume_url} fileName="resume.pdf" />
                      </div>
                    )}
                    
                    {currentApplication.certificate_url && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span className="font-medium">Certificate</span>
                        </div>
                        <PDFViewer fileUrl={currentApplication.certificate_url} fileName="certificate.pdf" />
                      </div>
                    )}
                    
                    
                    {currentApplication.international_intent_url && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span className="font-medium">International Intent</span>
                        </div>
                        <PDFViewer fileUrl={currentApplication.international_intent_url} fileName="international_intent.pdf" />
                      </div>
                    )}
                    
                    {currentApplication.community_letter_url && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span className="font-medium">Community Letter</span>
                        </div>
                        <PDFViewer fileUrl={currentApplication.community_letter_url} fileName="community_letter.pdf" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Responses */}
                <div>
                  <h4 className="font-medium mb-3">Text Responses</h4>
                  <div className="space-y-4">
                    {currentApplication.travel_benefit && (
                      <div>
                        <Label className="text-sm font-medium">Travel Benefit Description</Label>
                        <div className="mt-1 p-3 bg-muted rounded-lg">
                          <p className="text-sm">{currentApplication.travel_benefit}</p>
                        </div>
                      </div>
                    )}
                    
                    {currentApplication.budget && (
                      <div>
                        <Label className="text-sm font-medium">Budget Breakdown</Label>
                        <div className="mt-1 p-3 bg-muted rounded-lg">
                          <p className="text-sm">{currentApplication.budget}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Essay Responses */}
                {currentApplication.essay_responses && Object.keys(currentApplication.essay_responses).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Essay Responses</h4>
                    <div className="space-y-4">
                      {Object.entries(currentApplication.essay_responses).map(([key, response]) => (
                        <div key={key}>
                          <Label className="text-sm font-medium">Essay Response</Label>
                          <div className="mt-1 p-3 bg-muted rounded-lg">
                            <p className="text-sm">{response}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              No applications match your current filters or you have no assignments yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
