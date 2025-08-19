'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

interface ReviewSummaryCardProps {
  summary: {
    total: number
    shortlisted: number
    notShortlisted: number
    pending: number
  }
}

const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({ summary }) => {
  if (summary.total === 0) return null

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Review Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {summary.total}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Total Reviewed
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {summary.shortlisted}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Shortlisted
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {summary.notShortlisted}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              Not Shortlisted
            </div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {summary.pending}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              Pending Review
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReviewSummaryCard
