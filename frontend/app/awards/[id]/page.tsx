"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Calendar,
  Clock,
  DollarSign,
  User,
  FileText,
  Upload,
  CheckCircle,
  ArrowLeft,
  Share2,
  Bookmark,
  Globe,
  Building,
  Phone,
  Mail,
  Download,
  Star,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { fetchAwardsDetails } from "@/app/hooks/useAwards";

interface AwardDetails {
  id: string;
  title: string;
  description: string;
  value: string;
  category: string;
  donor: string;
  deadline: string;
  code: string;
  eligibility: string;
  application_method: string;
  citizenship: string[];
  // requirements: string[];
  // contactInfo: {
  //   email: string;
  //   phone: string;
  //   website: string;
  // };
  // additionalInfo: {
  //   recipients: number;
  //   founded: string;
  //   totalAwarded: string;
  //   selectionCriteria: string[];
  // };
}

export default function AwardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [award, setAward] = useState<AwardDetails | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [awardId, setAwardId] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    program: "",
    gpa: "",
    personalStatement: "",
  });

  // Extract ID from params
  useEffect(() => {
    const extractId = async () => {
      const { id } = await params;
      // console.log(id);
      setAwardId(id);
    };
    extractId();
  }, [params]);

  // Use the query hook with the extracted ID - only call when awardId is not null
  const {
    data: awardData,
    isLoading,
    error,
  } = fetchAwardsDetails(awardId || "");
  console.log("Award ID: ", awardId);
  // Update local state when query data changes
  useEffect(() => {
    if (awardData && awardData.length > 0 && awardId) {
      // Find the specific award by ID or use the first one
      const foundAward = Array.isArray(awardData)
        ? awardData.find((a) => a.id === awardId) || awardData[0]
        : awardData;

      if (foundAward) {
        // Transform the fetched award to match our expected structure
        const transformedAward: AwardDetails = {
          id: foundAward.id,
          title: foundAward.title,
          description: foundAward.description,
          value: foundAward.value,
          category: foundAward.category,
          donor: foundAward.donor,
          deadline: foundAward.deadline,
          code: foundAward.code,
          eligibility: foundAward.eligibility,
          application_method: foundAward.application_method,
          citizenship: foundAward.citizenship || [],
          // requirements: foundAward.requirements || [
          //   "Official transcript",
          //   "Two letters of recommendation",
          //   "Personal statement (500-750 words)",
          //   "Resume/CV"
          // ],
          // contactInfo: foundAward.contactInfo || {
          //   email: "contact@organization.org",
          //   phone: "(555) 123-4567",
          //   website: "www.organization.org"
          // },
          // additionalInfo: foundAward.additionalInfo || {
          //   recipients: 15,
          //   founded: "2018",
          //   totalAwarded: "$2.5M",
          //   selectionCriteria: [
          //     "Academic excellence (40%)",
          //     "Leadership and community involvement (30%)",
          //     "Technical innovation (20%)",
          //     "Financial need (10%)"
          //   ]
          // }
        };

        setAward(transformedAward);
      }
    }
  }, [awardData, awardId]);

  // Show loading state
  if (isLoading || !awardId) {
    return (
      <div className="min-h-screen geometric-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading award details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !award) {
    return (
      <div className="min-h-screen geometric-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Award Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            {error
              ? "Failed to load award details."
              : "The requested award could not be found."}
          </p>
          <Link href="/awards">
            <Button className="btn-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Awards
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDeadline;
  };

  const isDeadlineSoon = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    return days <= 7 && days > 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setApplicationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle application submission
    console.log("Application submitted:", applicationData);
    alert("Application submitted successfully!");
  };

  const daysLeft = getDaysUntilDeadline(award.deadline);
  const isUrgent = isDeadlineSoon(award.deadline);

  return (
    <div className="min-h-screen geometric-bg">
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 floating-element animate-wave opacity-30" />
      <div className="fixed top-40 right-20 floating-element animate-wave opacity-20" />
      <div className="fixed bottom-32 left-1/4 floating-element animate-wave opacity-25" />

      <div className="max-w-6xl mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/awards">
              <Button variant="outline" size="sm" className="btn-secondary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Awards
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              <span>Award Details</span>
            </div>
          </div>

          <div className="card-modern p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {award.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="px-3 py-1 bg-muted rounded-full">
                        {award.code}
                      </span>
                      <span className="text-primary font-medium">
                        {award.category}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  {award.description}
                </p>
              </div>

              <div className="lg:w-80 space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-center gap-2 text-3xl font-bold text-green-600 mb-2">
                    <DollarSign className="h-8 w-8" />
                    <span className="gradient-text">{award.value}</span>
                  </div>
                  <p className="text-sm text-green-700">Award Value</p>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isUrgent
                      ? "bg-red-50 border-red-200"
                      : daysLeft <= 30
                      ? "bg-orange-50 border-orange-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar
                      className={`h-5 w-5 ${
                        isUrgent
                          ? "text-red-600"
                          : daysLeft <= 30
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isUrgent
                          ? "text-red-600"
                          : daysLeft <= 30
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    >
                      {isUrgent
                        ? `${daysLeft} days left!`
                        : formatDate(award.deadline)}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      isUrgent
                        ? "text-red-700"
                        : daysLeft <= 30
                        ? "text-orange-700"
                        : "text-blue-700"
                    }`}
                  >
                    Application Deadline
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 btn-secondary"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark
                      className={`h-4 w-4 mr-2 ${
                        isBookmarked ? "fill-current" : ""
                      }`}
                    />
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" size="sm" className="btn-secondary">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 animate-slide-in-up">
          <div className="card-modern p-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "overview", label: "Overview", icon: Award },
                { id: "requirements", label: "Requirements", icon: FileText },
                { id: "apply", label: "Apply Now", icon: User },
                // { id: "contact", label: "Contact", icon: Phone },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id ? "btn-primary" : "hover:bg-muted"
                  } transition-all duration-300`}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-slide-in-up">
          {activeTab === "overview" && (
            // <div className="grid lg:grid-cols-3 gap-8">
            //   <div className="lg:col-span-2 space-y-8">
            <div className="grid gap-8">
              <div className=" space-y-8">
                {/* Award Details */}
                <div className="card-modern p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Award Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Eligibility Criteria
                      </h3>
                      <p className="text-foreground/80 leading-relaxed">
                        {award.eligibility}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        Donor Organization
                      </h3>
                      <p className="text-foreground/80">{award.donor}</p>
                    </div>
                  </div>

                  {award.citizenship.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-purple-500" />
                        Citizenship Requirements
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {award.citizenship.map((country, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm rounded-full border border-purple-200"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selection Criteria */}
                <div className="card-modern p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    Selection Criteria
                  </h2>

                  {/* <div className="space-y-4">
                    {award.additionalInfo.selectionCriteria.map(
                      (criteria, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {criteria.match(/\((\d+)%\)/)?.[1] || index + 1}
                          </div>
                          <span className="text-foreground font-medium">
                            {criteria}
                          </span>
                        </div>
                      )
                    )}
                  </div> */}
                </div>
              </div>

              {/* Sidebar Stats */}
              {/* <div className="space-y-6">
                <div className="card-modern p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Award Statistics
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Recipients</span>
                      <span className="font-semibold text-foreground">
                        {award.additionalInfo.recipients}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Founded</span>
                      <span className="font-semibold text-foreground">
                        {award.additionalInfo.founded}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Total Awarded
                      </span>
                      <span className="font-semibold text-green-600">
                        {award.additionalInfo.totalAwarded}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-modern p-6">
                  <h3 className="font-bold text-foreground mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      className="w-full btn-primary"
                      onClick={() => setActiveTab("apply")}
                    >
                      Start Application
                    </Button>
                    <Button variant="outline" className="w-full btn-secondary">
                      <Download className="mr-2 h-4 w-4" />
                      Download Guidelines
                    </Button>
                    <Button variant="outline" className="w-full btn-secondary">
                      <Clock className="mr-2 h-4 w-4" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </div> */}
            </div>
          )}

          {activeTab === "requirements" && (
            <div className="card-modern p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Application Requirements
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Required Documents
                  </h3>
                  {/* <div className="space-y-3">
                    {award.requirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">{requirement}</span>
                      </div>
                    ))}
                  </div> */}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Application Process
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          Complete Online Application
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Fill out the application form with your personal and
                          academic information.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          Upload Documents
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Submit all required documents in PDF format.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          Review & Submit
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Review your application and submit before the
                          deadline.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "apply" && (
            <div className="card-modern p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Application Form
              </h2>

              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-foreground"
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={applicationData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-foreground"
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={applicationData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-foreground"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={applicationData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="institution"
                      className="text-sm font-medium text-foreground"
                    >
                      Institution *
                    </Label>
                    <Input
                      id="institution"
                      value={applicationData.institution}
                      onChange={(e) =>
                        handleInputChange("institution", e.target.value)
                      }
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="program"
                      className="text-sm font-medium text-foreground"
                    >
                      Program of Study *
                    </Label>
                    <Input
                      id="program"
                      value={applicationData.program}
                      onChange={(e) =>
                        handleInputChange("program", e.target.value)
                      }
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="gpa"
                    className="text-sm font-medium text-foreground"
                  >
                    Current GPA *
                  </Label>
                  <Input
                    id="gpa"
                    value={applicationData.gpa}
                    onChange={(e) => handleInputChange("gpa", e.target.value)}
                    className="mt-1 max-w-xs"
                    placeholder="e.g., 3.75"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="personalStatement"
                    className="text-sm font-medium text-foreground"
                  >
                    Personal Statement * (500-750 words)
                  </Label>
                  <Textarea
                    id="personalStatement"
                    value={applicationData.personalStatement}
                    onChange={(e: any) =>
                      handleInputChange("personalStatement", e.target.value)
                    }
                    className="mt-1 min-h-[200px]"
                    placeholder="Tell us about your academic goals, achievements, and why you deserve this award..."
                    required
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {
                      applicationData.personalStatement
                        .split(" ")
                        .filter((word) => word.length > 0).length
                    }{" "}
                    words
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    Document Uploads
                  </Label>
                  {/* <div className="grid md:grid-cols-2 gap-4">
                    {award.requirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          {requirement}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                    ))}
                  </div> */}
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" className="btn-primary">
                    Submit Application
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="btn-secondary"
                  >
                    Save as Draft
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
