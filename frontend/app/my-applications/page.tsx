"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  FileText,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import {
  getApplicationsByStudent,
  getStatusColor,
  getStatusLabel,
  type Application,
} from "@/lib/applications";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

function MyApplicationsContent() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Scroll to top when page loads
  useScrollToTop();

  // Fetch applications when user is available
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const apps = await getApplicationsByStudent(user.id);
        setApplications(apps);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  // Filter applications to only show submitted and drafts, then apply search and status filters
  const filteredApplications = applications
    .filter((app) => app.status === "submitted" || app.status === "draft")
    .filter((app) => {
      const award = app.award as any; // Type assertion for award data
      const matchesSearch = award?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  const getApplicationStats = () => {
    const submittedAndDrafts = applications.filter(
      (app) => app.status === "submitted" || app.status === "draft"
    );
    const total = submittedAndDrafts.length;
    const submitted = submittedAndDrafts.filter(
      (app) => app.status === "submitted"
    ).length;
    const drafts = submittedAndDrafts.filter(
      (app) => app.status === "draft"
    ).length;

    return { total, submitted, drafts };
  };

  const stats = getApplicationStats();

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading applications...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Card className="text-center py-6">
          <CardContent>
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Applications</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Compact Header with Stats */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">My Applications</h1>
            <p className="text-sm text-muted-foreground">
              Track and manage your award applications
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total:</span>
            <Badge variant="outline" className="font-semibold">{stats.total}</Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-blue-600 font-medium">{stats.submitted} submitted</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-gray-600 font-medium">{stats.drafts} drafts</span>
          </div>
        </div>

        {/* Compact Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search awards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-9">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Compact Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-3">
          {filteredApplications.map((application) => {
            const award = application.award as any; // Type assertion for award data
            if (!award) return null;

            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg truncate">{award.title}</h3>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(application.status)} text-xs`}
                        >
                          {getStatusLabel(application.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium text-primary">{award.value}</span>
                        <span>•</span>
                        <span>{award.category}</span>
                        <span>•</span>
                        <span>
                          {application.submitted_at
                            ? `Submitted ${new Date(application.submitted_at).toLocaleDateString()}`
                            : `Updated ${new Date(application.updated_at).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/my-applications/${application.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      {application.status === "draft" && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/awards/${application.award_id}/apply`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-8">
          <CardContent>
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">
              No applications found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {applications.length === 0
                ? "You haven't applied for any awards yet."
                : "No applications match your current filters."}
            </p>
            {applications.length === 0 ? (
              <Button size="sm" asChild>
                <Link href="/awards">Browse Awards</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function MyApplicationsPage() {
  return (
    <ProtectedRoute>
      <MyApplicationsContent />
    </ProtectedRoute>
  );
}
