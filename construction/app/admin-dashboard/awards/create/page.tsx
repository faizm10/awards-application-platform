"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { FormFieldBuilder } from "@/components/form-field-builder"
import { createAward, defaultFormFields, type AwardTemplate, type AwardFormField } from "@/lib/admin"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function CreateAwardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const user = getCurrentUser()

  const [formData, setFormData] = useState<Partial<AwardTemplate>>({
    title: "",
    description: "",
    fullDescription: "",
    value: "",
    deadline: "",
    eligibility: [],
    faculty: "",
    awardType: "scholarship",
    requirements: {
      documents: ["Resume", "Transcript"],
    },
    customFields: [...defaultFormFields],
    status: "draft",
  })

  const [eligibilityText, setEligibilityText] = useState("")
  const [documentsText, setDocumentsText] = useState("Resume\nTranscript")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof AwardTemplate, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRequirementsChange = (field: keyof AwardTemplate["requirements"], value: any) => {
    setFormData((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, [field]: value },
    }))
  }

  const handleCustomFieldsChange = (fields: AwardFormField[]) => {
    setFormData((prev) => ({ ...prev, customFields: fields }))
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!formData.title || !formData.description || !formData.value || !formData.deadline || !formData.faculty) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields before saving.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const awardData = {
        ...formData,
        eligibility: eligibilityText.split("\n").filter((line) => line.trim()),
        requirements: {
          ...formData.requirements,
          documents: documentsText.split("\n").filter((line) => line.trim()),
        },
        status,
        createdBy: user?.id || "",
      } as Omit<AwardTemplate, "id" | "createdAt" | "updatedAt">

      const newAward = createAward(awardData)

      toast({
        title: status === "draft" ? "Draft Saved" : "Award Published",
        description: `Award "${newAward.title}" has been ${status === "draft" ? "saved as draft" : "published"}.`,
      })

      router.push("/admin-dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save award. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || user.role !== "admin") {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin-dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">Create New Award</h1>
        <p className="text-muted-foreground">Set up a new award with custom application requirements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about the award</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Award Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Excellence in Engineering Scholarship"
                />
              </div>

              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description that appears in award listings..."
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="fullDescription">Full Description *</Label>
                <Textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                  placeholder="Detailed description that appears on the award details page..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="value">Award Value *</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    placeholder="e.g., $5,000"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="awardType">Award Type</Label>
                  <Select value={formData.awardType} onValueChange={(value) => handleInputChange("awardType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                      <SelectItem value="grant">Grant</SelectItem>
                      <SelectItem value="bursary">Bursary</SelectItem>
                      <SelectItem value="prize">Prize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="faculty">Faculty *</Label>
                <Select value={formData.faculty} onValueChange={(value) => handleInputChange("faculty", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Faculties">All Faculties</SelectItem>
                    <SelectItem value="College of Engineering and Physical Sciences">
                      College of Engineering and Physical Sciences
                    </SelectItem>
                    <SelectItem value="College of Arts">College of Arts</SelectItem>
                    <SelectItem value="College of Biological Science">College of Biological Science</SelectItem>
                    <SelectItem value="Ontario Agricultural College">Ontario Agricultural College</SelectItem>
                    <SelectItem value="College of Business and Economics">College of Business and Economics</SelectItem>
                    <SelectItem value="College of Social and Applied Human Sciences">
                      College of Social and Applied Human Sciences
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility & Requirements</CardTitle>
              <CardDescription>Define who can apply and what they need to provide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eligibility">Eligibility Requirements</Label>
                <Textarea
                  id="eligibility"
                  value={eligibilityText}
                  onChange={(e) => setEligibilityText(e.target.value)}
                  placeholder="Enter each requirement on a new line:&#10;Minimum 3.5 GPA&#10;Full-time student status&#10;Engineering program enrollment"
                  className="min-h-[120px]"
                />
                <div className="text-sm text-muted-foreground mt-1">Enter each requirement on a separate line</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minGpa">Minimum GPA</Label>
                  <Input
                    id="minGpa"
                    type="number"
                    step="0.1"
                    min="0"
                    max="4.0"
                    value={formData.requirements?.gpa || ""}
                    onChange={(e) =>
                      handleRequirementsChange("gpa", e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="3.5"
                  />
                </div>
                <div>
                  <Label htmlFor="maxApplications">Max Applications</Label>
                  <Input
                    id="maxApplications"
                    type="number"
                    min="1"
                    value={formData.maxApplications || ""}
                    onChange={(e) =>
                      handleInputChange("maxApplications", e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="documents">Required Documents</Label>
                <Textarea
                  id="documents"
                  value={documentsText}
                  onChange={(e) => setDocumentsText(e.target.value)}
                  placeholder="Enter each document on a new line:&#10;Resume&#10;Transcript&#10;Personal Statement&#10;Reference Letter"
                  className="min-h-[100px]"
                />
                <div className="text-sm text-muted-foreground mt-1">
                  Enter each required document on a separate line
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Form Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Application Form Builder</CardTitle>
              <CardDescription>Customize the application form fields for this award</CardDescription>
            </CardHeader>
            <CardContent>
              <FormFieldBuilder fields={formData.customFields || []} onChange={handleCustomFieldsChange} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSave("draft")}
                disabled={isSubmitting}
                variant="outline"
                className="w-full bg-transparent"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </Button>
              <Button onClick={() => handleSave("published")} disabled={isSubmitting} className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                {isSubmitting ? "Publishing..." : "Publish Award"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Award Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.title && (
                <div>
                  <div className="font-semibold">{formData.title}</div>
                  <div className="text-sm text-muted-foreground">{formData.faculty}</div>
                </div>
              )}
              {formData.value && <div className="text-lg font-semibold text-primary">{formData.value}</div>}
              {formData.deadline && (
                <div className="text-sm text-muted-foreground">
                  Deadline: {new Date(formData.deadline).toLocaleDateString()}
                </div>
              )}
              {formData.description && <div className="text-sm">{formData.description}</div>}
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Creating an award for the first time? Check out our guide for best practices.
              </p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Award Creation Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
