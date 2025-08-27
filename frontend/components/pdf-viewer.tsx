"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink, Eye } from "lucide-react"
import { useState } from "react"

interface PDFViewerProps {
  fileName: string
  fileUrl: string
  title?: string
  className?: string
}

export function PDFViewer({ fileName, fileUrl, title, className }: PDFViewerProps) {
  const [isViewing, setIsViewing] = useState(false)

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase()
  }

  const getFileType = (filename: string) => {
    const ext = getFileExtension(filename)
    switch (ext) {
      case 'pdf':
        return 'pdf'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'image'
      case 'doc':
      case 'docx':
        return 'document'
      default:
        return 'unknown'
    }
  }

  const fileType = getFileType(fileName)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpen = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {title || fileName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Document Preview */}
          {isViewing && fileType === 'pdf' && (
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-96"
                title={fileName}
              />
            </div>
          )}

          {isViewing && fileType === 'image' && (
            <div className="border rounded-lg overflow-hidden">
              <img
                src={fileUrl}
                alt={fileName}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          )}

          {isViewing && fileType === 'document' && (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/20">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="font-medium mb-2">{fileName}</div>
              <div className="text-sm text-muted-foreground mb-4">Document Preview</div>
              <div className="text-xs text-muted-foreground">
                This document type requires opening in a new tab to view
              </div>
            </div>
          )}

          {!isViewing && (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/20">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="font-medium mb-2">{fileName}</div>
              <div className="text-sm text-muted-foreground mb-4">
                {fileType === 'pdf' ? 'PDF Document' : 
                 fileType === 'image' ? 'Image File' : 
                 fileType === 'document' ? 'Document File' : 'File'}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsViewing(true)}
                className="mt-2"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Document
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isViewing && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-transparent"
                onClick={() => setIsViewing(false)}
              >
                Hide Preview
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-transparent"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-transparent"
              onClick={handleOpen}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
