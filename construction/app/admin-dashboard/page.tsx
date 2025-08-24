"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>Overview of system performance and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Detailed analytics and reporting features would be implemented here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
                <p className="text-muted-foreground">
                  System settings and configuration options would be available here.
                </p>
              </div>
            </CardContent>
          </Card>
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
