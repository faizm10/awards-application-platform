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
  Star,
  Calendar,
  Eye,
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
import OverviewTab from "@/components/admin/OverviewTab";
import ApplicationsTab from "@/components/admin/ApplicationsTab";
import AwardsTab from "@/components/admin/AwardsTab";
import ReviewerActivityTab from "@/components/admin/ReviewerActivityTab";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAward, setFilterAward] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCreateAwardModal, setShowCreateAwardModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewerActivityFilter, setReviewerActivityFilter] = useState("all");

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

  // Standard fields that are always included
  const STANDARD_FIELDS = [
    {
      field_name: "first_name",
      label: "Student First Name",
      type: "text",
      required: true,
    },
    {
      field_name: "last_name",
      label: "Student Last Name",
      type: "text",
      required: true,
    },
    {
      field_name: "student_id_text",
      label: "Student ID",
      type: "text",
      required: true,
    },
    {
      field_name: "email",
      label: "Email Address",
      type: "text",
      required: true,
    },
    {
      field_name: "major_program",
      label: "Major/Program",
      type: "text",
      required: true,
    },
  ];

  // Additional fields available in dropdown
  const PREDEFINED_FIELDS = [
    {
      field_name: "credits_completed",
      label: "Credits Completed",
      type: "text",
    },
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

  // 1. Add state for editing
  const [editAward, setEditAward] = useState<any>(null);
  const [showEditAwardModal, setShowEditAwardModal] = useState(false);
  const [editAwardForm, setEditAwardForm] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [applicationCounts, setApplicationCounts] = useState<{
    [key: string]: number;
  }>({});

  // Application edit state
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState<any>({});
  const [isEditingApplication, setIsEditingApplication] = useState(false);

  const router = useRouter();

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
      if (user) {
        // Fetch profile to check user_type
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();
        if (profile?.user_type === "reviewer") {
          router.replace("/reviewer");
        }
      }
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
            id,
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

  // Move fetchAwards outside of useEffect so it can be called elsewhere
  const fetchAwards = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("awards")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching awards:", error);
    } else {
      setAwards(data || []);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/awards/filter-options");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const generateApplicationPDF = async (application: any) => {
    try {
      const response = await fetch("/api/applications/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: application.id,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `application-${application.award?.code}-${application.student?.full_name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("PDF generated successfully!");
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  useEffect(() => {
    fetchAwards();
    fetchCategories();
  }, []);

  // Calculate application counts when both applications and awards are loaded
  useEffect(() => {
    if (applications.length > 0 && awards.length > 0) {
      calculateApplicationCounts();
    }
  }, [applications, awards]);

  // 2. Fetch reviews in useEffect
  useEffect(() => {
    const fetchReviews = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          reviewer:reviewer_id (full_name, email),
          application:application_id (
            id, first_name, last_name, email, award_id,
            award:award_id (title, code)
          )
        `
        )
        .order("created_at", { ascending: false });
      if (!error && data) setReviews(data);
    };
    fetchReviews();
  }, []);

  // 3. Fetch reviewers in useEffect
  useEffect(() => {
    const fetchReviewers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email")
        .eq("role", "reviewer")
        .order("full_name", { ascending: true });
      if (!error && data) setReviewers(data);
    };
    fetchReviewers();
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

  // Calculate application counts for each award
  const calculateApplicationCounts = () => {
    const counts: { [key: string]: number } = {};
    console.log("Calculating application counts...");
    console.log("Applications:", applications);
    console.log("Awards:", awards);

    applications.forEach((app: any) => {
      const awardId = app.award?.id || app.award_id;
      console.log(
        `Application ${app.id}: award_id = ${awardId}, award =`,
        app.award
      );
      if (awardId) {
        counts[awardId] = (counts[awardId] || 0) + 1;
      }
    });

    console.log("Calculated counts:", counts);
    setApplicationCounts(counts);
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

      // Create standard fields (always included)
      const standardFieldsToInsert = STANDARD_FIELDS.map((field) => ({
        award_id: awardData.id,
        field_name: field.field_name,
        label: field.label,
        type: field.type,
        required: field.required,
        question: null,
        field_config: null,
      }));

      // Create additional required fields if any
      const additionalFieldsToInsert = requiredFields.map((field) => ({
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

      // Insert all fields (standard + additional)
      const allFieldsToInsert = [
        ...standardFieldsToInsert,
        ...additionalFieldsToInsert,
      ];

      const { error: fieldsError } = await supabase
        .from("award_required_fields")
        .insert(allFieldsToInsert);

      if (fieldsError) {
        console.error("Error creating required fields:", fieldsError);
        toast("Award created but there was an error adding required fields.");
        return;
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
                    placeholder="1 award of $1000"
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
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
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

                {/* Standard Fields Section */}
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg space-y-3">
                  <h5 className="font-medium text-green-700 dark:text-green-300">
                    Standard Fields (Always Included)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {STANDARD_FIELDS.map((field) => (
                      <div
                        key={field.field_name}
                        className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border"
                      >
                        <span className="text-sm font-medium">
                          {field.label}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {field.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          Required
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Field Selector */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                  <h5 className="font-medium">Add Additional Fields</h5>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        value={selectedFieldOption}
                        onValueChange={setSelectedFieldOption}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a field to add..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
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
                            {/* <p className="text-xs text-muted-foreground font-mono mb-1">
                              {field.field_name}
                            </p> */}
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
              {
                id: "reviewer-activity",
                label: "Reviewer Activity",
                icon: Star,
              },
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
          <OverviewTab
            applications={applications}
            awards={awards}
            reviews={reviews}
            applicationCounts={applicationCounts}
          />
        )}

        {activeTab === "applications" && (
          <ApplicationsTab
            applications={applications}
            awards={awards}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            filterAward={filterAward}
            onSearchChange={setSearchTerm}
            onFilterStatusChange={setFilterStatus}
            onFilterAwardChange={setFilterAward}
            onViewApplication={(app) => {
              setSelectedApplication(app);
              setApplicationForm({
                first_name: app.first_name || "",
                last_name: app.last_name || "",
                email: app.email || "",
                student_id_text: app.student_id_text || "",
                major_program: app.major_program || "",
                status: app.status || "draft",
                ...app.essay_responses,
              });
              setShowApplicationModal(true);
            }}
            onDownloadPDF={generateApplicationPDF}
            applicationCounts={applicationCounts}
          />
        )}
        {activeTab === "awards" && (
          <AwardsTab
            awards={awards}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEditAward={(award) => {
              setEditAward(award);
              setEditAwardForm({ ...award });
              setShowEditAwardModal(true);
            }}
            onCreateAward={() => setShowCreateAwardModal(true)}
          />
        )}

        {activeTab === "reviewer-activity" && (
          <ReviewerActivityTab
            reviews={reviews}
            awards={awards}
            reviewerActivityFilter={reviewerActivityFilter}
            onReviewerActivityFilterChange={setReviewerActivityFilter}
          />
        )}

        {activeTab === "admins" && <AdminUsersTable />}
      </div>

      {/* Edit Award Modal */}
      {showEditAwardModal && editAward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Edit Award</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditAwardModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsEditing(true);
                const supabase = createClient();
                const { error } = await supabase
                  .from("awards")
                  .update({
                    title: editAwardForm.title,
                    code: editAwardForm.code,
                    donor: editAwardForm.donor,
                    value: editAwardForm.value,
                    deadline: editAwardForm.deadline,
                    citizenship: editAwardForm.citizenship,
                    description: editAwardForm.description,
                    eligibility: editAwardForm.eligibility,
                    application_method: editAwardForm.application_method,
                    category: editAwardForm.category,
                  })
                  .eq("id", editAward.id);
                setIsEditing(false);
                if (!error) {
                  setShowEditAwardModal(false);
                  toast("Award updated successfully!");
                  fetchAwards();
                } else {
                  toast("Failed to update award.");
                }
              }}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={editAwardForm.title}
                    onChange={(e) =>
                      setEditAwardForm((f: any) => ({
                        ...f,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Code *</Label>
                  <Input
                    id="edit-code"
                    value={editAwardForm.code}
                    onChange={(e) =>
                      setEditAwardForm((f: any) => ({
                        ...f,
                        code: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-donor">Donor</Label>
                  <Input
                    id="edit-donor"
                    value={editAwardForm.donor}
                    onChange={(e) =>
                      setEditAwardForm((f: any) => ({
                        ...f,
                        donor: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-value">Value ($)</Label>
                  <Input
                    id="edit-value"
                    value={editAwardForm.value}
                    onChange={(e) =>
                      setEditAwardForm((f: any) => ({
                        ...f,
                        value: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-deadline">Deadline</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    value={editAwardForm.deadline}
                    onChange={(e) =>
                      setEditAwardForm((f: any) => ({
                        ...f,
                        deadline: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editAwardForm.category}
                    onValueChange={(value) =>
                      setEditAwardForm((f: any) => ({
                        ...f,
                        category: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editAwardForm.description}
                  onChange={(e) =>
                    setEditAwardForm((f: any) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="edit-eligibility"
                  value={editAwardForm.eligibility}
                  onChange={(e) =>
                    setEditAwardForm((f: any) => ({
                      ...f,
                      eligibility: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditAwardModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isEditing}>
                  {isEditing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Edit Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                          <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {isEditingApplication ? "Editing" : "Viewing"} Application
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateApplicationPDF(selectedApplication)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApplicationModal(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {selectedApplication && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {selectedApplication.award?.title} •{" "}
                    {selectedApplication.student?.full_name}
                  </div>
                )}
              </div>

            <div className="p-6 space-y-6">
              {selectedApplication && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsEditingApplication(true);

                    try {
                      const supabase = createClient();

                      // Separate essay responses from regular form data
                      const regularFormData: any = {};
                      const essayResponses: any = {};

                      Object.keys(applicationForm).forEach((key) => {
                        if (key.startsWith("essay_response_")) {
                          essayResponses[key] = applicationForm[key];
                        } else {
                          regularFormData[key] = applicationForm[key];
                        }
                      });

                      // Prepare update data
                      const updateData = {
                        first_name: regularFormData.first_name || "",
                        last_name: regularFormData.last_name || "",
                        email: regularFormData.email || "",
                        student_id_text: regularFormData.student_id_text || "",
                        major_program: regularFormData.major_program || "",
                        status: regularFormData.status || "draft",
                        essay_responses: essayResponses,
                        updated_at: new Date().toISOString(),
                      };

                      console.log("Saving application data:", updateData);

                      const { data, error } = await supabase
                        .from("applications")
                        .update(updateData)
                        .eq("id", selectedApplication.id)
                        .select();

                      if (error) {
                        console.error("Supabase error:", error);
                        throw error;
                      }

                      console.log("Application saved successfully:", data);

                      // Refresh applications data
                      const { data: updatedApplications, error: refreshError } =
                        await supabase
                          .from("applications")
                          .select("*, student:profiles(*), award:awards(*)")
                          .order("submitted_at", { ascending: false });

                      if (refreshError) {
                        console.error(
                          "Error refreshing applications:",
                          refreshError
                        );
                      } else if (updatedApplications) {
                        setApplications(updatedApplications);
                        console.log("Applications list refreshed");
                      }

                      toast.success("Application updated successfully!");
                      setShowApplicationModal(false);
                    } catch (error) {
                      console.error("Error updating application:", error);
                      toast.error(
                        `Failed to update application: ${
                          error instanceof Error
                            ? error.message
                            : "Unknown error"
                        }`
                      );
                    } finally {
                      setIsEditingApplication(false);
                    }
                  }}
                >
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={applicationForm.first_name || ""}
                          onChange={(e) =>
                            setApplicationForm((f: any) => ({
                              ...f,
                              first_name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={applicationForm.last_name || ""}
                          onChange={(e) =>
                            setApplicationForm((f: any) => ({
                              ...f,
                              last_name: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={applicationForm.email || ""}
                          onChange={(e) =>
                            setApplicationForm((f: any) => ({
                              ...f,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student_id_text">Student ID</Label>
                        <Input
                          id="student_id_text"
                          value={applicationForm.student_id_text || ""}
                          onChange={(e) =>
                            setApplicationForm((f: any) => ({
                              ...f,
                              student_id_text: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major_program">Major/Program</Label>
                      <Input
                        id="major_program"
                        value={applicationForm.major_program || ""}
                        onChange={(e) =>
                          setApplicationForm((f: any) => ({
                            ...f,
                            major_program: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={applicationForm.status || "draft"}
                        onValueChange={(value) =>
                          setApplicationForm((f: any) => ({
                            ...f,
                            status: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Essay Responses */}
                  {selectedApplication.award?.required_fields && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Essay Responses
                      </h3>
                      {selectedApplication.award.required_fields.map(
                        (field: any) => {
                          const fieldKey = `essay_response_${field.id}`;
                          return (
                            <div key={field.id} className="space-y-2">
                              <Label htmlFor={fieldKey}>{field.label}</Label>
                              {field.field_config?.question && (
                                <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                                  <p className="text-sm font-medium">
                                    {field.field_config.question}
                                  </p>
                                </div>
                              )}
                              <Textarea
                                id={fieldKey}
                                value={applicationForm[fieldKey] || ""}
                                onChange={(e) =>
                                  setApplicationForm((f: any) => ({
                                    ...f,
                                    [fieldKey]: e.target.value,
                                  }))
                                }
                                rows={6}
                                placeholder={`Enter your ${field.label.toLowerCase()}...`}
                              />
                              {field.field_config?.word_limit && (
                                <div className="text-xs text-muted-foreground">
                                  Word limit: {field.field_config.word_limit}{" "}
                                  words
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplicationModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isEditingApplication}>
                      {isEditingApplication ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
