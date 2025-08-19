"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  label: string
  accept?: string
  maxSize?: number // in MB
  required?: boolean
  value?: string
  onChange: (file: string | null) => void
  className?: string
}

export function FileUpload({
  label,
  accept = ".pdf,.doc,.docx",
  maxSize = 10,
  required = false,
  value,
  onChange,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError(null)

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    const allowedTypes = accept.split(",").map((type) => type.trim())
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      setError(`File type not allowed. Accepted types: ${accept}`)
      return
    }

    // Simulate file upload
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          onChange(file.name) // In real app, this would be the uploaded file URL
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeFile = () => {
    onChange(null)
    setUploadProgress(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      {value ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">{value}</div>
                  <div className="text-sm text-muted-foreground">File uploaded successfully</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            error && "border-destructive bg-destructive/5",
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-6 text-center">
            {isUploading ? (
              <div className="space-y-4">
                <Upload className="h-8 w-8 text-primary mx-auto animate-pulse" />
                <div>
                  <div className="font-medium">Uploading...</div>
                  <Progress value={uploadProgress} className="mt-2" />
                </div>
              </div>
            ) : error ? (
              <div className="space-y-2">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                <div className="font-medium text-destructive">{error}</div>
                <Button variant="outline" size="sm" onClick={() => setError(null)}>
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <div>
                  <div className="font-medium">Drop your file here or click to browse</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Accepted formats: {accept} (max {maxSize}MB)
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <File className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInputChange} className="hidden" />
    </div>
  )
}
