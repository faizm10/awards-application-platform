"use client"

import { use, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Save, Send, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getAwardById } from "@/lib/awards"
import { getCurrentUser } from "@/lib/auth"
import {
  getApplicationByAwardAndStudent,
  createApplication,
  updateApplication,
  type Application,
} from "@/lib/applications"
import { FileUpload } from "@/components/file-upload"
import { useToast } from "@/hooks/use-toast"

interface ApplyPageProps {
  params: Promise<{ id: string }>
}

export default function ApplyPage({ params }: ApplyPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [id, setId] = useState<string | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [award, setAward] = useState<any | null>(null)
  const [existingApplication, setExistingApplication] = useState<Application | null>(null)
  const [formData, setFormData] = useState<Application["formData"]>({
    gpa: "",
    year: "",
    program: "",
    faculty: "",
    personalStatement: "",
    additionalInfo: "",
  })
  const [documents, setDocuments] = useState<Application["documents"]>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  use(
    params.then(({ id }) => {
      setId(id)
      const awardData = getAwardById(id)
      setAward(awardData)
      const userData = getCurrentUser()
      setUser(userData)
      if (userData && userData.role === "student") {
        const existingApp = getApplicationByAwardAndStudent(id, userData.id)
        setExistingApplication(existingApp)
        if (existingApp) {
          setFormData(existingApp.formData)
          setDocuments(existingApp.documents)
        }
      } else {
        router.push("/login")
      }
    }),
  )

  if (!award) {
    notFound()
  }

  if (!user || user.role !== "student") {
    return null
  }

  const handleInputChange = (field: keyof Application["formData"], value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDocumentChange = (field: string, value: string | null) => {
    setDocuments((prev) => ({ ...prev, [field]: value }))
  }

  const calculateProgress = () => {
    const requiredFields = ["gpa", "year", "program", "faculty"]
    const filledFields = requiredFields.filter((field) => formData[field as keyof typeof formData])
    const requiredDocs = award.requirements.documents
    const uploadedDocs = requiredDocs.filter((doc) => {
      const docKey = doc.toLowerCase().replace(/\s+/g, "")
      return documents[docKey as keyof typeof documents]
    })

    const totalRequired = requiredFields.length + requiredDocs.length
    const totalCompleted = filledFields.length + uploadedDocs.length

    return Math.round((totalCompleted / totalRequired) * 100)
  }

  const isFormValid = () => {
    const requiredFieldsFilled = formData.gpa && formData.year && formData.program && formData.faculty
    const requiredDocsUploaded = award.requirements.documents.every((doc) => {
      const docKey = doc.toLowerCase().replace(/\s+/g, "")
      return documents[docKey as keyof typeof documents]
    })

    return requiredFieldsFilled && requiredDocsUploaded
  }

  const handleSaveDraft = async () => {
    try {
      if (existingApplication) {
        updateApplication(existingApplication.id, { formData, documents })
      } else {
        createApplication(id!, user.id, formData, documents)
      }

      toast({
        title: "Draft Saved",
        description: "Your application has been saved as a draft.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Incomplete Application",
        description: "Please fill in all required fields and upload all required documents.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (existingApplication) {
        updateApplication(existingApplication.id, { formData, documents, status: "submitted" })
      } else {
        const newApp = createApplication(id!, user.id, formData, documents)
        updateApplication(newApp.id, { status: "submitted" })
      }

      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted for review.",
      })

      router.push("/my-applications")
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = calculateProgress()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/awards/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Award Details
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Apply for {award.title}</CardTitle>
              <CardDescription>
                Complete all required fields and upload necessary documents to submit your application.
              </CardDescription>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Application Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                {existingApplication?.status === "draft" && (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                    Draft
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gpa">Current GPA *</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    placeholder="3.75"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange("gpa", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Current Year *</Label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                      <SelectItem value="5+">Year 5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program">Program of Study *</Label>
                  <Input
                    id="program"
                    placeholder="e.g., Computer Engineering"
                    value={formData.program}
                    onChange={(e) => handleInputChange("program", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="faculty">Faculty *</Label>
                  <Select value={formData.faculty} onValueChange={(value) => handleInputChange("faculty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="College of Engineering and Physical Sciences">
                        College of Engineering and Physical Sciences
                      </SelectItem>
                      <SelectItem value="College of Arts">College of Arts</SelectItem>
                      <SelectItem value="College of Biological Science">College of Biological Science</SelectItem>
                      <SelectItem value="Ontario Agricultural College">Ontario Agricultural College</SelectItem>
                      <SelectItem value="College of Business and Economics">
                        College of Business and Economics
                      </SelectItem>
                      <SelectItem value="College of Social and Applied Human Sciences">
                        College of Social and Applied Human Sciences
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Statement */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Statement</CardTitle>
              <CardDescription>
                Tell us about yourself, your achievements, and why you deserve this award.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your personal statement here..."
                value={formData.personalStatement}
                onChange={(e) => handleInputChange("personalStatement", e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Any additional information that supports your application.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Include any relevant experiences, achievements, or circumstances..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Upload all required documents for your application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {award.requirements.documents.map((document) => {
                const docKey = document.toLowerCase().replace(/\s+/g, "")
                return (
                  <FileUpload
                    key={document}
                    label={document}
                    required
                    value={documents[docKey as keyof typeof documents] as string}
                    onChange={(file) => handleDocumentChange(docKey, file)}
                  />
                )
              })}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={handleSaveDraft} className="flex-1 bg-transparent">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handleSubmit} disabled={!isFormValid() || isSubmitting} className="flex-1" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
              {!isFormValid() && (
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Please complete all required fields and upload all documents before submitting.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Award Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Award Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold text-primary text-lg">{award.value}</div>
                <div className="text-sm text-muted-foreground">Award Value</div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">{new Date(award.deadline).toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">Application Deadline</div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">{award.faculty}</div>
                <div className="text-sm text-muted-foreground">Faculty</div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Personal Information</div>
                <div className="space-y-1">
                  {["gpa", "year", "program", "faculty"].map((field) => (
                    <div key={field} className="flex items-center gap-2 text-sm">
                      {formData[field as keyof typeof formData] ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className="capitalize">{field === "gpa" ? "GPA" : field}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium">Required Documents</div>
                <div className="space-y-1">
                  {award.requirements.documents.map((document) => {
                    const docKey = document.toLowerCase().replace(/\s+/g, "")
                    const isUploaded = documents[docKey as keyof typeof documents]
                    return (
                      <div key={document} className="flex items-center gap-2 text-sm">
                        {isUploaded ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                        )}
                        <span>{document}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Having trouble with your application? We're here to help.</p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/application-guide">Application Guide</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
