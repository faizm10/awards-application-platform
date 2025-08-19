'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

interface DocumentViewerProps {
  documents: Array<{
    label: string
    url: string
  }>
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents }) => {
  if (documents.length === 0) return null

  return (
    <>
      {documents.map((doc, idx) => (
        <Card key={doc.label} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {doc.label}
              {!doc.url.endsWith('.pdf') && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(doc.url, '_blank')}
                  className="ml-auto"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doc.url.endsWith('.pdf') ? (
              <div className="h-[600px] md:h-[70vh] w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border">
                <iframe
                  src={doc.url}
                  title={doc.label + ' PDF'}
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
    </>
  )
}

export default DocumentViewer

