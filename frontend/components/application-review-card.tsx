"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { User, GraduationCap, FileText, MessageSquare, ThumbsUp, ThumbsDown, Save } from "lucide-react"
import { PDFViewer } from "@/components/pdf-viewer"
import type { Application } from "@/lib/applications"
import type { Award } from "@/lib/awards"
import type { ApplicationReview } from "@/lib/reviews"
import { getDecisionColor, getDecisionLabel, createOrUpdateReview } from "@/lib/reviews"
import { toast } from "sonner"

interface ApplicationReviewCardProps {
  application: Application
  award: Award
  existingReview?: ApplicationReview
  reviewerId: string
  onReviewUpdate?: (review: ApplicationReview) => void
}

export function ApplicationReviewCard({
  application,
  award,
  existingReview,
  reviewerId,
  onReviewUpdate,
}: ApplicationReviewCardProps) {
  const [decision, setDecision] = useState<ApplicationReview["decision"]>(existingReview?.decision || "pending")
  const [comments, setComments] = useState(existingReview?.comments || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDecisionChange = async (newDecision: ApplicationReview["decision"]) => {
    setDecision(newDecision)

    // Auto-save the decision
    setIsSubmitting(true)
    try {
      const updatedReview = createOrUpdateReview(application.id, reviewerId, newDecision, comments)
      onReviewUpdate?.(updatedReview)

      toast.success("Decision Updated", {
        description: `Application ${getDecisionLabel(newDecision).toLowerCase()}.`,
      })
    } catch (error) {
      toast.error("Failed to update decision. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveComments = async () => {
    setIsSubmitting(true)
    try {
      const updatedReview = createOrUpdateReview(application.id, reviewerId, decision, comments)
      onReviewUpdate?.(updatedReview)

      toast.success("Comments Saved", {
        description: "Your review comments have been saved.",
      })
    } catch (error) {
      toast.error("Failed to save comments. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {`${application.first_name || ''} ${application.last_name || ''}`.trim() || 'Unknown Student'}
            </CardTitle>
            <CardDescription>{application.email || 'No email'}</CardDescription>
          </div>
          <Badge variant="outline" className={getDecisionColor(decision)}>
            {getDecisionLabel(decision)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Student Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Academic Info</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div>
                <span className="font-medium">Student ID:</span> {application.student_id_text || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Program:</span> {application.major_program || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Credits:</span> {application.credits_completed || 'N/A'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Application Details</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div>
                <span className="font-medium">Submitted:</span>{" "}
                {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : "Not submitted"}
              </div>
              <div>
                <span className="font-medium">Award Value:</span> {award.value}
              </div>
              <div>
                <span className="font-medium">Award Type:</span> <span className="capitalize">{award.awardType}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Travel Benefit */}
        {application.travel_benefit && (
          <div className="space-y-3">
            <h4 className="font-medium">Travel Benefit Description</h4>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{application.travel_benefit}</p>
            </div>
          </div>
        )}

        {/* Budget */}
        {application.budget && (
          <div className="space-y-3">
            <h4 className="font-medium">Budget Breakdown</h4>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{application.budget}</p>
            </div>
          </div>
        )}

        <Separator />

        {/* Documents */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submitted Documents
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Resume */}
            {application.resume_url && (
              <PDFViewer fileUrl={application.resume_url} fileName="resume.pdf" title="Resume" />
            )}

            {/* Certificate */}
            {application.certificate_url && (
              <PDFViewer fileUrl={application.certificate_url} fileName="certificate.pdf" title="Certificate" />
            )}

            {/* International Intent */}
            {application.international_intent_url && (
              <PDFViewer fileUrl={application.international_intent_url} fileName="international_intent.pdf" title="International Intent" />
            )}

            {/* Community Letter */}
            {application.community_letter_url && (
              <PDFViewer fileUrl={application.community_letter_url} fileName="community_letter.pdf" title="Community Letter" />
            )}
          </div>
        </div>

        <Separator />

        {/* Review Actions */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Review Decision
          </h4>

          {/* Decision Buttons */}
          <div className="flex gap-3">
            <Button
              variant={decision === "shortlisted" ? "default" : "outline"}
              onClick={() => handleDecisionChange("shortlisted")}
              disabled={isSubmitting}
              className="flex-1"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Shortlist
            </Button>
            <Button
              variant={decision === "not_shortlisted" ? "destructive" : "outline"}
              onClick={() => handleDecisionChange("not_shortlisted")}
              disabled={isSubmitting}
              className="flex-1 bg-transparent"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Not Shortlist
            </Button>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Review Comments</label>
            <Textarea
              placeholder="Add your review comments here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
            <Button variant="outline" onClick={handleSaveComments} disabled={isSubmitting} className="bg-transparent">
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Comments"}
            </Button>
          </div>
        </div>

        {/* Review History */}
        {existingReview?.reviewedAt && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Last reviewed on {new Date(existingReview.reviewedAt).toLocaleDateString()} at{" "}
              {new Date(existingReview.reviewedAt).toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
