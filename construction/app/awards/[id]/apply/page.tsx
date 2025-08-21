"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  FileText,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useAward } from "@/hooks/use-award";
import { useAwardRequirements } from "@/hooks/use-award-requirements";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  getApplicationByAwardAndStudent,
  createApplication,
  updateApplication,
  type Application,
} from "@/lib/applications";
import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";

interface ApplyPageProps {
  params: Promise<{ id: string }>;
}

function ApplyPageContent({ params }: ApplyPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const { user } = useAuth();

  const [existingApplication, setExistingApplication] =
    useState<Application | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [essayResponses, setEssayResponses] = useState<Record<string, string>>(
    {}
  );
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Get the award ID from params
  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
    });
  }, [params]);

  // Fetch award and requirements data
  const {
    award,
    loading: awardLoading,
    error: awardError,
  } = useAward(id || "");
  const {
    requirements,
    loading: requirementsLoading,
    error: requirementsError,
  } = useAwardRequirements(id || "");

  // Initialize form data when award and requirements are loaded
  useEffect(() => {
    if (id && user) {
      const existingApp = getApplicationByAwardAndStudent(id, user.id);
      setExistingApplication(existingApp || null);
      if (existingApp) {
        setFormData(existingApp.formData || {});
        setDocuments(existingApp.documents || {});

        // Handle essay responses if they exist
        if (existingApp.essayResponses) {
          setEssayResponses(existingApp.essayResponses);
          // Calculate word counts for essays
          const counts: Record<string, number> = {};
          Object.keys(existingApp.essayResponses).forEach((key) => {
            counts[key] = countWords(existingApp.essayResponses![key] || "");
          });
          setWordCounts(counts);
        }
      }
    }
  }, [id, user]);

  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  // Show loading state
  if (awardLoading || requirementsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading application form...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (awardError || requirementsError || !award) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error loading application
            </h3>
            <p className="text-muted-foreground mb-4">
              {awardError || requirementsError || "Award not found"}
            </p>
            <Button variant="outline" asChild>
              <Link href={`/awards/${id}`}>Back to Award Details</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (fieldName: string, value: string) => {
    const requirement = requirements?.find(
      (req) => req.field_name === fieldName
    );

    if (requirement?.field_config?.type === "essay") {
      // Handle essay responses separately
      const essayKey = `essay_response_${requirement.id}`;
      setEssayResponses((prev) => ({
        ...prev,
        [essayKey]: value,
      }));

      // Update word count
      setWordCounts((prev) => ({
        ...prev,
        [essayKey]: countWords(value),
      }));
    } else {
      // Handle regular form fields
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleDocumentChange = (fieldName: string, url: string) => {
    setDocuments((prev) => ({ ...prev, [fieldName]: url }));
  };

  const calculateProgress = () => {
    if (!requirements || requirements.length === 0) return 100;

    const requiredFields = requirements.filter((req) => req.required);
    const filledFields = requiredFields.filter((req) => {
      if (req.type === "file") {
        return documents[req.field_name];
      } else if (req.field_config?.type === "essay") {
        const essayKey = `essay_response_${req.id}`;
        return (
          essayResponses[essayKey] && essayResponses[essayKey].trim() !== ""
        );
      } else {
        return (
          formData[req.field_name] && formData[req.field_name].trim() !== ""
        );
      }
    });

    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const isFormValid = () => {
    if (!requirements || requirements.length === 0) return true;

    const requiredFields = requirements.filter((req) => req.required);
    return requiredFields.every((req) => {
      if (req.type === "file") {
        return documents[req.field_name];
      } else if (req.field_config?.type === "essay") {
        const essayKey = `essay_response_${req.id}`;
        const response = essayResponses[essayKey];
        if (!response || response.trim() === "") return false;

        // Check word limit if specified
        if (req.field_config.word_limit) {
          const wordCount = wordCounts[essayKey] || 0;
          return wordCount <= req.field_config.word_limit;
        }
        return true;
      } else {
        return (
          formData[req.field_name] && formData[req.field_name].trim() !== ""
        );
      }
    });
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const applicationData = {
        formData,
        documents,
        essayResponses,
        status: "draft" as const,
      };

      if (existingApplication) {
        updateApplication(existingApplication.id, applicationData);
      } else {
        const newApp = createApplication(id!, user!.id, formData, documents);
        updateApplication(newApp.id, { essayResponses });
      }

      toast("Draft saved successfully!");
    } catch (error) {
      toast("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      const missingFields = requirements?.filter((req) => {
        if (!req.required) return false;

        if (req.type === "file") {
          return !documents[req.field_name];
        } else if (req.field_config?.type === "essay") {
          const essayKey = `essay_response_${req.id}`;
          const response = essayResponses[essayKey];
          if (!response || response.trim() === "") return true;

          if (req.field_config.word_limit) {
            const wordCount = wordCounts[essayKey] || 0;
            return wordCount > req.field_config.word_limit;
          }
          return false;
        } else {
          return (
            !formData[req.field_name] || formData[req.field_name].trim() === ""
          );
        }
      });

      if (missingFields && missingFields.length > 0) {
        toast(
          `Please complete all required fields: ${missingFields
            .map((f) => f.label)
            .join(", ")}`
        );
      } else {
        toast(
          "Please fill in all required fields and upload all required documents."
        );
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        formData,
        documents,
        essayResponses,
        status: "submitted" as const,
        submittedAt: new Date().toISOString(),
      };

      if (existingApplication) {
        updateApplication(existingApplication.id, applicationData);
      } else {
        const newApp = createApplication(id!, user!.id, formData, documents);
        updateApplication(newApp.id, {
          essayResponses,
          status: "submitted",
          submittedAt: new Date().toISOString(),
        });
      }

      toast("Your application has been successfully submitted for review.");
      router.push("/my-applications");
    } catch (error) {
      toast("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    if (!isFormValid()) {
      const missingFields = requirements?.filter((req) => {
        if (!req.required) return false;

        if (req.type === "file") {
          return !documents[req.field_name];
        } else if (req.field_config?.type === "essay") {
          const essayKey = `essay_response_${req.id}`;
          const response = essayResponses[essayKey];
          if (!response || response.trim() === "") return true;

          if (req.field_config.word_limit) {
            const wordCount = wordCounts[essayKey] || 0;
            return wordCount > req.field_config.word_limit;
          }
          return false;
        } else {
          return (
            !formData[req.field_name] || formData[req.field_name].trim() === ""
          );
        }
      });

      if (missingFields && missingFields.length > 0) {
        toast(
          `Please complete all required fields: ${missingFields
            .map((f) => f.label)
            .join(", ")}`
        );
      } else {
        toast(
          "Please fill in all required fields and upload all required documents."
        );
      }
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    await handleSubmit();
  };

  const progress = calculateProgress();

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
              <CardTitle className="text-2xl">
                Apply for {award.title}
              </CardTitle>
              <CardDescription>
                Complete all required fields and upload necessary documents to
                submit your application.
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
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 border-gray-200"
                  >
                    Draft
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Dynamic Form Fields */}
          {requirements && requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Application Information</CardTitle>
                <CardDescription>
                  Please provide all the required information for this award
                  application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {requirements.map((requirement) => {
                  const isEssay = requirement.field_config?.type === "essay";
                  const essayKey = `essay_response_${requirement.id}`;
                  const value = isEssay
                    ? essayResponses[essayKey] || ""
                    : formData[requirement.field_name] || "";
                  const wordCount = isEssay ? wordCounts[essayKey] || 0 : 0;
                  const wordLimit = requirement.field_config?.word_limit;
                  const isOverLimit = wordLimit && wordCount > wordLimit;

                  return (
                    <div key={requirement.id} className="space-y-2">
                      <Label
                        htmlFor={requirement.field_name}
                        className="flex items-center gap-2"
                      >
                        {requirement.type === "file" ? (
                          <Upload className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        {requirement.label}
                        {requirement.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>

                      {requirement.description && (
                        <p className="text-sm text-muted-foreground">
                          {requirement.description}
                        </p>
                      )}

                      {requirement.field_config?.question && (
                        <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                          <p className="text-sm font-medium text-foreground">
                            {requirement.field_config.question}
                          </p>
                        </div>
                      )}

                      {requirement.type === "file" ? (
                        <FileUpload
                          label={requirement.label}
                          onUpload={(url) =>
                            handleDocumentChange(requirement.field_name, url)
                          }
                          currentFile={documents[requirement.field_name]}
                          accept=".pdf,.doc,.docx"
                          required={requirement.required}
                          bucketName="applications" // Add this line
                        />
                      ) : requirement.type === "textarea" || isEssay ? (
                        <div className="space-y-2">
                          <Textarea
                            id={requirement.field_name}
                            placeholder={
                              requirement.field_config?.placeholder ||
                              requirement.question ||
                              `Enter your ${requirement.label.toLowerCase()}...`
                            }
                            value={value}
                            onChange={(e) =>
                              handleInputChange(
                                requirement.field_name,
                                e.target.value
                              )
                            }
                            rows={isEssay ? 8 : 4}
                            className={isOverLimit ? "border-red-500" : ""}
                          />

                          {isEssay && (
                            <div className="flex justify-between items-center text-sm">
                              <span
                                className={`${
                                  isOverLimit
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
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
                      ) : (
                        <Input
                          id={requirement.field_name}
                          type="text"
                          placeholder={
                            requirement.field_config?.placeholder ||
                            requirement.question ||
                            `Enter your ${requirement.label.toLowerCase()}...`
                          }
                          value={value}
                          onChange={(e) =>
                            handleInputChange(
                              requirement.field_name,
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* No Requirements Message */}
          {(!requirements || requirements.length === 0) && (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Specific Requirements
                </h3>
                <p className="text-muted-foreground">
                  This award doesn't have specific application requirements. You
                  can proceed with the submission.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="flex-1 bg-transparent"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  onClick={handleSubmitClick}
                  disabled={!isFormValid() || isSubmitting}
                  className="flex-1"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
              {!isFormValid() && (
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Please complete all required fields and upload all documents
                  before submitting.
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
                <div className="font-semibold text-primary text-lg">
                  {award.value}
                </div>
                <div className="text-sm text-muted-foreground">Award Value</div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">
                  {new Date(award.deadline).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Application Deadline
                </div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">{award.category}</div>
                <div className="text-sm text-muted-foreground">Category</div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {requirements?.map((requirement) => {
                const isEssay = requirement.field_config?.type === "essay";
                const essayKey = `essay_response_${requirement.id}`;
                const isCompleted =
                  requirement.type === "file"
                    ? documents[requirement.field_name]
                    : isEssay
                    ? essayResponses[essayKey] &&
                      essayResponses[essayKey].trim() !== ""
                    : formData[requirement.field_name] &&
                      formData[requirement.field_name].trim() !== "";

                return (
                  <div key={requirement.id} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isCompleted && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isCompleted ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {requirement.label}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Confirm Application Submission
            </DialogTitle>
            <DialogDescription className="text-base">
              Are you sure you want to submit your application?
              <br />
              <br />
              <strong className="text-orange-600">
                ⚠️ Important: Once submitted, you will not be able to make any
                changes to your application.
              </strong>
              <br />
              <br />
              Please review all your information carefully before confirming.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ApplyPage(props: ApplyPageProps) {
  return (
    <ProtectedRoute>
      <ApplyPageContent {...props} />
    </ProtectedRoute>
  );
}
