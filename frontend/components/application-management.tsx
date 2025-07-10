"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, CheckCircle, Clock, AlertCircle, Save } from "lucide-react"

interface RequiredField {
  id: string
  field_name: string
  label: string
  type: string
  required: boolean
  question?: string
  field_config?: {
    question?: string
    word_limit?: number
    placeholder?: string
    type?: string
  }
}

interface ApplicationManagementProps {
  awardId: string
  userId?: string
  user: any
  award: any
  requiredFields: RequiredField[]
}

const ApplicationManagement: React.FC<ApplicationManagementProps> = ({
  awardId,
  userId,
  user,
  award,
  requiredFields,
}) => {
  const [application, setApplication] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [essayResponses, setEssayResponses] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (userId) {
      fetchApplication()
    } else {
      setLoading(false)
    }
  }, [userId, awardId])

  const fetchApplication = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("award_id", awardId)
      .eq("student_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching application:", error)
    } else if (data) {
      setApplication(data)

      // Separate essay responses from regular form data
      const regularFormData: Record<string, any> = {}
      const essayData: Record<string, string> = {}
      const counts: Record<string, number> = {}

      // Parse existing data
      Object.keys(data).forEach((key) => {
        if (key.startsWith("essay_response_")) {
          essayData[key] = data[key] || ""
          counts[key] = countWords(data[key] || "")
        } else {
          regularFormData[key] = data[key]
        }
      })

      // Handle JSON essay responses if they exist
      if (data.essay_responses && typeof data.essay_responses === "object") {
        Object.keys(data.essay_responses).forEach((key) => {
          essayData[key] = data.essay_responses[key] || ""
          counts[key] = countWords(data.essay_responses[key] || "")
        })
      }

      setFormData(regularFormData)
      setEssayResponses(essayData)
      setWordCounts(counts)
    }
    setLoading(false)
  }

  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const handleInputChange = (fieldId: string, fieldName: string, value: string) => {
    const field = requiredFields.find((f) => f.id === fieldId)

    if (field?.field_config?.type === "essay") {
      // Handle essay responses separately
      const essayKey = `essay_response_${fieldId}`
      setEssayResponses((prev) => ({
        ...prev,
        [essayKey]: value,
      }))

      // Update word count
      setWordCounts((prev) => ({
        ...prev,
        [essayKey]: countWords(value),
      }))
    } else {
      // Handle regular form fields
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }))
    }
  }

  const handleFileUpload = async (fieldName: string, file: File) => {
    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${awardId}/${fieldName}_${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("application-files").upload(fileName, file)

    if (error) {
      console.error("Error uploading file:", error)
      return null
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("application-files").getPublicUrl(fileName)

    return publicUrl
  }

  const saveAsDraft = async () => {
    if (!userId) return

    setSaving(true)
    const supabase = createClient()

    try {
      const applicationData = {
        award_id: awardId,
        student_id: userId,
        status: "draft",
        essay_responses: essayResponses, // Store as JSON
        ...formData,
      }

      if (application) {
        const { error } = await supabase.from("applications").update(applicationData).eq("id", application.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("applications").insert([applicationData]).select().single()

        if (error) throw error
        setApplication(data)
      }

      alert("Application saved as draft!")
    } catch (error) {
      console.error("Error saving application:", error)
      alert("Error saving application. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const submitApplication = async () => {
    if (!userId) return

    // Validate required fields
    const missingFields = requiredFields.filter((field) => {
      if (!field.required) return false

      if (field.field_config?.type === "essay") {
        const essayKey = `essay_response_${field.id}`
        return !essayResponses[essayKey] || essayResponses[essayKey].trim() === ""
      } else {
        return !formData[field.field_name] || formData[field.field_name].toString().trim() === ""
      }
    })

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.map((f) => f.label).join(", ")}`)
      return
    }

    // Validate word limits for essays
    const wordLimitErrors = requiredFields.filter((field) => {
      if (field.field_config?.type === "essay" && field.field_config.word_limit) {
        const essayKey = `essay_response_${field.id}`
        const wordCount = wordCounts[essayKey] || 0
        return wordCount > field.field_config.word_limit
      }
      return false
    })

    if (wordLimitErrors.length > 0) {
      alert(`Please reduce word count for: ${wordLimitErrors.map((f) => f.label).join(", ")}`)
      return
    }

    setSubmitting(true)
    const supabase = createClient()

    try {
      const applicationData = {
        award_id: awardId,
        student_id: userId,
        status: "submitted",
        submitted_at: new Date().toISOString(),
        essay_responses: essayResponses, // Store as JSON
        ...formData,
      }

      if (application) {
        const { error } = await supabase.from("applications").update(applicationData).eq("id", application.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("applications").insert([applicationData]).select().single()

        if (error) throw error
        setApplication(data)
      }

      alert("Application submitted successfully!")
      fetchApplication() // Refresh to get updated status
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Error submitting application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (field: RequiredField) => {
    const isEssay = field.field_config?.type === "essay"
    const essayKey = `essay_response_${field.id}`
    const value = isEssay ? essayResponses[essayKey] || "" : formData[field.field_name] || ""
    const wordCount = isEssay ? wordCounts[essayKey] || 0 : 0
    const wordLimit = field.field_config?.word_limit
    const isOverLimit = wordLimit && wordCount > wordLimit

    if (field.type === "file") {
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.field_name} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={field.field_name}
            type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                const url = await handleFileUpload(field.field_name, file)
                if (url) {
                  handleInputChange(field.id, field.field_name, url)
                }
              }
            }}
            disabled={application?.status === "submitted"}
          />
          {value && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              File uploaded successfully
            </p>
          )}
        </div>
      )
    }

    if (field.type === "textarea" || isEssay) {
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={`field_${field.id}`} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
            {isEssay && (
              <Badge variant="outline" className="text-xs">
                Essay {field.id.slice(-4)} {/* Show last 4 chars of ID for uniqueness */}
              </Badge>
            )}
          </Label>

          {field.field_config?.question && (
            <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
              <p className="text-sm font-medium text-foreground">{field.field_config.question}</p>
            </div>
          )}

          <Textarea
            id={`field_${field.id}`}
            value={value}
            onChange={(e) => handleInputChange(field.id, field.field_name, e.target.value)}
            placeholder={field.field_config?.placeholder || `Enter your ${field.label.toLowerCase()}...`}
            rows={isEssay ? 8 : 4}
            disabled={application?.status === "submitted"}
            className={isOverLimit ? "border-red-500" : ""}
          />

          {isEssay && (
            <div className="flex justify-between items-center text-sm">
              <span className={`${isOverLimit ? "text-red-500" : "text-muted-foreground"}`}>
                Word count: {wordCount}
                {wordLimit && ` / ${wordLimit}`}
              </span>
              {isOverLimit && (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Exceeds word limit
                </span>
              )}
            </div>
          )}
        </div>
      )
    }

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={`field_${field.id}`}>
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id={`field_${field.id}`}
          type={field.type === "email" ? "email" : "text"}
          value={value}
          onChange={(e) => handleInputChange(field.id, field.field_name, e.target.value)}
          placeholder={`Enter your ${field.label.toLowerCase()}...`}
          disabled={application?.status === "submitted"}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <section className="card-modern p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="card-modern p-6">
        <h2 className="text-xl font-bold mb-4">Apply for This Award</h2>
        <p className="text-muted-foreground mb-4">Please sign in to apply for this award.</p>
        <Button>Sign In</Button>
      </section>
    )
  }

  const isSubmitted = application?.status === "submitted"
  const isDraft = application?.status === "draft"

  return (
    <section className="card-modern p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Application
        </h2>
        {application && (
          <Badge variant={isSubmitted ? "default" : "secondary"} className="flex items-center gap-1">
            {isSubmitted ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            {isSubmitted ? "Submitted" : "Draft"}
          </Badge>
        )}
      </div>

      {isSubmitted ? (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Application Submitted</h3>
          <p className="text-muted-foreground">
            Your application was submitted on {new Date(application.submitted_at).toLocaleDateString()}. You will be
            notified of the decision via email.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requiredFields.length > 0 ? (
            <>
              <div className="space-y-4">{requiredFields.map(renderField)}</div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={saveAsDraft}
                  disabled={saving}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save as Draft"}
                </Button>

                <Button onClick={submitApplication} disabled={submitting} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Application Form Required</h3>
              <p className="text-muted-foreground">
                This award does not require an online application form. Please refer to the application method specified
                above.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default ApplicationManagement
