'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Target, FileText, DollarSign, Calendar, Tag, Users } from 'lucide-react'

interface AwardInfoCardProps {
  award: any
}

const AwardInfoCard: React.FC<AwardInfoCardProps> = ({ award }) => {
  if (!award) return null

  return (
    <>
      {/* Award Details */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4" />
            Award Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Title</p>
            <p className="text-sm font-semibold">{award.title}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Code</p>
            <p className="text-sm font-mono">{award.code}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Value</p>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-green-600" />
              <p className="text-sm font-semibold text-green-600">
                {award.value?.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Deadline</p>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <p className="text-sm">{award.deadline}</p>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Category</p>
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              <p className="text-sm">{award.category || 'N/A'}</p>
            </div>
          </div>
          
          {award.donor && (
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Donor</p>
              <p className="text-sm">{award.donor}</p>
            </div>
          )}
          
          {award.citizenship && award.citizenship.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Citizenship</p>
              <div className="flex flex-wrap gap-1">
                {award.citizenship.map((cit: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {cit}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Eligibility Criteria */}
      {award.eligibility && (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4" />
              Eligibility Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {award.eligibility}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Award Description */}
      {award.description && (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Award Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {award.description}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default AwardInfoCard





