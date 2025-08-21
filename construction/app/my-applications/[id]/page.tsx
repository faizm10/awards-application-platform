"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Calendar, User, MessageSquare } from "lucide-react"
import Link from "next/link"
import { getApplicationById, getStatusColor, getStatusLabel } from "@/lib/applications"
import { ROUTES } from "@/constants/routes"
import { getAwardById } from "@/lib/awards"
import { getCurrentUser } from "@/lib/auth"

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = use(params)
  const application = getApplicationById(id)
  const user = getCurrentUser()

  if (!application || !user || user.role !== "student" || application.studentId !== user.id) {
    notFound()
  }

  const award = getAwardById(application.awardId)
  if (!award) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={ROUTES.MY_APPLICATIONS}>
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
                <div>
                  <span className="font-medium">GPA:</span>
                  <span className="ml-2">{application.formData.gpa}</span>
                </div>
                <div>
                  <span className="font-medium">Current Year:</span>
                  <span className="ml-2">Year {application.formData.year}</span>
                </div>
                <div>
                  <span className="font-medium">Program:</span>
                  <span className="ml-2">{application.formData.program}</span>
                </div>
                <div>
                  <span className="font-medium">Faculty:</span>
                  <span className="ml-2">{application.formData.faculty}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Statement */}
          {application.formData.personalStatement && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {application.formData.personalStatement}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          {application.formData.additionalInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {application.formData.additionalInfo}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Submitted Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submitted Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(application.documents).map(([key, value]) => {
                  if (!value) return null

                  if (Array.isArray(value)) {
                    return value.map((doc, index) => (
                      <div key={`${key}-${index}`} className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">
                            {key} {index + 1}
                          </div>
                          <div className="text-sm text-muted-foreground">{doc}</div>
                        </div>
                      </div>
                    ))
                  }

                  if (typeof value === "object") {
                    return Object.entries(value).map(([docName, docFile]) => (
                      <div key={docName} className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">{docName}</div>
                          <div className="text-sm text-muted-foreground">{docFile}</div>
                        </div>
                      </div>
                    ))
                  }

                  return (
                    <div key={key} className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                        <div className="text-sm text-muted-foreground">{value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Reviewer Comments */}
          {application.reviewerComments && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviewer Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {application.reviewerComments}
                </p>
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
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {application.submittedAt && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Submitted</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                {application.reviewedAt && (
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Last Reviewed</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(application.reviewedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
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
                <div className="font-medium">{award.faculty}</div>
                <div className="text-sm text-muted-foreground">Faculty</div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {application.status === "draft" && (
                  <Button className="w-full" asChild>
                    <Link href={ROUTES.AWARD_APPLY(award.id)}>Continue Application</Link>
                  </Button>
                )}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={ROUTES.AWARD_DETAILS(award.id)}>View Award Details</Link>
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href={ROUTES.AWARDS}>Browse Other Awards</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
