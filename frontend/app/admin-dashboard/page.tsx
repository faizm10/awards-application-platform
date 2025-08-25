"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Award,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  Loader2,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Mail,
  Shield,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { getAwardsWithStats, getAwardStats, getApplicationStatsByAward, type AwardWithStats, type AwardStats } from "@/lib/admin"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [awardToDelete, setAwardToDelete] = useState<string | null>(null)
  const [awards, setAwards] = useState<AwardWithStats[]>([])
  const [stats, setStats] = useState<AwardStats>({
    totalAwards: 0,
    activeAwards: 0,
    draftAwards: 0,
    totalApplications: 0,
    averageApplicationsPerAward: 0,
    totalValue: 0,
  })
  const [loading, setLoading] = useState(true)

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      totalAwards: 45,
      totalApplications: 2341,
      totalValue: 1250000,
      successRate: 78.5,
    },
    trends: {
      applicationsThisMonth: 156,
      applicationsLastMonth: 142,
      growthRate: 9.9,
      topCategories: [
        { name: "Engineering", count: 45, percentage: 28.8 },
        { name: "Business", count: 38, percentage: 24.4 },
        { name: "Arts & Sciences", count: 32, percentage: 20.5 },
        { name: "Health Sciences", count: 25, percentage: 16.0 },
        { name: "Education", count: 16, percentage: 10.3 },
      ],
      monthlyApplications: [
        { month: "Jan", count: 89 },
        { month: "Feb", count: 112 },
        { month: "Mar", count: 134 },
        { month: "Apr", count: 156 },
        { month: "May", count: 142 },
        { month: "Jun", count: 167 },
      ],
    },
    performance: {
      averageResponseTime: "2.3s",
      uptime: 99.8,
      systemHealth: "Excellent",
      recentIssues: 0,
      pendingReviews: 23,
      completedReviews: 156,
    },
    demographics: {
      byYear: [
        { year: "1st Year", count: 456, percentage: 19.5 },
        { year: "2nd Year", count: 523, percentage: 22.3 },
        { year: "3rd Year", count: 612, percentage: 26.1 },
        { year: "4th Year", count: 750, percentage: 32.1 },
      ],
      byGender: [
        { gender: "Female", count: 1289, percentage: 55.1 },
        { gender: "Male", count: 1052, percentage: 44.9 },
      ],
    },
  }

  // Mock system settings data
  const systemSettings = {
    general: {
      siteName: "University Awards Platform",
      siteDescription: "Official awards and scholarships platform",
      maintenanceMode: false,
      allowNewRegistrations: true,
      requireEmailVerification: true,
    },
    notifications: {
      emailNotifications: true,
      applicationReminders: true,
      deadlineReminders: true,
      adminAlerts: true,
      weeklyReports: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordComplexity: "medium",
      ipWhitelist: "",
    },
    application: {
      maxFileSize: 10,
      allowedFileTypes: "pdf,doc,docx,jpg,jpeg,png",
      autoSaveDrafts: true,
      allowMultipleApplications: true,
      requireResume: true,
    },
    email: {
      smtpServer: "smtp.university.edu",
      smtpPort: 587,
      fromEmail: "awards@university.edu",
      fromName: "University Awards Office",
      replyToEmail: "awards-support@university.edu",
    },
  }

  const [settings, setSettings] = useState(systemSettings)

  // Handle settings updates
  const updateSetting = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [awardsData, statsData] = await Promise.all([
          getAwardsWithStats(),
          getAwardStats()
        ]);
        setAwards(awardsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAwards = awards.filter((award) => {
    const matchesSearch =
      award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || award.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeleteAward = (awardId: string) => {
    setAwardToDelete(awardId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (awardToDelete) {
      // In real app, call deleteAward API
      console.log("Deleting award:", awardToDelete)
      setDeleteDialogOpen(false)
      setAwardToDelete(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-red-100 text-red-800 border-red-200"
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Simple admin check - in a real app, this would come from user metadata
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('administrator')
  
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading admin dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage awards, applications, and system settings</p>
        </div>
        <Button asChild>
          <Link href="/admin-dashboard/awards/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Award
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="awards" className="space-y-6">
        <TabsList>
          <TabsTrigger value="awards">Awards Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="awards" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Awards</CardTitle>
              <CardDescription>Search and filter awards in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by award title or faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Awards Table */}
          <Card>
            <CardHeader>
              <CardTitle>Awards ({filteredAwards.length})</CardTitle>
              <CardDescription>Manage all awards in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Award Title</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAwards.map((award) => (
                      <TableRow key={award.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{award.title}</div>
                            <div className="text-sm text-muted-foreground">{award.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-primary">{award.value}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(award.deadline).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{award.application_count}</span>
                            {award.application_count > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {award.application_count} applications
                              </Badge>
                                                        )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(award.status)}>
                            {award.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/awards/${award.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Award
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin-dashboard/awards/${award.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Award
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin-dashboard/awards/${award.id}/applications`}>
                                  <Users className="h-4 w-4 mr-2" />
                                  View Applications ({award.application_count})
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteAward(award.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Award
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.totalApplications.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{analyticsData.trends.growthRate}%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Award Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(analyticsData.overview.totalValue / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.successRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time system metrics and health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span>System Health</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {analyticsData.performance.systemHealth}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Average Response Time</span>
                  </div>
                  <span className="font-medium">{analyticsData.performance.averageResponseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-600" />
                    <span>Uptime</span>
                  </div>
                  <span className="font-medium">{analyticsData.performance.uptime}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span>Recent Issues</span>
                  </div>
                  <span className="font-medium">{analyticsData.performance.recentIssues}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Review Status</CardTitle>
                <CardDescription>Current review pipeline status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Pending Reviews</span>
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {analyticsData.performance.pendingReviews}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Completed Reviews</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {analyticsData.performance.completedReviews}
                  </Badge>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Review Progress</span>
                    <span>{Math.round((analyticsData.performance.completedReviews / (analyticsData.performance.completedReviews + analyticsData.performance.pendingReviews)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(analyticsData.performance.completedReviews / (analyticsData.performance.completedReviews + analyticsData.performance.pendingReviews)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Award Categories</CardTitle>
              <CardDescription>Most popular award categories by application count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trends.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">{category.count} applications</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{category.percentage}%</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications by Year Level</CardTitle>
                <CardDescription>Distribution of applications across student year levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.demographics.byYear.map((year, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{year.year}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{year.count}</span>
                        <span className="text-xs text-muted-foreground">({year.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applications by Gender</CardTitle>
                <CardDescription>Gender distribution of applicants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.demographics.byGender.map((gender, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{gender.gender}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{gender.count}</span>
                        <span className="text-xs text-muted-foreground">({gender.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic system configuration and site information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input 
                    id="siteDescription" 
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                    placeholder="Enter site description"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable the platform for maintenance
                    </p>
                  </div>
                  <Switch 
                    checked={settings.general.maintenanceMode} 
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable new user registrations
                    </p>
                  </div>
                  <Switch 
                    checked={settings.general.allowNewRegistrations} 
                    onCheckedChange={(checked) => updateSetting('general', 'allowNewRegistrations', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch 
                    checked={settings.general.requireEmailVerification} 
                    onCheckedChange={(checked) => updateSetting('general', 'requireEmailVerification', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable email notifications for users
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications.emailNotifications} 
                  onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Application Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Send reminders for incomplete applications
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications.applicationReminders} 
                  onCheckedChange={(checked) => updateSetting('notifications', 'applicationReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Deadline Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Send deadline reminders to applicants
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications.deadlineReminders} 
                  onCheckedChange={(checked) => updateSetting('notifications', 'deadlineReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Admin Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send alerts to administrators for important events
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications.adminAlerts} 
                  onCheckedChange={(checked) => updateSetting('notifications', 'adminAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Send weekly summary reports to administrators
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications.weeklyReports} 
                  onCheckedChange={(checked) => updateSetting('notifications', 'weeklyReports', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    min="5"
                    max="480"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input 
                    id="maxLoginAttempts" 
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passwordComplexity">Password Complexity</Label>
                <Select 
                  value={settings.security.passwordComplexity}
                  onValueChange={(value) => updateSetting('security', 'passwordComplexity', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (6+ characters)</SelectItem>
                    <SelectItem value="medium">Medium (8+ characters, mixed case)</SelectItem>
                    <SelectItem value="high">High (10+ characters, symbols required)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea 
                  id="ipWhitelist" 
                  value={settings.security.ipWhitelist}
                  onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value)}
                  placeholder="Enter IP addresses (one per line) to restrict access"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to allow all IP addresses
                </p>
              </div>
              
                              <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch 
                    checked={settings.security.twoFactorAuth} 
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                  />
                </div>
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure application submission and file upload settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input 
                    id="maxFileSize" 
                    type="number"
                    value={settings.application.maxFileSize}
                    onChange={(e) => updateSetting('application', 'maxFileSize', parseInt(e.target.value))}
                    min="1"
                    max="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                  <Input 
                    id="allowedFileTypes" 
                    value={settings.application.allowedFileTypes}
                    onChange={(e) => updateSetting('application', 'allowedFileTypes', e.target.value)}
                    placeholder="pdf,doc,docx,jpg,jpeg,png"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Save Drafts</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save application drafts
                    </p>
                  </div>
                  <Switch 
                    checked={settings.application.autoSaveDrafts} 
                    onCheckedChange={(checked) => updateSetting('application', 'autoSaveDrafts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Multiple Applications</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow students to apply to multiple awards
                    </p>
                  </div>
                  <Switch 
                    checked={settings.application.allowMultipleApplications} 
                    onCheckedChange={(checked) => updateSetting('application', 'allowMultipleApplications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Resume</Label>
                    <p className="text-sm text-muted-foreground">
                      Require resume upload for all applications
                    </p>
                  </div>
                  <Switch 
                    checked={settings.application.requireResume} 
                    onCheckedChange={(checked) => updateSetting('application', 'requireResume', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure SMTP settings for email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input 
                    id="smtpServer" 
                    value={settings.email.smtpServer}
                    onChange={(e) => updateSetting('email', 'smtpServer', e.target.value)}
                    placeholder="smtp.university.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input 
                    id="smtpPort" 
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input 
                    id="fromEmail" 
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                    placeholder="awards@university.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input 
                    id="fromName" 
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                    placeholder="University Awards Office"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="replyToEmail">Reply-To Email</Label>
                <Input 
                  id="replyToEmail" 
                  type="email"
                  value={settings.email.replyToEmail}
                  onChange={(e) => updateSetting('email', 'replyToEmail', e.target.value)}
                  placeholder="awards-support@university.edu"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Settings Button */}
          <div className="flex justify-end">
            <Button className="px-8">
              <Settings className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Award</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this award? This action cannot be undone and will also delete all
              associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Award
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
