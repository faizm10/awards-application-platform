"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { createClient } from "@/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ApplicationRequirement {
  id: string
  field_name: string
  label: string
  type: "text" | "textarea" | "file" | "select" | "number" | "date"
  required: boolean
  description?: string
  question?: string
  placeholder?: string
  field_config?: {
    options?: string[]
    word_limit?: number
    file_type?: string
    validation?: {
      min?: number
      max?: number
      pattern?: string
    }
  }
}

interface AwardFormData {
  title: string
  code: string
  donor: string
  value: string
  deadline: string
  citizenship: string[]
  description: string
  eligibility: string
  category: string
  is_active: boolean
  requirements: ApplicationRequirement[]
}

export default function CreateAwardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFieldTypeModal, setShowFieldTypeModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState<AwardFormData>({
    title: "",
    code: "",
    donor: "",
    value: "",
    deadline: "",
    citizenship: [],
    description: "",
    eligibility: "",
    category: "",
    is_active: true,
    requirements: [],
  })

  const [citizenshipText, setCitizenshipText] = useState("")

  // Simple admin check
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('administrator')
  
  // Set loading to false once user data is available
  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false)
    }
  }, [user])

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading create award page...</span>
          </div>
        </div>
      </div>
    )
  }
  
  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Access denied. This page is only available to administrators.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleInputChange = (field: keyof AwardFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addRequirement = (fieldType?: string) => {
    let defaultConfig: any = {}
    let defaultLabel = ""
    let defaultQuestion = ""
    let defaultPlaceholder = ""

    switch (fieldType) {
      case "certificate":
        defaultConfig = { type: "file", file_type: "certificate" }
        defaultLabel = "Certificate Upload"
        defaultQuestion = "Please upload your certificate or certification document:"
        defaultPlaceholder = ""
        break
      case "international_intent":
        defaultConfig = { type: "file", file_type: "international_intent" }
        defaultLabel = "International Intent Document"
        defaultQuestion = "Please upload your international intent or study abroad document:"
        defaultPlaceholder = ""
        break
      case "travel_benefit":
        defaultConfig = { type: "textarea" }
        defaultLabel = "Travel Benefit Description"
        defaultQuestion = "Please describe the travel benefits and impact of this opportunity:"
        defaultPlaceholder = "Describe how this travel opportunity will benefit you and your academic/career goals..."
        break
      case "budget":
        defaultConfig = { type: "textarea" }
        defaultLabel = "Budget Breakdown"
        defaultQuestion = "Please provide a detailed budget breakdown for your proposed activities:"
        defaultPlaceholder = "Break down your expected costs including travel, accommodation, materials, etc..."
        break
      case "community_letter":
        defaultConfig = { type: "file", file_type: "community_letter" }
        defaultLabel = "Community Letter"
        defaultQuestion = "Please upload your community service or recommendation letter:"
        defaultPlaceholder = ""
        break
      default:
        defaultConfig = { type: "text" }
        defaultLabel = "Text Response"
        defaultQuestion = "Please provide your response:"
        defaultPlaceholder = "Enter your response here..."
    }

    const generateFieldName = (label: string, fieldType?: string) => {
      // Special handling for specific field types to match database schema
      switch (fieldType) {
        case "resume":
          return "resume_url"
        case "certificate":
          return "certificate_url"
        case "international_intent":
          return "international_intent_url"
        case "travel_benefit":
          return "travel_benefit"
        case "budget":
          return "budget"
        case "community_letter":
          return "community_letter_url"
        default:
          return label
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .trim()
      }
    }

    const newRequirement: ApplicationRequirement = {
      id: `req_${Date.now()}`,
      field_name: generateFieldName(defaultLabel, fieldType) || `field_${Date.now()}`,
      label: defaultLabel,
      type: fieldType as any || "text",
      required: false,
      description: "",
      question: defaultQuestion,
      placeholder: defaultPlaceholder,
      field_config: defaultConfig,
    }
    
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, newRequirement],
    }))
    
    setShowFieldTypeModal(false)
  }

  const updateRequirement = (index: number, field: keyof ApplicationRequirement, value: any) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => {
        if (i === index) {
          const updatedReq = { ...req, [field]: value }
          
          // Auto-generate field_name from label if label is being updated
          if (field === 'label' && value) {
            // Special handling for specific field types - don't change the field_name
            if (updatedReq.field_config?.file_type === "resume") {
              updatedReq.field_name = "resume_url"
            } else if (updatedReq.field_config?.file_type === "certificate") {
              updatedReq.field_name = "certificate_url"
            } else if (updatedReq.field_config?.file_type === "international_intent") {
              updatedReq.field_name = "international_intent_url"
            } else if (updatedReq.field_config?.file_type === "community_letter") {
              updatedReq.field_name = "community_letter_url"
            } else if (updatedReq.label === "Travel Benefit Description") {
              updatedReq.field_name = "travel_benefit"
            } else if (updatedReq.label === "Budget Breakdown") {
              updatedReq.field_name = "budget"
            } else {
              const fieldName = value
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '') // Remove special characters
                .replace(/\s+/g, '_') // Replace spaces with underscores
                .trim()
              updatedReq.field_name = fieldName || `field_${Date.now()}`
            }
          }
          
          return updatedReq
        }
        return req
      }),
    }))
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.value || !formData.deadline || !formData.code || !formData.donor) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      // Create the award first
      const awardData = {
        title: formData.title,
        code: formData.code,
        donor: formData.donor,
        value: formData.value,
        deadline: formData.deadline,
        citizenship: citizenshipText.split('\n').filter(line => line.trim()),
        description: formData.description,
        eligibility: formData.eligibility,
        category: formData.category,
        is_active: formData.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data: award, error: awardError } = await supabase
        .from('awards')
        .insert(awardData)
        .select()
        .single()

      if (awardError) {
        throw awardError
      }

      // Create the requirements if any exist
      if (formData.requirements.length > 0) {
        const requirementsData = formData.requirements.map(req => ({
          award_id: award.id,
          field_name: req.field_name,
          label: req.label,
          type: req.type,
          required: req.required,
          description: req.description || null,
          question: req.question || null,
          field_config: req.field_config || null,
          created_at: new Date().toISOString(),
        }))

        const { error: requirementsError } = await supabase
          .from('award_required_fields')
          .insert(requirementsData)

        if (requirementsError) {
          throw requirementsError
        }
      }

      toast.success("Award created successfully")
      router.push("/admin-dashboard")
    } catch (error) {
      console.error('Error creating award:', error)
      toast.error("Failed to create award")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin-dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create New Award</h1>
            <p className="text-muted-foreground">Set up a new award with application requirements</p>
          </div>
          <Button onClick={handleSave} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Award"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core award details and identification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Award Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter award title"
              />
            </div>

            <div>
              <Label htmlFor="code">Award Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="Enter award code"
              />
            </div>

            <div>
              <Label htmlFor="donor">Donor/Sponsor *</Label>
              <Input
                id="donor"
                value={formData.donor}
                onChange={(e) => handleInputChange("donor", e.target.value)}
                placeholder="Enter donor or sponsor name"
              />
            </div>

            <div>
              <Label htmlFor="value">Award Value *</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                placeholder="e.g., 1 award of $5,000"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="bursary">Bursary</SelectItem>
                  <SelectItem value="grant">Grant</SelectItem>
                  <SelectItem value="prize">Prize</SelectItem>
                  <SelectItem value="award">Award</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dates and Status */}
        <Card>
          <CardHeader>
            <CardTitle>Dates and Status</CardTitle>
            <CardDescription>Application deadlines and award status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deadline">Application Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
              <Label htmlFor="is_active">Active Award</Label>
            </div>
          </CardContent>
        </Card>

        {/* Description and Eligibility */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Description and Eligibility</CardTitle>
            <CardDescription>Detailed award description and eligibility criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Award Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter detailed award description"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="eligibility">Eligibility Criteria</Label>
              <Textarea
                id="eligibility"
                value={formData.eligibility}
                onChange={(e) => handleInputChange("eligibility", e.target.value)}
                placeholder="Enter eligibility requirements"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="citizenship">Citizenship Requirements</Label>
              <Textarea
                id="citizenship"
                value={citizenshipText}
                onChange={(e) => setCitizenshipText(e.target.value)}
                placeholder="Enter citizenship requirements (one per line)"
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter each citizenship requirement on a separate line
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application Requirements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Application Requirements</CardTitle>
            <CardDescription>Define the fields and documents required for this award application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Standard fields (First Name, Last Name, Student ID, Email, Major/Program) are automatically included.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFieldTypeModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </div>

            {formData.requirements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No additional fields added yet.</p>
                <p className="text-sm">Click "Add Field" to create custom application requirements.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.requirements.map((requirement, index) => (
                  <div key={requirement.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Field {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Field Label *</Label>
                        <Input
                          value={requirement.label}
                          onChange={(e) => updateRequirement(index, "label", e.target.value)}
                          placeholder="e.g., GPA, Personal Statement, Resume"
                        />
                      </div>
                      <div>
                        <Label>Field Type *</Label>
                        <Select
                          value={requirement.type}
                          onValueChange={(value) => updateRequirement(index, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Input</SelectItem>
                            <SelectItem value="textarea">Text Area</SelectItem>
                            <SelectItem value="file">File Upload</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Field Name (Auto-generated)</Label>
                        <Input
                          value={requirement.field_name}
                          readOnly
                          className="bg-muted text-muted-foreground"
                          placeholder="Auto-generated from label"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Field name is automatically generated from the label
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required_${index}`}
                          checked={requirement.required}
                          onCheckedChange={(checked) => updateRequirement(index, "required", checked)}
                        />
                        <Label htmlFor={`required_${index}`}>Required Field</Label>
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Input
                        value={requirement.description || ""}
                        onChange={(e) => updateRequirement(index, "description", e.target.value)}
                        placeholder="Brief description of what this field is for"
                      />
                    </div>

                    <div>
                      <Label>Question/Prompt</Label>
                      <Input
                        value={requirement.question || ""}
                        onChange={(e) => updateRequirement(index, "question", e.target.value)}
                        placeholder="Question or prompt to show to applicants"
                      />
                    </div>

                    <div>
                      <Label>Placeholder Text</Label>
                      <Input
                        value={requirement.placeholder || ""}
                        onChange={(e) => updateRequirement(index, "placeholder", e.target.value)}
                        placeholder="Placeholder text for the input field"
                      />
                    </div>

                    {requirement.type === "select" && (
                      <div>
                        <Label>Options (one per line)</Label>
                        <Textarea
                          value={requirement.field_config?.options?.join('\n') || ""}
                          onChange={(e) => updateRequirement(index, "field_config", {
                            ...requirement.field_config,
                            options: e.target.value.split('\n').filter(option => option.trim())
                          })}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          rows={3}
                        />
                      </div>
                    )}

                    {(requirement.type === "textarea" || requirement.type === "text") && (
                      <div>
                        <Label>Word Limit (optional)</Label>
                        <Input
                          type="number"
                          value={requirement.field_config?.word_limit || ""}
                          onChange={(e) => updateRequirement(index, "field_config", {
                            ...requirement.field_config,
                            word_limit: e.target.value ? parseInt(e.target.value) : undefined
                          })}
                          placeholder="e.g., 500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Field Type Selection Modal */}
      <Dialog open={showFieldTypeModal} onOpenChange={setShowFieldTypeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Application Field</DialogTitle>
            <DialogDescription>
              Choose the type of field you want to add to the application form.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => addRequirement("certificate")}
            >
              <div className="text-left">
                <div className="font-medium">Certificate Upload</div>
                <div className="text-sm text-muted-foreground">
                  Upload certificate or certification document
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => addRequirement("international_intent")}
            >
              <div className="text-left">
                <div className="font-medium">International Intent Document</div>
                <div className="text-sm text-muted-foreground">
                  Upload international intent or study abroad document
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => addRequirement("travel_benefit")}
            >
              <div className="text-left">
                <div className="font-medium">Travel Benefit Description</div>
                <div className="text-sm text-muted-foreground">
                  Detailed description of travel benefits and impact
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => addRequirement("budget")}
            >
              <div className="text-left">
                <div className="font-medium">Budget Breakdown</div>
                <div className="text-sm text-muted-foreground">
                  Detailed budget breakdown and cost analysis
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => addRequirement("community_letter")}
            >
              <div className="text-left">
                <div className="font-medium">Community Letter</div>
                <div className="text-sm text-muted-foreground">
                  Upload community service or recommendation letter
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 