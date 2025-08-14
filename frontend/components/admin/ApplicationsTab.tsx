"use client";
import React from "react";
import { Search, Filter, Award, Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ApplicationsTabProps {
  applications: any[];
  awards: any[];
  searchTerm: string;
  filterStatus: string;
  filterAward: string;
  onSearchChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onFilterAwardChange: (value: string) => void;
  onViewApplication: (app: any) => void;
  applicationCounts: { [key: string]: number };
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  applications,
  awards,
  searchTerm,
  filterStatus,
  filterAward,
  onSearchChange,
  onFilterStatusChange,
  onFilterAwardChange,
  onViewApplication,
  applicationCounts,
}) => {
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

  return (
    <div className="space-y-6">
      {/* Application Summary */}
      <div className="card-modern p-6">
        <h3 className="text-xl font-bold mb-4 text-foreground">
          Application Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award: any) => {
            const applicationCount = applicationCounts[award.id] || 0;
            const isSelected = filterAward === award.id;
            return (
              <div
                key={award.id}
                className={`bg-muted/30 p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:border-primary/30 ${
                  isSelected ? "bg-primary/10 border-primary/50 shadow-md" : ""
                }`}
                onClick={() => onFilterAwardChange(isSelected ? "all" : award.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm truncate">
                    {award.title}
                  </h4>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {applicationCount} {applicationCount === 1 ? "application" : "applications"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {award.code} • ${award.value?.toLocaleString()}
                </div>
                {isSelected && (
                  <div className="mt-2 text-xs text-primary font-medium">
                    ✓ Filtered
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card-modern p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => onFilterStatusChange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="relative">
            <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filterAward}
              onChange={(e) => onFilterAwardChange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="all">All Awards</option>
              {awards.map((award) => (
                <option key={award.id} value={award.id}>
                  {award.title}
                </option>
              ))}
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
              {applications
                .filter((app: any) => {
                  // Filter by award
                  if (filterAward !== "all" && app.award?.id !== filterAward) {
                    return false;
                  }
                  // Filter by status
                  if (filterStatus !== "all" && app.status !== filterStatus) {
                    return false;
                  }
                  // Filter by search term
                  if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase();
                    const matchesSearch = 
                      app.student?.full_name?.toLowerCase().includes(searchLower) ||
                      app.student?.email?.toLowerCase().includes(searchLower) ||
                      app.award?.title?.toLowerCase().includes(searchLower) ||
                      app.award?.code?.toLowerCase().includes(searchLower);
                    if (!matchesSearch) {
                      return false;
                    }
                  }
                  return true;
                })
                .map((app: any) => (
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
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewApplication(app)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View/Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsTab;
