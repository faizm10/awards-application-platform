'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Eye, 
  FileText, 
  Calendar, 
  User, 
  Award, 
  Clock,
  Search,
  Filter,
  Download,
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Info,
  Target,
  DollarSign,
  Users,
  BookOpen,
  FileCheck,
  BarChart3
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner';
import { LogoutButton } from "@/components/logout-button";
import { useRouter } from 'next/navigation';
import ReviewSubmissionForm from '@/components/reviewer/ReviewSubmissionForm';
import ApplicantInfoCard from '@/components/reviewer/ApplicantInfoCard';
import AwardInfoCard from '@/components/reviewer/AwardInfoCard';
import ApplicationResponsesCard from '@/components/reviewer/ApplicationResponsesCard';
import DocumentViewer from '@/components/reviewer/DocumentViewer';
import ReviewSummaryCard from '@/components/reviewer/ReviewSummaryCard';

const Reviewer = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [filteredApplications, setFilteredApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentAppIndex, setCurrentAppIndex] = useState(0)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [awardInfo, setAwardInfo] = useState<any>(null)
  const [requiredFields, setRequiredFields] = useState<any[]>([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('submitted')

  const [viewMode, setViewMode] = useState<'list' | 'review'>('list')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSummary, setReviewSummary] = useState({
    total: 0,
    shortlisted: 0,
    notShortlisted: 0,
    pending: 0
  })

  useEffect(() => {
    const fetchUserAndApplications = async () => {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)
      if (userData.user) {
        // Fetch both submitted and reviewed applications with award info
        const { data, error } = await supabase
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
              eligibility
            )
          `)
          .in('status', ['submitted', 'reviewed'])
          .order('created_at', { ascending: false })
        if (!error && data) {
          setApplications(data)
          setFilteredApplications(data.filter(app => app.status === 'submitted'))
        }
      }
      setLoading(false)
    }
    fetchUserAndApplications()
  }, [])

  // Filter applications based on search, status, and active tab
  useEffect(() => {
    let filtered = applications.filter(app => app.status === activeTab)
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }
    
    setFilteredApplications(filtered)
  }, [searchTerm, statusFilter, activeTab, applications])

  // Fetch review summary data
  useEffect(() => {
    const fetchReviewSummary = async () => {
      const supabase = createClient()
      const { data: reviews } = await supabase
        .from('reviews')
        .select('shortlisted')
      
      if (reviews) {
        setReviewSummary({
          total: reviews.length,
          shortlisted: reviews.filter((r: any) => r.shortlisted).length,
          notShortlisted: reviews.filter((r: any) => !r.shortlisted).length,
          pending: applications.filter(app => app.status === 'submitted').length
        })
      }
    }
    
    if (applications.length > 0) {
      fetchReviewSummary()
    }
  }, [applications])

  const handleViewApplication = async (app: any, index?: number) => {
    if (index !== undefined) {
      setCurrentAppIndex(index)
    }
    setSelectedApp(app)
    setViewMode('review')
    setDetailsLoading(true)

    const supabase = createClient()
    
    // Fetch award and required fields
    const { data: award } = await supabase.from('awards').select('*').eq('id', app.award_id).single()
    setAwardInfo(award)
    const { data: fields } = await supabase.from('award_required_fields').select('*').eq('award_id', app.award_id)
    setRequiredFields(fields || [])
    
    setDetailsLoading(false)
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedApp(null)
    setAwardInfo(null)
    setRequiredFields([])
  }

  const handleNextApplication = () => {
    if (currentAppIndex < filteredApplications.length - 1) {
      const nextIndex = currentAppIndex + 1
      setCurrentAppIndex(nextIndex)
      handleViewApplication(filteredApplications[nextIndex], nextIndex)
    }
  }

  const handlePreviousApplication = () => {
    if (currentAppIndex > 0) {
      const prevIndex = currentAppIndex - 1
      setCurrentAppIndex(prevIndex)
      handleViewApplication(filteredApplications[prevIndex], prevIndex)
    }
  }

  const handleSubmitReview = async (shortlisted: boolean, comments: string) => {
    if (!selectedApp || !user) return;
    setSubmittingReview(true);
    try {
      const supabase = createClient();
      const { error: reviewError } = await supabase.from('reviews').insert({
        application_id: selectedApp.id,
        reviewer_id: user.id,
        shortlisted,
        comments,
      });
      if (reviewError) {
        toast.error('Failed to submit review.');
        throw reviewError;
      } else {
        // Update application status to reviewed
        const { error: statusError } = await supabase.from('applications').update({ status: 'reviewed' }).eq('id', selectedApp.id);
        if (statusError) {
          toast.error('Review submitted, but failed to update application status.');
          throw statusError;
        } else {
          toast.success('Review submitted successfully!');
          // Move to next application if available
          if (currentAppIndex < filteredApplications.length - 1) {
            handleNextApplication()
          } else {
            handleBackToList()
          }
        }
      }
    } catch (e) {
      toast.error('An error occurred while submitting review.');
      throw e;
    } finally {
      setSubmittingReview(false);
    }
  };

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

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    submitted: applications.filter(app => app.status === 'submitted').length,
  }
  
  if (viewMode === 'review' && selectedApp) {
    // Gather all PDF/file fields (resume, letter, etc)
    const pdfFields = [
      { label: 'Resume', url: getResumeUrl(selectedApp) },
      { label: 'Letter', url: selectedApp.letter_url },
      { label: 'Community Letter', url: selectedApp.community_letter_url },
      { label: 'Certificate', url: selectedApp.certificate_url },
      { label: 'International Intent', url: selectedApp.international_intent_url },
    ].filter(f => f.url);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header with Navigation */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToList}
                className="hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to List
              </Button>
              
              {/* Application Navigation */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousApplication}
                  disabled={currentAppIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  {currentAppIndex + 1} of {filteredApplications.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextApplication}
                  disabled={currentAppIndex === filteredApplications.length - 1}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Review Application
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedApp.first_name} {selectedApp.last_name} • {selectedApp.email}
                </p>
              </div>
            </div>
          </div>

          {detailsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mr-3" />
              <span>Loading application details...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Compact Info */}
              <div className="lg:col-span-1 space-y-4">
                {/* Applicant Info */}
                <ApplicantInfoCard application={selectedApp} />

                {/* Award Details with Eligibility */}
                <AwardInfoCard award={awardInfo} />

                {/* Review Panel */}
                <ReviewSubmissionForm
                  application={selectedApp}
                  onSubmit={handleSubmitReview}
                  isSubmitting={submittingReview}
                />
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-6">
                {/* Application Responses */}
                <ApplicationResponsesCard 
                  application={selectedApp} 
                  requiredFields={requiredFields} 
                />

                {/* PDF Documents */}
                <DocumentViewer documents={pdfFields} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Reviewer Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Welcome{user ? `, ${user.email}` : ''}! Review and rate student applications.
              </p>
            </div>
            <div className="ml-auto">
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Applications</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Review</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.submitted}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Reviewed</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.reviewed}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Shortlisted</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{reviewSummary.shortlisted}</p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table with Tabs */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Applications
              </CardTitle>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="submitted" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Submitted ({applications.filter(app => app.status === 'submitted').length})
                </TabsTrigger>
                <TabsTrigger value="reviewed" className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Reviewed ({applications.filter(app => app.status === 'reviewed').length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="submitted">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mr-3" />
                    <span className="text-slate-600 dark:text-slate-400">Loading applications...</span>
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      {searchTerm ? 'No submitted applications match your search.' : 'No submitted applications to review yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                          <TableHead className="font-semibold">Student</TableHead>
                          <TableHead className="font-semibold">Award</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Submitted</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.map((app, index) => (
                          <TableRow 
                            key={app.id} 
                            className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${
                              index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'
                            }`}
                            onClick={() => handleViewApplication(app, index)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {app.first_name} {app.last_name}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {app.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{app.award?.title || 'N/A'}</p>
                                <p className="text-slate-500">{app.award?.code || ''}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(app.status)} font-medium`}>
                                {getStatusIcon(app.status)}
                                <span className="ml-1 capitalize">{app.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '-'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewApplication(app, index)
                                  }}
                                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reviewed">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mr-3" />
                    <span className="text-slate-600 dark:text-slate-400">Loading applications...</span>
                  </div>
                ) : applications.filter(app => app.status === 'reviewed').length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      No reviewed applications yet.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                          <TableHead className="font-semibold">Student</TableHead>
                          <TableHead className="font-semibold">Award</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Reviewed</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications
                          .filter(app => app.status === 'reviewed')
                          .filter(app => 
                            searchTerm ? 
                              `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              app.email?.toLowerCase().includes(searchTerm.toLowerCase())
                            : true
                          )
                          .map((app, index) => (
                          <TableRow 
                            key={app.id} 
                            className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${
                              index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'
                            }`}
                            onClick={() => handleViewApplication(app, index)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {app.first_name} {app.last_name}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {app.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{app.award?.title || 'N/A'}</p>
                                <p className="text-slate-500">{app.award?.code || ''}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(app.status)} font-medium`}>
                                {getStatusIcon(app.status)}
                                <span className="ml-1 capitalize">{app.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '-'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/reviewer/${app.id}`)
                                  }}
                                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Review
                                </Button>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Review Summary Section */}
        <ReviewSummaryCard summary={reviewSummary} />
      </div>
    </div>
  )
}

export default Reviewer