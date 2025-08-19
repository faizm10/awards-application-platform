"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, CheckCircle, XCircle, Clock, Award } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getReviewerAssignments, getReviewStats, getApplicationReview, type ApplicationReview } from "@/lib/reviews"
import { getApplicationsByStudent } from "@/lib/applications"
import { getAwardById } from "@/lib/awards"
import { ApplicationReviewCard } from "@/components/application-review-card"

export default function ReviewerDashboardPage() {
  const user = getCurrentUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAward, setSelectedAward] = useState("all")
  const [decisionFilter, setDecisionFilter] = useState("all")
  const [reviews, setReviews] = useState<ApplicationReview[]>([])

  const assignments = getReviewerAssignments(user.id)
  const stats = getReviewStats(user.id)

  const applicationsToReview = useMemo(() => {
    const allApplications = []

    for (const assignment of assignments) {
      const award = getAwardById(assignment.awardId)
      if (!award) continue

      // Get all submitted applications for this award
      const submittedApplications = getApplicationsByStudent("1").filter(
        (app) => app.awardId === assignment.awardId && app.status === "submitted",
      )

      for (const application of submittedApplications) {
        const existingReview = getApplicationReview(application.id, user.id)
        allApplications.push({
          application,
          award,
          existingReview,
        })
      }
    }

    return allApplications
  }, [assignments, user.id])

  const filteredApplications = useMemo(() => {
    return applicationsToReview.filter(({ application, award, existingReview }) => {
      const matchesSearch =
        application.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.title.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAward = selectedAward === "all" || award.id === selectedAward

      const decision = existingReview?.decision || "pending"
      const matchesDecision = decisionFilter === "all" || decision === decisionFilter

      return matchesSearch && matchesAward && matchesDecision
    })
  }, [applicationsToReview, searchTerm, selectedAward, decisionFilter])

  const handleReviewUpdate = (updatedReview: ApplicationReview) => {
    setReviews((prev) => {
      const index = prev.findIndex((r) => r.id === updatedReview.id)
      if (index >= 0) {
        const newReviews = [...prev]
        newReviews[index] = updatedReview
        return newReviews
      } else {
        return [...prev, updatedReview]
      }
    })
  }

  const assignedAwards = assignments.map((assignment) => getAwardById(assignment.awardId)).filter(Boolean)

  if (!user || user.role !== "reviewer") {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Reviewer Dashboard</h1>
        <p className="text-muted-foreground">Review and evaluate award applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssigned}</div>
            <p className="text-xs text-muted-foreground">Awards to review</p>
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
                placeholder="Search by student name or award..."
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
                {assignedAwards.map((award) => (
                  <SelectItem key={award.id} value={award.id}>
                    {award.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={decisionFilter} onValueChange={setDecisionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Decisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="not_shortlisted">Not Shortlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Applications ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending (
            {
              filteredApplications.filter(
                ({ existingReview }) => !existingReview || existingReview.decision === "pending",
              ).length
            }
            )
          </TabsTrigger>
          <TabsTrigger value="reviewed">
            Reviewed (
            {
              filteredApplications.filter(
                ({ existingReview }) => existingReview && existingReview.decision !== "pending",
              ).length
            }
            )
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredApplications.length > 0 ? (
            filteredApplications.map(({ application, award, existingReview }) => (
              <ApplicationReviewCard
                key={application.id}
                application={application}
                award={award}
                existingReview={existingReview}
                reviewerId={user.id}
                onReviewUpdate={handleReviewUpdate}
              />
            ))
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
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {filteredApplications
            .filter(({ existingReview }) => !existingReview || existingReview.decision === "pending")
            .map(({ application, award, existingReview }) => (
              <ApplicationReviewCard
                key={application.id}
                application={application}
                award={award}
                existingReview={existingReview}
                reviewerId={user.id}
                onReviewUpdate={handleReviewUpdate}
              />
            ))}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-6">
          {filteredApplications
            .filter(({ existingReview }) => existingReview && existingReview.decision !== "pending")
            .map(({ application, award, existingReview }) => (
              <ApplicationReviewCard
                key={application.id}
                application={application}
                award={award}
                existingReview={existingReview}
                reviewerId={user.id}
                onReviewUpdate={handleReviewUpdate}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
