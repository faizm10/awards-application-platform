'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface ApplicantInfoCardProps {
  application: any
}

const ApplicantInfoCard: React.FC<ApplicantInfoCardProps> = ({ application }) => {
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

  return (
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
          <p className="text-sm font-semibold">
            {application.first_name} {application.last_name}
          </p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Email</p>
          <p className="text-sm">{application.email}</p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Student ID</p>
          <p className="text-sm">{application.student_id_text || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Major/Program</p>
          <p className="text-sm">{application.major_program || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Status</p>
          <Badge className={`${getStatusColor(application.status)} text-xs font-medium w-fit`}>
            {getStatusIcon(application.status)}
            <span className="ml-1 capitalize">{application.status}</span>
          </Badge>
        </div>
        
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Submitted</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-slate-400" />
            <p className="text-sm">
              {application.submitted_at 
                ? new Date(application.submitted_at).toLocaleDateString() 
                : '-'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ApplicantInfoCard
