"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Calendar, User, MessageSquare, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { getApplicationById, getStatusColor, getStatusLabel, extractFormDataFromApplication, type Application } from "@/lib/applications"
import { useAwardRequirements } from "@/hooks/use-award-requirements"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>
}

function ApplicationDetailContent({ params }: ApplicationDetailPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [id, setId] = useState<string | null>(null)
  
  // Scroll to top when page loads
  useScrollToTop()

  // Get the application ID from params
  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
    })
  }, [params])

  // Fetch application data
  useEffect(() => {
    const fetchApplication = async () => {
      if (!id || !user) return

      setLoading(true)
      setError(null)

      try {
        const app = await getApplicationById(id)
        
        if (!app) {
          setError("Application not found")
          return
        }

        // Check if the user owns this application
        if (app.student_id !== user.id) {
          setError("You don't have permission to view this application")
          return
        }

        setApplication(app)
      } catch (err) {
        console.error("Error fetching application:", err)
        setError("Failed to load application. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [id, user])

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading application...</span>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !application) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Application</h3>
            <p className="text-muted-foreground mb-4">{error || "Application not found"}</p>
            <Button 
              variant="outline" 
              onClick={() => router.push("/my-applications")}
            >
              Back to My Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const award = application.award as any // Type assertion for award data
  if (!award) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Award Not Found</h3>
            <p className="text-muted-foreground mb-4">The award for this application could not be found.</p>
            <Button 
              variant="outline" 
              onClick={() => router.push("/my-applications")}
            >
              Back to My Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get requirements for dynamic field mapping
  const { requirements } = useAwardRequirements(application.award_id);

  // Extract form data for display
  const { formData, documents, essayResponses } = extractFormDataFromApplication(application, requirements)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/my-applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Applications
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-2xl mb-2">{award.title}</CardTitle>
                  <CardDescription className="text-base">{award.description}</CardDescription>
                </div>
                <Badge variant="outline" className={getStatusColor(application.status)}>
                  {getStatusLabel(application.status)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.first_name && (
                  <div>
                    <span className="font-medium">First Name:</span>
                    <span className="ml-2">{formData.first_name}</span>
                  </div>
                )}
                {formData.last_name && (
                  <div>
                    <span className="font-medium">Last Name:</span>
                    <span className="ml-2">{formData.last_name}</span>
                  </div>
                )}
                {formData.student_id_text && (
                  <div>
                    <span className="font-medium">Student ID:</span>
                    <span className="ml-2">{formData.student_id_text}</span>
                  </div>
                )}
                {formData.major_program && (
                  <div>
                    <span className="font-medium">Major/Program:</span>
                    <span className="ml-2">{formData.major_program}</span>
                  </div>
                )}
                {formData.credits_completed && (
                  <div>
                    <span className="font-medium">Credits Completed:</span>
                    <span className="ml-2">{formData.credits_completed}</span>
                  </div>
                )}
                {formData.email && (
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{formData.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Text Responses */}
          {(formData.response_text || formData.travel_description || formData.travel_benefit || formData.budget) && (
            <Card>
              <CardHeader>
                <CardTitle>Application Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.response_text && (
                  <div>
                    <h4 className="font-medium mb-2">Response</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.response_text}
                    </p>
                  </div>
                )}
                {formData.travel_description && (
                  <div>
                    <h4 className="font-medium mb-2">Travel Description</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.travel_description}
                    </p>
                  </div>
                )}
                {formData.travel_benefit && (
                  <div>
                    <h4 className="font-medium mb-2">Travel Benefit</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.travel_benefit}
                    </p>
                  </div>
                )}
                {formData.budget && (
                  <div>
                    <h4 className="font-medium mb-2">Budget Information</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.budget}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Essay Responses */}
          {essayResponses && Object.keys(essayResponses).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Essay Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(essayResponses).map(([key, response]) => (
                  <div key={key}>
                    <h4 className="font-medium mb-2">Essay Response</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {response}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Submitted Documents */}
          {Object.keys(documents).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submitted Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(documents).map(([key, url]) => {
                    if (!url) return null

                    return (
                      <div key={key} className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                          <div className="text-sm text-muted-foreground truncate">{url}</div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge variant="outline" className={`${getStatusColor(application.status)} text-lg px-4 py-2`}>
                  {getStatusLabel(application.status)}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Created</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(application.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {application.submitted_at && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Submitted</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(application.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Last Updated</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(application.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Award Information */}
          <Card>
            <CardHeader>
              <CardTitle>Award Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold text-primary text-lg">{award.value}</div>
                <div className="text-sm text-muted-foreground">Award Value</div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">{new Date(award.deadline).toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">Application Deadline</div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">{award.category}</div>
                <div className="text-sm text-muted-foreground">Category</div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {application.status === "draft" && (
                  <Button className="w-full" asChild>
                    <Link href={`/awards/${application.award_id}/apply`}>Continue Application</Link>
                  </Button>
                )}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/awards/${application.award_id}`}>View Award Details</Link>
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/awards">Browse Other Awards</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ApplicationDetailPage(props: ApplicationDetailPageProps) {
  return (
    <ProtectedRoute>
      <ApplicationDetailContent {...props} />
    </ProtectedRoute>
  )
}
