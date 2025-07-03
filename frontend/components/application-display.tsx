"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, CheckCircle, Clock, AlertCircle, Edit3, Download } from "lucide-react"

interface Application {
  id: string
  award_id: string
  student_id: string
  status: string
  submitted_at: string
  resume_url?: string
  letter_url?: string
  response_text?: string
  travel_description?: string
  travel_benefit?: string
  budget?: string
  international_intent_url?: string
  certificate_url?: string
  first_name?: string
  last_name?: string
  student_id_text?: string
  major_program?: string
  credits_completed?: string
  email?: string
  community_letter_url?: string
}

interface RequiredField {
  id: string
  field_name: string
  label: string
  type: "file" | "text" | "textarea"
  required: boolean
}

interface ApplicationStatusProps {
  awardId: string
  userId: string
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ awardId, userId }) => {
  const [application, setApplication] = useState<Application | null>(null)
  const [requiredFields, setRequiredFields] = useState<RequiredField[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Check if user already submitted
      const { data: existingApp, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("award_id", awardId)
        .eq("student_id", userId)
        .maybeSingle()

      if (appError && appError.code !== "PGRST116") {
        setError("Could not load application data.")
        setLoading(false)
        return
      }

      if (existingApp) {
        setApplication(existingApp)
        setLoading(false)
        return
      }

      // Fetch required fields if no application exists
      const { data: fieldsData, error: fieldsError } = await supabase
        .from("award_required_fields")
        .select("*")
        .eq("award_id", awardId)
        .order("created_at")

      if (fieldsError) {
        setError("Could not load application requirements.")
        setLoading(false)
        return
      }

      setRequiredFields(fieldsData || [])
      setLoading(false)
    }

    if (awardId && userId) {
      fetchData()
    }
  }, [awardId, userId])

  const handleFileUpload = async (fieldName: string, file: File) => {
    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }))

    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${awardId}/${fieldName}.${fileExt}`

    const { data, error } = await supabase.storage.from("applications").upload(fileName, file, { upsert: true })

    if (error) {
      console.error("Upload error:", error)
      setError(`Failed to upload ${fieldName}`)
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from("applications").getPublicUrl(fileName)

      setFormData((prev) => ({ ...prev, [fieldName]: publicUrl }))
    }

    setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    // Prevent accidental overwrite of student_id by filtering it out from formData
    const { student_id, ...safeFormData } = formData

    const supabase = createClient()
    console.log("Insert payload:", {
      award_id: awardId,
      student_id: userId,
      status: "submitted",
      submitted_at: new Date().toISOString(),
      ...safeFormData,
    })
    const { error } = await supabase.from("applications").insert({
      award_id: awardId,
      student_id: userId,
      status: "submitted",
      submitted_at: new Date().toISOString(),
      ...safeFormData,
    })

    if (error) {
      console.error("Supabase insert error:", error)
      setError("Failed to submit application. Please try again.")
      setSubmitting(false)
    } else {
      // Refresh to show submitted state
      window.location.reload()
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If application already submitted
  if (application) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Application Submitted
              </CardTitle>
              <CardDescription>
                Your application was submitted on{" "}
                {new Date(application.submitted_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </CardDescription>
            </div>
            <StatusBadge status={application.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ✅ Your application has been successfully submitted and is being reviewed.
            </p>
            <p className="text-green-700 text-sm mt-1">
              You will be notified via email about any updates to your application status.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If no required fields available
  if (!requiredFields || requiredFields.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No application form is available for this award.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show apply button or form
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Apply for This Award
        </CardTitle>
        <CardDescription>
          {showForm ? "Fill out the application form below" : "Click the button below to start your application"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
            Start Application
          </Button>
        ) : (
          <ApplicationForm
            requiredFields={requiredFields}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onFileUpload={handleFileUpload}
            submitting={submitting}
            uploadingFiles={uploadingFiles}
          />
        )}
      </CardContent>
    </Card>
  )
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return {
          icon: <Clock className="h-3 w-3" />,
          label: "Submitted",
          variant: "secondary" as const,
        }
      case "under_review":
        return {
          icon: <Clock className="h-3 w-3" />,
          label: "Under Review",
          variant: "default" as const,
        }
      case "approved":
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Approved",
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        }
      case "rejected":
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          label: "Rejected",
          variant: "destructive" as const,
        }
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          label: status,
          variant: "outline" as const,
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </Badge>
  )
}

const ApplicationForm: React.FC<{
  requiredFields: RequiredField[]
  formData: Record<string, any>
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>
  onSubmit: (e: React.FormEvent) => void
  onFileUpload: (fieldName: string, file: File) => void
  submitting: boolean
  uploadingFiles: Record<string, boolean>
}> = ({ requiredFields, formData, setFormData, onSubmit, onFileUpload, submitting, uploadingFiles }) => {
  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleFileChange = (fieldName: string, file: File | null) => {
    if (file) {
      onFileUpload(fieldName, file)
    }
  }

  const renderField = (field: RequiredField) => {
    const { field_name, label, type, required } = field

    switch (type) {
      case "text":
        return (
          <div key={field_name} className="space-y-2">
            <Label htmlFor={field_name}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field_name}
              type="text"
              value={formData[field_name] || ""}
              onChange={(e) => handleInputChange(field_name, e.target.value)}
              required={required}
              disabled={submitting}
            />
          </div>
        )

      case "textarea":
        return (
          <div key={field_name} className="space-y-2">
            <Label htmlFor={field_name}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field_name}
              value={formData[field_name] || ""}
              onChange={(e) => handleInputChange(field_name, e.target.value)}
              required={required}
              disabled={submitting}
              rows={4}
            />
          </div>
        )

      case "file":
        return (
          <div key={field_name} className="space-y-2">
            <Label htmlFor={field_name}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id={field_name}
                type="file"
                onChange={(e) => handleFileChange(field_name, e.target.files?.[0] || null)}
                required={required && !formData[field_name]}
                disabled={submitting || uploadingFiles[field_name]}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {uploadingFiles[field_name] && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  Uploading...
                </div>
              )}
              {formData[field_name] && !uploadingFiles[field_name] && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Uploaded
                </Badge>
              )}
            </div>
            {formData[field_name] && (
              <a
                href={formData[field_name]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                View uploaded file
              </a>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const isFormValid = () => {
    return requiredFields.every((field) => {
      if (!field.required) return true
      return formData[field.field_name] && formData[field.field_name].trim() !== ""
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {requiredFields.map(renderField)}

      <Button
        type="submit"
        className="w-full mt-6"
        size="lg"
        disabled={submitting || !isFormValid() || Object.values(uploadingFiles).some(Boolean)}
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  )
}

export default ApplicationStatus
