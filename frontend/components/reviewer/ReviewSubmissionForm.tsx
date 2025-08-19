'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  XCircle, 
  Star,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface ReviewSubmissionFormProps {
  application: any
  onSubmit: (shortlisted: boolean, comments: string) => Promise<void>
  isSubmitting: boolean
}

const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  application,
  onSubmit,
  isSubmitting
}) => {
  const [shortlisted, setShortlisted] = useState<boolean | null>(null)
  const [comments, setComments] = useState('')
  const [existingReview, setExistingReview] = useState<any>(null)
  const [loadingReview, setLoadingReview] = useState(false)

  // Fetch existing review if application is already reviewed
  useEffect(() => {
    const fetchExistingReview = async () => {
      if (application?.status === 'reviewed' && application?.id) {
        setLoadingReview(true)
        try {
          const supabase = createClient()
          const { data: review } = await supabase
            .from('reviews')
            .select('*')
            .eq('application_id', application.id)
            .single()
          
          if (review) {
            setExistingReview(review)
            setShortlisted(review.shortlisted)
            setComments(review.comments || '')
          }
        } catch (error) {
          console.error('Error fetching existing review:', error)
        } finally {
          setLoadingReview(false)
        }
      }
    }

    fetchExistingReview()
  }, [application])

  const handleSubmit = async () => {
    if (shortlisted === null) {
      toast.error('Please select whether to shortlist this application')
      return
    }

    try {
      await onSubmit(shortlisted, comments)
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const isAlreadyReviewed = application.status === 'reviewed'

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Star className="w-4 h-4" />
          {isAlreadyReviewed ? 'Review Details' : 'Review Decision'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shortlisting Decision */}
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
            Shortlisting Decision
          </p>
          
          {isAlreadyReviewed && existingReview && (
            <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                {existingReview.shortlisted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Decision: {existingReview.shortlisted ? 'Shortlisted' : 'Not Shortlisted'}
                </p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This application has already been reviewed
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant={shortlisted === true ? "default" : "outline"}
              size="sm"
              onClick={() => setShortlisted(true)}
              disabled={isAlreadyReviewed}
              className="flex-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Shortlisted
            </Button>
            <Button
              variant={shortlisted === false ? "default" : "outline"}
              size="sm"
              onClick={() => setShortlisted(false)}
              disabled={isAlreadyReviewed}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Not Shortlisted
            </Button>
          </div>
        </div>
        
        {/* Comments Section */}
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
            Review Comments
          </p>
          
          {isAlreadyReviewed && existingReview?.comments && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                Previous Review Notes:
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                {existingReview.comments}
              </p>
            </div>
          )}
          
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your review comments, feedback, or reasoning for the decision..."
            disabled={isAlreadyReviewed}
            className="min-h-24 resize-none text-sm"
          />
          
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Provide constructive feedback to help with future decisions
          </div>
        </div>
        
        {/* Submission Button */}
        <div className="flex flex-col gap-2">
          {isAlreadyReviewed ? (
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                <AlertCircle className="w-4 h-4" />
                <p className="text-xs">Review already submitted</p>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={shortlisted === null || isSubmitting}
              size="sm"
              className="w-full"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          )}
        </div>

        {/* Decision Guidelines */}
        {!isAlreadyReviewed && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-2">
              Review Guidelines:
            </p>
            <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <li>• <strong>Shortlisted:</strong> Applicant meets all criteria and shows strong potential</li>
              <li>• <strong>Not Shortlisted:</strong> Applicant doesn't meet requirements or has significant concerns</li>
              <li>• Provide specific feedback to support your decision</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ReviewSubmissionForm
