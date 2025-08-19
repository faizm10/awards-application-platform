'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

interface ApplicationResponsesCardProps {
  application: any
  requiredFields: any[]
}

const ApplicationResponsesCard: React.FC<ApplicationResponsesCardProps> = ({
  application,
  requiredFields
}) => {
  const getResponseForField = (field: any) => {
    let response = '';
    
    if (field.field_config?.type === 'essay' && application.essay_responses) {
      try {
        const essays = typeof application.essay_responses === 'string' 
          ? JSON.parse(application.essay_responses) 
          : application.essay_responses;
        
        response = essays[field.field_name] || essays[field.id] || '';
        
        if (!response) {
          const essayKey = Object.keys(essays).find(k => k.endsWith(field.id));
          if (essayKey) response = essays[essayKey];
        }
      } catch {
        response = '';
      }
    } else {
      response = application[field.field_name] || '';
    }
    
    return response;
  }

  const filteredFields = requiredFields.filter(
    field => field.field_name !== 'resume_url' && 
    field.field_name !== 'resume' && 
    field.field_name !== 'cv_url'
  )

  if (filteredFields.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Application Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No required fields found for this award.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Application Responses
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {filteredFields.map((field, index) => {
            const response = getResponseForField(field)
            const isFileField = field.type === 'file'
            
            return (
              <div key={field.id} className="border border-border/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-3 h-3 text-primary" />
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                    {field.label}
                  </p>
                </div>
                
                {field.field_config?.question && (
                  <div className="mb-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded border-l-2 border-l-primary/30">
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      "{field.field_config.question}"
                    </p>
                    {field.field_config.word_limit && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        Word limit: {field.field_config.word_limit}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded border-l-2 border-l-primary/20">
                  {isFileField ? (
                    <span className="text-xs text-muted-foreground">
                      See below for uploaded file.
                    </span>
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {response ? response : 'No response provided'}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default ApplicationResponsesCard

