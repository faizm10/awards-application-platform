"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ROUTES } from "@/constants/routes";
import {
  getApplicationsByStudent,
  getStatusColor,
  getStatusLabel,
} from "@/lib/applications";
import { getAwardById } from "@/lib/awards";

export default function MyApplicationsPage() {
  const user = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!user || user.role !== "student") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Please log in as a student to view your applications.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const applications = getApplicationsByStudent(user.id);

  const filteredApplications = applications.filter((app) => {
    const award = getAwardById(app.awardId);
    const matchesSearch =
      award?.title.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getApplicationStats = () => {
    const total = applications.length;
    const submitted = applications.filter(
      (app) => app.status !== "draft"
    ).length;
    const underReview = applications.filter(
      (app) => app.status === "under_review"
    ).length;
    const awarded = applications.filter(
      (app) => app.status === "awarded"
    ).length;

    return { total, submitted, underReview, awarded };
  };

  const stats = getApplicationStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your award applications
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by award title..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Not Selected</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      {filteredApplications.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>
              Your award applications and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Award</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => {
                    const award = getAwardById(application.awardId);
                    if (!award) return null;

                    return (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{award.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {award.faculty}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-primary">
                            {award.value}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(application.status)}
                          >
                            {getStatusLabel(application.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {application.submittedAt
                            ? new Date(
                                application.submittedAt
                              ).toLocaleDateString()
                            : "Not submitted"}
                        </TableCell>
                        <TableCell>
                          {new Date(application.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                href={ROUTES.APPLICATION_DETAILS(
                                  application.id
                                )}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {application.status === "draft" && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={ROUTES.AWARD_APPLY(award.id)}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No applications found
            </h3>
            <p className="text-muted-foreground mb-4">
              {applications.length === 0
                ? "You haven't applied for any awards yet."
                : "No applications match your current filters."}
            </p>
            {applications.length === 0 ? (
              <Button asChild>
                <Link href={ROUTES.AWARDS}>Browse Awards</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
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
