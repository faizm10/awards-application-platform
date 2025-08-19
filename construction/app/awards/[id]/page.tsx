"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Users,
  DollarSign,
  FileText,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { getAwardById } from "@/lib/awards"
import { getCurrentUser } from "@/lib/auth"

interface AwardDetailPageProps {
  params: Promise<{ id: string }>
}

export default function AwardDetailPage({ params }: AwardDetailPageProps) {
  const { id } = use(params)
  const award = getAwardById(id)
  const user = getCurrentUser()

  if (!award) {
    notFound()
  }

  const isStudent = user?.role === "student"
  const applicationProgress = award.maxApplications ? (award.applicationCount / award.maxApplications) * 100 : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "closed":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "upcoming":
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-red-100 text-red-800 border-red-200"
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scholarship":
        return "bg-primary/10 text-primary border-primary/20"
      case "grant":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "bursary":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "prize":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/awards">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Awards
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
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className={getStatusColor(award.status)}>
                    {getStatusIcon(award.status)}
                    <span className="ml-1 capitalize">{award.status}</span>
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(award.awardType)}>
                    <span className="capitalize">{award.awardType}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Full Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Award</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{award.fullDescription}</p>
            </CardContent>
          </Card>

          {/* Eligibility Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {award.eligibility.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Academic Requirements */}
          {(award.requirements.gpa || award.requirements.year?.length || award.requirements.program?.length) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {award.requirements.gpa && (
                  <div>
                    <span className="font-medium">Minimum GPA:</span>
                    <span className="ml-2 text-primary font-semibold">{award.requirements.gpa}</span>
                  </div>
                )}
                {award.requirements.year?.length && (
                  <div>
                    <span className="font-medium">Eligible Years:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {award.requirements.year.map((year) => (
                        <Badge key={year} variant="outline">
                          Year {year}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {award.requirements.program?.length && (
                  <div>
                    <span className="font-medium">Eligible Programs:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {award.requirements.program.map((program) => (
                        <Badge key={program} variant="outline">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {award.requirements.documents.map((document, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{document}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Award Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold text-lg text-primary">{award.value}</div>
                  <div className="text-sm text-muted-foreground">Award Value</div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{new Date(award.deadline).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground">Application Deadline</div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {award.applicationCount}
                    {award.maxApplications && ` / ${award.maxApplications}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {award.maxApplications ? "Applications" : "Current Applicants"}
                  </div>
                </div>
              </div>

              {award.maxApplications && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Application Progress</span>
                      <span>{Math.round(applicationProgress)}%</span>
                    </div>
                    <Progress value={applicationProgress} className="h-2" />
                  </div>
                </>
              )}

              <Separator />

              <div>
                <div className="font-medium mb-1">Faculty</div>
                <div className="text-sm text-muted-foreground">{award.faculty}</div>
              </div>
            </CardContent>
          </Card>

          {/* Application Action */}
          <Card>
            <CardContent className="pt-6">
              {award.status === "open" && isStudent ? (
                <div className="space-y-4">
                  <Button size="lg" className="w-full" asChild>
                    <Link href={`/awards/${award.id}/apply`}>
                      Apply Now
                      <FileText className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Make sure you have all required documents ready before starting your application.
                  </p>
                </div>
              ) : award.status === "closed" ? (
                <div className="text-center space-y-2">
                  <Button size="lg" className="w-full" disabled>
                    Applications Closed
                  </Button>
                  <p className="text-xs text-muted-foreground">The application deadline has passed for this award.</p>
                </div>
              ) : award.status === "upcoming" ? (
                <div className="text-center space-y-2">
                  <Button size="lg" variant="outline" className="w-full bg-transparent" disabled>
                    Applications Open Soon
                  </Button>
                  <p className="text-xs text-muted-foreground">Applications will open closer to the deadline date.</p>
                </div>
              ) : (
                <Button size="lg" variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/awards">Browse Other Awards</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Have questions about this award or the application process?
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
