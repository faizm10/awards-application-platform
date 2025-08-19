'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  FileText, 
  Calendar, 
  User, 
  Award, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Star,
  Target,
  Download
} from 'lucide-react'
import { toast } from 'sonner';
import { LogoutButton } from "@/components/logout-button";
import { useParams, useRouter } from 'next/navigation';
import ApplicantInfoCard from '@/components/reviewer/ApplicantInfoCard';
import AwardInfoCard from '@/components/reviewer/AwardInfoCard';
import ApplicationResponsesCard from '@/components/reviewer/ApplicationResponsesCard';
import DocumentViewer from '@/components/reviewer/DocumentViewer';

const ReviewerApplication = () => {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string
  
  const [user, setUser] = useState<any>(null)
  const [application, setApplication] = useState<any>(null)
  const [awardInfo, setAwardInfo] = useState<any>(null)
  const [requiredFields, setRequiredFields] = useState<any[]>([])
  const [review, setReview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplicationAndReview = async () => {
      if (!applicationId) return
      
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)
      
      if (userData.user) {
        // Fetch the specific application with award info
        const { data: app, error: appError } = await supabase
          .from('applications')
          .select(`
            *,
            award:awards (
              id,
              title,
              code,
              value,
              deadline,
              category,
              citizenship,
              eligibility,
              description,
              donor
            )
          `)
          .eq('id', applicationId)
          .single()
        
        if (appError) {
          toast.error('Application not found')
          router.push('/reviewer')
          return
        }
        
        setApplication(app)
        setAwardInfo(app.award)
        
        // Fetch required fields
        const { data: fields } = await supabase
          .from('award_required_fields')
          .select('*')
          .eq('award_id', app.award_id)
        setRequiredFields(fields || [])
        
        // Fetch review if application is reviewed
        if (app.status === 'reviewed') {
          const { data: reviewData } = await supabase
            .from('reviews')
            .select('*')
            .eq('application_id', app.id)
            .single()
          
          setReview(reviewData)
        }
      }
      
      setLoading(false)
    }
    
    fetchApplicationAndReview()
  }, [applicationId, router])

  const getResumeUrl = (app: any) => {
    return app.resume_url || app.resume || app.cv_url || null;
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'reviewed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return <Clock className="w-3 h-3" />
      case 'reviewed':
        return <CheckCircle2 className="w-3 h-3" />
      case 'pending':
        return <AlertCircle className="w-3 h-3" />
      case 'rejected':
        return <XCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mr-3" />
            <span className="text-slate-600 dark:text-slate-400">Loading application...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Application not found</p>
            <Button onClick={() => router.push('/reviewer')} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Gather all PDF/file fields (resume, letter, etc)
  const pdfFields = [
    { label: 'Resume', url: getResumeUrl(application) },
    { label: 'Letter', url: application.letter_url },
    { label: 'Community Letter', url: application.community_letter_url },
    { label: 'Certificate', url: application.certificate_url },
    { label: 'International Intent', url: application.international_intent_url },
  ].filter(f => f.url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/reviewer')}
            className="mb-4 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Application Review
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {application.first_name} {application.last_name} • {application.email}
              </p>
            </div>
            <div className="ml-auto">
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Compact Applicant & Award Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Applicant Info */}
            <ApplicantInfoCard application={application} />

            {/* Award Details with Eligibility */}
            <AwardInfoCard award={awardInfo} />

            {/* Review Panel - Compact */}
            {application.status === 'reviewed' && review && (
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Review Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Shortlisted</p>
                    <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Review Decision: {review.shortlisted ? 'Shortlisted' : 'Not Shortlisted'}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        This application has been reviewed
                      </p>
                    </div>
                  </div>
                  
                  {review.comments && (
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Comments</p>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Review Notes:</p>
                        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                          {review.comments}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Application Responses */}
            <ApplicationResponsesCard 
              application={application} 
              requiredFields={requiredFields} 
            />

            {/* PDF Documents */}
            <DocumentViewer documents={pdfFields} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewerApplication
