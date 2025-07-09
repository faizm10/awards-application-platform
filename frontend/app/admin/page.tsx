"use client"
import type React from "react"
import { useState, useEffect } from "react"
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
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [showCreateAwardModal, setShowCreateAwardModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  })

  const [citizenshipInput, setCitizenshipInput] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("applications")
        .select(`
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
        `)
        .order("created_at", { ascending: false })

      console.log("Fetched applications:", data)
      if (error) {
        console.error("Error fetching applications:", error)
      } else {
        setApplications(data || [])
      }
    }
    fetchApplications()
  }, [])

  const getStatusIcon = (status: any) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: any) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setAwardForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addCitizenship = () => {
    if (citizenshipInput.trim() && !awardForm.citizenship.includes(citizenshipInput.trim())) {
      setAwardForm((prev) => ({
        ...prev,
        citizenship: [...prev.citizenship, citizenshipInput.trim()],
      }))
      setCitizenshipInput("")
    }
  }

  const removeCitizenship = (citizenship: string) => {
    setAwardForm((prev) => ({
      ...prev,
      citizenship: prev.citizenship.filter((c) => c !== citizenship),
    }))
  }

  const handleSubmitAward = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("awards")
        .insert([
          {
            title: awardForm.title,
            code: awardForm.code,
            donor: awardForm.donor,
            value: Number.parseFloat(awardForm.value) || 0,
            deadline: awardForm.deadline,
            citizenship: awardForm.citizenship,
            description: awardForm.description,
            eligibility: awardForm.eligibility,
            application_method: awardForm.application_method,
            category: awardForm.category,
          },
        ])
        .select()

      if (error) {
        console.error("Error creating award:", error)
        alert("Error creating award. Please try again.")
      } else {
        console.log("Award created successfully:", data)
        alert("Award created successfully!")

        // Reset form
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
        })
        setCitizenshipInput("")
        setShowCreateAwardModal(false)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return <div className="min-h-screen bg-background animate-pulse" />

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 geometric-bg"></div>
      <div className="floating-element animate-wave" style={{ top: "10%", right: "15%", animationDelay: "0s" }}></div>
      <div
        className="floating-element animate-wave"
        style={{ bottom: "30%", left: "10%", animationDelay: "1.5s" }}
      ></div>
      <div className="floating-element animate-wave" style={{ top: "60%", right: "25%", animationDelay: "3s" }}></div>

      {/* Create Award Modal */}
      {showCreateAwardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Create New Award</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateAwardModal(false)}>
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
                    min="0"
                    step="0.01"
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
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={awardForm.category} onValueChange={(value) => handleInputChange("category", value)}>
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
                        e.preventDefault()
                        addCitizenship()
                      }
                    }}
                  />
                  <Button type="button" onClick={addCitizenship} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {awardForm.citizenship.map((citizenship, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
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
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Award description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  value={awardForm.eligibility}
                  onChange={(e) => handleInputChange("eligibility", e.target.value)}
                  placeholder="Eligibility requirements"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="application_method">Application Method</Label>
                <Select
                  value={awardForm.application_method}
                  onValueChange={(value) => handleInputChange("application_method", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select application method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online Application</SelectItem>
                    <SelectItem value="email">Email Submission</SelectItem>
                    <SelectItem value="mail">Mail Submission</SelectItem>
                    <SelectItem value="in-person">In-Person Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowCreateAwardModal(false)}>
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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="animate-slide-in-left">
              <p className="text-xl text-muted-foreground">Admin Dashboard Overview</p>
            </div>
            <div className="animate-slide-in-right flex items-center gap-4">
              <div className="hexagon neon-glow"></div>
              <button className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 font-medium">
                <Search className="w-4 h-4" />
                Find Awards
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card-modern mb-8">
          <div className="flex border-b border-border">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "applications", label: "Applications", icon: FileText },
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
              <h3 className="text-xl font-bold mb-4 text-foreground">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn-primary p-4 rounded-lg text-left" onClick={() => setShowCreateAwardModal(true)}>
                  <Award className="w-6 h-6 mb-2" />
                  <div className="font-medium">Create New Award</div>
                  <div className="text-sm opacity-80">Add scholarship or grant</div>
                </button>
                <button className="btn-secondary p-4 rounded-lg text-left">
                  <FileText className="w-6 h-6 mb-2" />
                  <div className="font-medium">Review Applications</div>
                  <div className="text-sm opacity-80">Process pending requests</div>
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
              <h3 className="text-xl font-bold mb-4 text-foreground">Recent Activity</h3>
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div key={app.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    {getStatusIcon(app.status)}
                    <div className="flex-1">
                      <p className="font-medium">
                        {app.student?.full_name} applied for {app.award?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
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
              <h3 className="text-xl font-bold mb-4 text-foreground">Applications</h3>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="text-left py-3 px-4 font-medium">Student</TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">Award</TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">Status</TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">Submitted</TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">Value</TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app: any) => (
                      <TableRow key={app.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <TableCell className="py-3 px-4">
                          <div>
                            <div className="font-medium">{app.student?.full_name}</div>
                            <div className="text-xs text-muted-foreground">{app.student?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div>
                            <div className="font-medium">{app.award?.title}</div>
                            <div className="text-xs text-muted-foreground">{app.award?.code}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              app.status,
                            )}`}
                          >
                            {getStatusIcon(app.status)}
                            {app.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <span className="font-medium">${app.award?.value?.toLocaleString()}</span>
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
      </div>
    </div>
  )
}

export default AdminDashboard
