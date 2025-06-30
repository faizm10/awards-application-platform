"use client"

import type { User } from "@supabase/supabase-js"
import { Award, FileText, Home, Settings, Users, TrendingUp, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LogoutButton } from "@/components/logout-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardContentProps {
  user: User
  userRole: "student" | "committee" | "admin"
}

const navigationItems = {
  student: [
    { title: "Dashboard", icon: Home, url: "/dashboard" },
    { title: "Browse Awards", icon: Award, url: "/awards" },
    { title: "My Applications", icon: FileText, url: "/applications" },
    { title: "Profile", icon: Settings, url: "/profile" },
  ],
  committee: [
    { title: "Dashboard", icon: Home, url: "/dashboard" },
    { title: "Review Applications", icon: FileText, url: "/review" },
    { title: "Awards Overview", icon: Award, url: "/awards" },
    { title: "Rankings", icon: TrendingUp, url: "/rankings" },
  ],
  admin: [
    { title: "Dashboard", icon: Home, url: "/dashboard" },
    { title: "Manage Awards", icon: Award, url: "/admin/awards" },
    { title: "User Management", icon: Users, url: "/admin/users" },
    { title: "Applications", icon: FileText, url: "/admin/applications" },
    { title: "Settings", icon: Settings, url: "/admin/settings" },
  ],
}

export function DashboardContent({ user, userRole }: DashboardContentProps) {
  const navItems = navigationItems[userRole]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Award className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Awards Portal</span>
                <span className="text-xs text-muted-foreground">University of Guelph</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col text-sm">
                <span className="font-medium">{user.user_metadata?.full_name || "User"}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <LogoutButton />
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">
                  {userRole === "student" && "Student Dashboard"}
                  {userRole === "committee" && "Committee Dashboard"}
                  {userRole === "admin" && "Admin Dashboard"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user.user_metadata?.full_name || user.email}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {userRole}
              </Badge>
            </div>
          </header>

          <main className="flex-1 space-y-6 p-6">
            {userRole === "student" && <StudentDashboard />}
            {userRole === "committee" && <CommitteeDashboard />}
            {userRole === "admin" && <AdminDashboard />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function StudentDashboard() {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Awards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awards Won</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">$5,000 total value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Due this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your latest award applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Dean's Excellence Award", status: "Under Review", date: "2024-01-15" },
              { name: "Research Innovation Grant", status: "Approved", date: "2024-01-10" },
              { name: "Community Service Award", status: "Pending", date: "2024-01-08" },
            ].map((app, i) => (
              <div key={i} className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.date}</p>
                </div>
                <Badge
                  variant={
                    app.status === "Approved" ? "default" : app.status === "Under Review" ? "secondary" : "outline"
                  }
                >
                  {app.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Don't miss these application deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Graduate Excellence Award", deadline: "2024-02-15", daysLeft: 12 },
              { name: "International Student Scholarship", deadline: "2024-02-28", daysLeft: 25 },
              { name: "STEM Innovation Prize", deadline: "2024-03-10", daysLeft: 35 },
            ].map((award, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{award.name}</p>
                  <Badge variant="outline">{award.daysLeft} days left</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={((30 - award.daysLeft) / 30) * 100} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{award.deadline}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Browse Awards
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View Applications
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function CommitteeDashboard() {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Requires your attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Awards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently accepting applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2</div>
            <p className="text-xs text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Review Queue</CardTitle>
          <CardDescription>Applications waiting for your review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { student: "Sarah Johnson", award: "Dean's Excellence Award", submitted: "2024-01-20", priority: "High" },
              {
                student: "Michael Chen",
                award: "Research Innovation Grant",
                submitted: "2024-01-19",
                priority: "Medium",
              },
              { student: "Emily Davis", award: "Community Service Award", submitted: "2024-01-18", priority: "Low" },
            ].map((review, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{review.student}</p>
                  <p className="text-sm text-muted-foreground">{review.award}</p>
                  <p className="text-xs text-muted-foreground">Submitted: {review.submitted}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      review.priority === "High"
                        ? "destructive"
                        : review.priority === "Medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {review.priority}
                  </Badge>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function AdminDashboard() {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Awards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">8 closing this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-muted-foreground">+2% from last year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: "New award created", details: "Graduate Excellence Award", time: "2 hours ago" },
              { action: "User registered", details: "john.doe@uoguelph.ca", time: "4 hours ago" },
              { action: "Application submitted", details: "Research Innovation Grant", time: "6 hours ago" },
              { action: "Award deadline extended", details: "Community Service Award", time: "1 day ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="default">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">File Storage</span>
              <Badge variant="default">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Service</span>
              <Badge variant="secondary">Maintenance</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Authentication</span>
              <Badge variant="default">Healthy</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Award
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
