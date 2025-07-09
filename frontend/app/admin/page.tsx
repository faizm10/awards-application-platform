"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);

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
        setApplications(data);
      }
    };
    fetchApplications();
  }, [applications]);
  // const stats = {
  //   totalApplications: mockData.applications.length,
  //   pendingApplications: mockData.applications.filter(
  //     (app) => app.status === "pending"
  //   ).length,
  //   approvedApplications: mockData.applications.filter(
  //     (app) => app.status === "approved"
  //   ).length,
  //   totalAdmins: mockData.adminUsers.length,
  // };

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

  // const filteredApplications = mockData.applications.filter((app) => {
  //   const matchesSearch =
  //     app.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     app.award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     app.student.email.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesFilter = filterStatus === "all" || app.status === filterStatus;
  //   return matchesSearch && matchesFilter;
  // });

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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="animate-slide-in-left">
              {/* <h1 className="text-5xl font-bold gradient-text mb-2">
                Welcome back, {user.email?.split("@")[0]}!
              </h1> */}
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
            </div>
          </div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
              { title: 'Pending Review', value: stats.pendingApplications, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
              { title: 'Approved', value: stats.approvedApplications, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
              { title: 'Admin Users', value: stats.totalAdmins, icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' }
            ].map((stat, index) => (
              <div key={index} className={`card-modern p-6 animate-bounce-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div> */}
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
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn-primary p-4 rounded-lg text-left">
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
                        {app.student.full_name} applied for {app.award.title}
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
                {/* Applications ({filteredApplications.length}) */}
                Applications
              </h3>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Student
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">Award</TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Status
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">
                        Submitted
                      </TableHead>
                      <TableHead className="text-left py-3 px-4 font-medium">Value</TableHead>
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
                              {app.student.full_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {app.student.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div>
                            <div className="font-medium">{app.award.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {app.award.code}
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
                            ${app.award.value?.toLocaleString()}
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

        {/* {activeTab === "admins" && (
          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">
                Admin Users ({mockData.adminUsers.length})
              </h3>
              <button className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
                <Users className="w-4 h-4" />
                Add Admin
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Full Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.adminUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{user.email}</td>
                      <td className="py-3 px-4">{user.full_name || "-"}</td>
                      <td className="py-3 px-4">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button className="p-1 hover:bg-muted rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AdminDashboard;
