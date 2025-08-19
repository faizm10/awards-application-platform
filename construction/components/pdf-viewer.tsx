"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink } from "lucide-react"

interface PDFViewerProps {
  fileName: string
  title?: string
  className?: string
}

export function PDFViewer({ fileName, title, className }: PDFViewerProps) {
  // In a real application, this would display an actual PDF
  // For demo purposes, we'll show a placeholder with document info

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {title || "Document"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* PDF Preview Placeholder */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/20">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="font-medium mb-2">{fileName}</div>
            <div className="text-sm text-muted-foreground mb-4">PDF Document Preview</div>
            <div className="text-xs text-muted-foreground">
              In a real application, this would show an inline PDF viewer
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
