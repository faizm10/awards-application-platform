"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Award,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Plus,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/logout-button";
import AdminUsersTable from "@/components/AdminUsersTable";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [showCreateAwardModal, setShowCreateAwardModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for creating new award
  const [awardForm, setAwardForm] = useState({
    title: "",
    code: "",
    donor: "",
    value: "",
    deadline: "",
    citizenship: [] as string[],
    description: "",
    eligibility: "",
    application_method: "",
    category: "",
  });

  // Add these new state variables after the existing state declarations (around line 25)
  const [requiredFields, setRequiredFields] = useState<
    Array<{
      field_name: string;
      label: string;
      type: string;
      required: boolean;
      field_config?: any;
      unique_id?: string;
    }>
  >([]);

  const [selectedFieldOption, setSelectedFieldOption] = useState("");

  // Add this predefined fields configuration after the state declarations
  const PREDEFINED_FIELDS = [
    { field_name: "first_name", label: "Student First Name", type: "text" },
    { field_name: "last_name", label: "Student Last Name", type: "text" },
    { field_name: "student_id_text", label: "Student ID", type: "text" },
    { field_name: "major_program", label: "Major/Program", type: "text" },
    {
      field_name: "credits_completed",
      label: "Credits Completed",
      type: "text",
    },
    { field_name: "email", label: "Email Address", type: "text" },
    { field_name: "resume_url", label: "Upload Resume", type: "file" },
    { field_name: "letter_url", label: "Upload Letter", type: "file" },
    {
      field_name: "community_letter_url",
      label: "Community Letter",
      type: "file",
    },
    { field_name: "essay_question", label: "Essay Question", type: "textarea" },
    {
      field_name: "travel_description",
      label: "Travel Description",
      type: "textarea",
    },
    { field_name: "travel_benefit", label: "Travel Benefit", type: "textarea" },
    { field_name: "budget", label: "Budget Information", type: "textarea" },
    {
      field_name: "international_intent_url",
      label: "International Intent Document",
      type: "file",
    },
    {
      field_name: "certificate_url",
      label: "Upload Certificate",
      type: "file",
    },
  ];

  const [citizenshipInput, setCitizenshipInput] = useState("");
  const [showEssayQuestionModal, setShowEssayQuestionModal] = useState(false);
  const [essayQuestionForm, setEssayQuestionForm] = useState({
    question: "",
    label: "",
    wordLimit: "",
    placeholder: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          student:student_id (
            full_name,
            email
          ),
          award:award_id (
            title,
            code,
            value
          )
        `
        )
        .order("created_at", { ascending: false });

      console.log("Fetched applications:", data);
      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data || []);
      }
    };
    fetchApplications();
  }, []);
  useEffect(() => {
    const fetchAwards = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Fetched awards:", data);
      if (error) {
        console.error("Error fetching awards:", error);
      } else {
        setAwards(data || []);
      }
    };
    fetchAwards();
  }, []);

  const getStatusIcon = (status: any) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAwardForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addCitizenship = () => {
    if (
      citizenshipInput.trim() &&
      !awardForm.citizenship.includes(citizenshipInput.trim())
    ) {
      setAwardForm((prev) => ({
        ...prev,
        citizenship: [...prev.citizenship, citizenshipInput.trim()],
      }));
      setCitizenshipInput("");
    }
  };

  const removeCitizenship = (citizenship: string) => {
    setAwardForm((prev) => ({
      ...prev,
      citizenship: prev.citizenship.filter((c) => c !== citizenship),
    }));
  };

  // Add these helper functions after the removeCitizenship function
  const addPredefinedField = () => {
    if (selectedFieldOption) {
      const fieldConfig = PREDEFINED_FIELDS.find(
        (f) => f.field_name === selectedFieldOption
      );
      if (fieldConfig) {
        if (fieldConfig.field_name === "essay_question") {
          setShowEssayQuestionModal(true);
        } else if (
          !requiredFields.some((f) => f.field_name === fieldConfig.field_name)
        ) {
          setRequiredFields((prev) => [
            ...prev,
            { ...fieldConfig, required: true },
          ]);
          setSelectedFieldOption("");
        }
      }
    }
  };

  const removeRequiredField = (identifier: string) => {
    setRequiredFields((prev) =>
      prev.filter((f) => (f.unique_id || f.field_name) !== identifier)
    );
  };

  const toggleFieldRequired = (identifier: string) => {
    setRequiredFields((prev) =>
      prev.map((f) =>
        (f.unique_id || f.field_name) === identifier
          ? { ...f, required: !f.required }
          : f
      )
    );
  };

  const addEssayQuestion = () => {
    if (essayQuestionForm.question.trim() && essayQuestionForm.label.trim()) {
      const uniqueId = `essay_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Create field config JSON for essay questions
      const fieldConfig = {
        question: essayQuestionForm.question,
        word_limit: essayQuestionForm.wordLimit
          ? Number.parseInt(essayQuestionForm.wordLimit)
          : null,
        placeholder:
          essayQuestionForm.placeholder || "Enter your response here...",
        type: "essay",
      };

      const essayField = {
        field_name: "essay_response", // Use a consistent field name for all essays
        label: essayQuestionForm.label,
        type: "textarea",
        required: true,
        field_config: fieldConfig,
        unique_id: uniqueId,
      };

      setRequiredFields((prev) => [...prev, essayField]);
      setEssayQuestionForm({
        question: "",
        label: "",
        wordLimit: "",
        placeholder: "",
      });
      setShowEssayQuestionModal(false);
      setSelectedFieldOption("");
    }
  };

  // Update the handleSubmitAward function to include the required fields creation
  const handleSubmitAward = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // First, create the award
      const { data: awardData, error: awardError } = await supabase
        .from("awards")
        .insert([
          {
            title: awardForm.title,
            code: awardForm.code,
            donor: awardForm.donor,
            value: awardForm.value,
            deadline: awardForm.deadline,
            citizenship: awardForm.citizenship,
            description: awardForm.description,
            eligibility: awardForm.eligibility,
            application_method: awardForm.application_method,
            category: awardForm.category,
          },
        ])
        .select()
        .single();

      if (awardError) {
        console.error("Error creating award:", awardError);
        toast("Error creating award. Please try again.");
        return;
      }

      // Then, create the required fields if any
      if (requiredFields.length > 0) {
        const fieldsToInsert = requiredFields.map((field) => ({
          award_id: awardData.id,
          field_name: field.unique_id
            ? `essay_response_${field.unique_id}`
            : field.field_name, // Use unique field name for essays
          label: field.label,
          type: field.type,
          required: field.required,
          question: field.field_config?.question || null,
          field_config: field.field_config || null,
        }));

        const { error: fieldsError } = await supabase
          .from("award_required_fields")
          .insert(fieldsToInsert);

        if (fieldsError) {
          console.error("Error creating required fields:", fieldsError);
          toast("Award created but there was an error adding required fields.");
          return;
        }
      }

      console.log("Award and required fields created successfully");
      toast("Award created successfully!");

      // Reset all forms
      setAwardForm({
        title: "",
        code: "",
        donor: "",
        value: "",
        deadline: "",
        citizenship: [],
        description: "",
        eligibility: "",
        application_method: "",
        category: "",
      });
      setRequiredFields([]);
      setSelectedFieldOption("");
      setEssayQuestionForm({
        question: "",
        label: "",
        wordLimit: "",
        placeholder: "",
      });
      setCitizenshipInput("");
      setShowCreateAwardModal(false);
    } catch (error) {
      console.error("Error:", error);
      toast("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted)
    return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 geometric-bg"></div>
      <div
        className="floating-element animate-wave"
        style={{ top: "10%", right: "15%", animationDelay: "0s" }}
      ></div>
      <div
        className="floating-element animate-wave"
        style={{ bottom: "30%", left: "10%", animationDelay: "1.5s" }}
      ></div>
      <div
        className="floating-element animate-wave"
        style={{ top: "60%", right: "25%", animationDelay: "3s" }}
      ></div>

      {/* Create Award Modal */}
      {showCreateAwardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Create New Award</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateAwardModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitAward} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={awardForm.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Award title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={awardForm.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="Award code"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donor">Donor</Label>
                  <Input
                    id="donor"
                    value={awardForm.donor}
                    onChange={(e) => handleInputChange("donor", e.target.value)}
                    placeholder="Donor name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Value ($)</Label>
                  <Input
                    id="value"
                    type="text"
                    value={awardForm.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    placeholder="Award value"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={awardForm.deadline}
                    onChange={(e) =>
                      handleInputChange("deadline", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={awardForm.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                      <SelectItem value="grant">Grant</SelectItem>
                      <SelectItem value="bursary">Bursary</SelectItem>
                      <SelectItem value="fellowship">Fellowship</SelectItem>
                      <SelectItem value="award">Award</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenship">Citizenship Requirements</Label>
                <div className="flex gap-2">
                  <Input
                    value={citizenshipInput}
                    onChange={(e) => setCitizenshipInput(e.target.value)}
                    placeholder="Add citizenship requirement"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCitizenship();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addCitizenship}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {awardForm.citizenship.map((citizenship, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {citizenship}
                      <button
                        type="button"
                        onClick={() => removeCitizenship(citizenship)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={awardForm.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Award description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  value={awardForm.eligibility}
                  onChange={(e) =>
                    handleInputChange("eligibility", e.target.value)
                  }
                  placeholder="Eligibility requirements"
                  rows={3}
                />
              </div>

              {/* Application Form Fields Section */}
              <div className="space-y-4 border-t pt-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">
                    Application Form Fields
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Select the fields that applicants need to fill out for this
                    award.
                  </p>
                </div>

                {/* Add Field Selector */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                  <h5 className="font-medium">Add Required Field</h5>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        value={selectedFieldOption}
                        onValueChange={setSelectedFieldOption}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a field to add..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PREDEFINED_FIELDS.filter((field) => {
                            // Allow multiple essay questions but prevent duplicate non-essay fields
                            if (field.field_name === "essay_question")
                              return true;
                            return !requiredFields.some(
                              (rf) => rf.field_name === field.field_name
                            );
                          }).map((field) => (
                            <SelectItem
                              key={field.field_name}
                              value={field.field_name}
                            >
                              <div className="flex items-center gap-2">
                                <span>{field.label}</span>
                                <Badge variant="outline" className="text-xs">
                                  {field.type}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      onClick={addPredefinedField}
                      variant="outline"
                      disabled={!selectedFieldOption}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Display Added Fields */}
                {requiredFields.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-medium">
                      Required Fields ({requiredFields.length})
                    </h5>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {requiredFields.map((field) => (
                        <div
                          key={field.unique_id || field.field_name}
                          className="flex items-start gap-4 p-3 bg-background border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{field.label}</span>
                              <Badge variant="secondary" className="text-xs">
                                {field.type}
                              </Badge>
                              {field.field_config?.type === "essay" && (
                                <Badge variant="outline" className="text-xs">
                                  Essay
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground font-mono mb-1">
                              {field.field_name}
                            </p>
                            {field.field_config?.question && (
                              <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                                <span className="font-medium text-muted-foreground">
                                  Question:{" "}
                                </span>
                                <span className="text-foreground">
                                  {field.field_config.question}
                                </span>
                                {field.field_config.word_limit && (
                                  <div className="mt-1">
                                    <span className="font-medium text-muted-foreground">
                                      Word Limit:{" "}
                                    </span>
                                    <span className="text-foreground">
                                      {field.field_config.word_limit}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="flex items-center gap-1 text-xs">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={() =>
                                  toggleFieldRequired(
                                    field.unique_id || field.field_name
                                  )
                                }
                                className="rounded"
                              />
                              Required
                            </Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeRequiredField(
                                  field.unique_id || field.field_name
                                )
                              }
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {requiredFields.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No fields added yet</p>
                    <p className="text-xs">
                      Select fields from the dropdown above to build your
                      application form
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateAwardModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Award"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Essay Question Modal */}
      {showEssayQuestionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add Essay Question</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEssayQuestionModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="essay-label">Field Label *</Label>
                <Input
                  id="essay-label"
                  value={essayQuestionForm.label}
                  onChange={(e) =>
                    setEssayQuestionForm((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                  placeholder="e.g., Personal Statement, Leadership Essay"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="essay-question">Essay Question *</Label>
                <Textarea
                  id="essay-question"
                  value={essayQuestionForm.question}
                  onChange={(e) =>
                    setEssayQuestionForm((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  placeholder="Enter the essay question or prompt..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="word-limit">Word Limit (optional)</Label>
                  <Input
                    id="word-limit"
                    type="number"
                    value={essayQuestionForm.wordLimit}
                    onChange={(e) =>
                      setEssayQuestionForm((prev) => ({
                        ...prev,
                        wordLimit: e.target.value,
                      }))
                    }
                    placeholder="500"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placeholder">Placeholder Text</Label>
                  <Input
                    id="placeholder"
                    value={essayQuestionForm.placeholder}
                    onChange={(e) =>
                      setEssayQuestionForm((prev) => ({
                        ...prev,
                        placeholder: e.target.value,
                      }))
                    }
                    placeholder="Enter your response..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowEssayQuestionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addEssayQuestion}
                  disabled={
                    !essayQuestionForm.question.trim() ||
                    !essayQuestionForm.label.trim()
                  }
                >
                  Add Essay Question
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Rest of the component remains the same */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="animate-slide-in-left">
              <p className="text-xl text-muted-foreground">
                Admin Dashboard Overview
              </p>
            </div>
            <div className="animate-slide-in-right flex items-center gap-4">
              <div className="hexagon neon-glow"></div>
              <button className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 font-medium">
                <Search className="w-4 h-4" />
                Find Awards
              </button>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card-modern mb-8">
          <div className="flex border-b border-border">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "applications", label: "Applications", icon: FileText },
              { id: "awards", label: "Awards", icon: Trophy },
              { id: "admins", label: "Admin Users", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="card-modern p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  className="btn-primary p-4 rounded-lg text-left"
                  onClick={() => setShowCreateAwardModal(true)}
                >
                  <Award className="w-6 h-6 mb-2" />
                  <div className="font-medium">Create New Award</div>
                  <div className="text-sm opacity-80">
                    Add scholarship or grant
                  </div>
                </button>
                <button className="btn-secondary p-4 rounded-lg text-left">
                  <FileText className="w-6 h-6 mb-2" />
                  <div className="font-medium">Review Applications</div>
                  <div className="text-sm opacity-80">
                    Process pending requests
                  </div>
                </button>
                <button className="btn-secondary p-4 rounded-lg text-left">
                  <Users className="w-6 h-6 mb-2" />
                  <div className="font-medium">Manage Users</div>
                  <div className="text-sm opacity-80">Add or remove admins</div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-modern p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                  >
                    {getStatusIcon(app.status)}
                    <div className="flex-1">
                      <p className="font-medium">
                        {app.student?.full_name} applied for {app.award?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="card-modern p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="card-modern p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Applications
              </h3>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Student
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Award
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Status
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Submitted
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Value
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app: any) => (
                      <TableRow
                        key={app.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="py-3 px-4">
                          <div>
                            <div className="font-medium">
                              {app.student?.full_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {app.student?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div>
                            <div className="font-medium">
                              {app.award?.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {app.award?.code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {getStatusIcon(app.status)}
                            {app.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {app.submitted_at
                            ? new Date(app.submitted_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <span className="font-medium">
                            ${app.award?.value?.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <button className="p-1 hover:bg-muted rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
        {activeTab === "awards" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="card-modern p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search awards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Awards Table */}
            <div className="card-modern p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Awards List
              </h3>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Title
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Value
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Category
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Deadline
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {awards.map((app: any) => (
                      <TableRow
                        key={app.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="py-3 px-4">
                          <div>
                            <div className="font-medium">{app.title}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div>
                            <div className="font-medium">{app.value}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {app.category}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {app.deadline
                            ? new Date(app.deadline).toLocaleDateString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
        {activeTab === "admins" && (
          <AdminUsersTable />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
