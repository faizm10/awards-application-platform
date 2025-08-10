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
  ChevronRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner';
import { LogoutButton } from "@/components/logout-button";
import { useRouter } from 'next/navigation';

const Reviewer = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [filteredApplications, setFilteredApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [awardInfo, setAwardInfo] = useState<any>(null)
  const [requiredFields, setRequiredFields] = useState<any[]>([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('submitted')
  const [shortlisted, setShortlisted] = useState<boolean | null>(null)
  const [comments, setComments] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list')
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchUserAndApplications = async () => {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)
      if (userData.user) {
        // Fetch both submitted and reviewed applications
        const { data, error } = await supabase
          .from('applications')
          .select('*')
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

  const handleViewApplication = async (app: any) => {
    setSelectedApp(app)
    setViewMode('details')
    setDetailsLoading(true)
    setShortlisted(null)
    setComments('')

    // Debug: Log the application object and file URLs
    // console.log('Selected Application:', app);
    // console.log('letter_url:', app.letter_url);
    // console.log('international_intent_url:', app.international_intent_url);
    // console.log('certificate_url:', app.certificate_url);

    const supabase = createClient()
    
    // Fetch award and required fields
    const { data: award } = await supabase.from('awards').select('*').eq('id', app.award_id).single()
    setAwardInfo(award)
    const { data: fields } = await supabase.from('award_required_fields').select('*').eq('award_id', app.award_id)
    setRequiredFields(fields || [])
    
    // If application is already reviewed, fetch the existing review
    if (app.status === 'reviewed') {
      const { data: review } = await supabase
        .from('reviews')
        .select('*')
        .eq('application_id', app.id)
        .single()
      
      if (review) {
        setShortlisted(review.shortlisted)
        setComments(review.comments || '')
      }
    }
    
    setDetailsLoading(false)
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedApp(null)
    setAwardInfo(null)
    setRequiredFields([])
    setShortlisted(null)
    setComments('')
  }

  const handleSubmitReview = async () => {
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
      } else {
        // Update application status to reviewed (now allowed by DB)
        const { error: statusError } = await supabase.from('applications').update({ status: 'reviewed' }).eq('id', selectedApp.id);
        if (statusError) {
          toast.error('Review submitted, but failed to update application status.');
        } else {
          toast.success('Review submitted and application marked as reviewed!');
        }
        handleBackToList();
        window.location.reload(); // Force full refresh to update dashboard
      }
    } catch (e) {
      toast.error('An error occurred while submitting review.');
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
  
  if (viewMode === 'details' && selectedApp) {
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
          {/* Header with Back Button */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBackToList}
              className="mb-4 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Button>
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
              {/* Sidebar - Compact Applicant & Award Info */}
              <div className="lg:col-span-1 space-y-4">
                {/* Compact Student Info */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Applicant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Name</p>
                      <p className="text-sm font-semibold">{selectedApp.first_name} {selectedApp.last_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Email</p>
                      <p className="text-sm">{selectedApp.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Status</p>
                      <Badge className={`${getStatusColor(selectedApp.status)} text-xs font-medium w-fit`}>
                        {getStatusIcon(selectedApp.status)}
                        <span className="ml-1 capitalize">{selectedApp.status}</span>
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Submitted</p>
                      <p className="text-sm">{selectedApp.submitted_at ? new Date(selectedApp.submitted_at).toLocaleDateString() : '-'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Compact Award Info */}
                {awardInfo && (
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Award
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Title</p>
                        <p className="text-sm font-semibold">{awardInfo.title}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Value</p>
                        <p className="text-sm">${awardInfo.value?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Deadline</p>
                        <p className="text-sm">{awardInfo.deadline}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Review Panel - Compact */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      {selectedApp.status === 'reviewed' ? 'Review Details' : 'Review'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Shortlisted</p>
                      {selectedApp.status === 'reviewed' && (
                        <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              Review Decision: {shortlisted ? 'Shortlisted' : 'Not Shortlisted'}
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
                          disabled={selectedApp.status === 'reviewed'}
                          className="flex-1"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Shortlisted
                        </Button>
                        <Button
                          variant={shortlisted === false ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShortlisted(false)}
                          disabled={selectedApp.status === 'reviewed'}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Not Shortlisted
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Comments</p>
                      {selectedApp.status === 'reviewed' && comments && (
                        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Review Notes:</p>
                          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                            {comments}
                          </p>
                        </div>
                      )}
                      <Textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Add your review comments..."
                        disabled={selectedApp.status === 'reviewed'}
                        className="min-h-24 resize-none text-sm"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {selectedApp.status === 'reviewed' ? (
                        <div className="text-center py-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Review already submitted
                          </p>
                        </div>
                      ) : (
                        <Button 
                          onClick={handleSubmitReview}
                          disabled={shortlisted === null || submittingReview}
                          size="sm"
                          className="w-full"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-6">

                {/* Application Responses (Essay Questions) */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Application Responses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {requiredFields.length === 0 ? (
                      <p className="text-slate-500 dark:text-slate-400 text-sm">No required fields found for this award.</p>
                    ) : (
                      <div className="space-y-4">
                        {requiredFields
                          .filter(field => field.field_name !== 'resume_url' && field.field_name !== 'resume' && field.field_name !== 'cv_url')
                          .map((field, index) => {
                            let response = '';
                            // If essay, check essay_responses JSON
                            if (field.field_config?.type === 'essay' && selectedApp.essay_responses) {
                              try {
                                const essays = typeof selectedApp.essay_responses === 'string' ? JSON.parse(selectedApp.essay_responses) : selectedApp.essay_responses;
                                // Try multiple possible keys
                                response = essays[field.field_name] || essays[field.id] || '';
                                // Try keys that start with 'essay_response_'
                                if (!response) {
                                  const essayKey = Object.keys(essays).find(k => k.endsWith(field.id));
                                  if (essayKey) response = essays[essayKey];
                                }
                                // Debug log
                                if (!response) {
                                  console.log('Essay debug:', { essays, fieldName: field.field_name, fieldId: field.id, keys: Object.keys(essays) });
                                }
                              } catch {
                                response = '';
                              }
                            } else {
                              response = selectedApp[field.field_name] || '';
                            }
                            const isFileField = field.type === 'file';
                            return (
                              <div key={field.id} className="border border-border/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageSquare className="w-3 h-3 text-primary" />
                                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{field.label}</p>
                                </div>
                                {field.field_config?.question && (
                                  <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-2 pl-5">
                                    "{field.field_config.question}"
                                  </p>
                                )}
                                <div className="bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded border-l-2 border-l-primary/20">
                                  {isFileField
                                    ? <span className="text-xs text-muted-foreground">See below for uploaded file.</span>
                                    : <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {response ? response : 'No response provided'}
                                      </p>
                                  }
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* All PDFs */}
                {pdfFields.length > 0 && pdfFields.map((file, idx) => (
                  <Card key={file.label} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {file.label}
                        {/* Only show download button for non-PDFs */}
                        {!file.url.endsWith('.pdf') && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(file.url, '_blank')}
                            className="ml-auto"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {file.url.endsWith('.pdf') ? (
                        <div className="h-[600px] md:h-[70vh] w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border">
                          <iframe
                            src={file.url}
                            title={file.label + ' PDF'}
                            className="w-full h-full border-0 min-h-[400px]"
                            allow="autoplay"
                          />
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          <p>This file type cannot be previewed. Please use the download button above to view it.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Submitted</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.submitted}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                            onClick={() => handleViewApplication(app)}
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
                                    handleViewApplication(app)
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
                            onClick={() => handleViewApplication(app)}
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
      </div>
    </div>
  )
}

export default Reviewer