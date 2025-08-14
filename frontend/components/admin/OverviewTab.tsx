"use client";
import React from "react";
import { TrendingUp, Users, FileText, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OverviewTabProps {
  applications: any[];
  awards: any[];
  reviews: any[];
  applicationCounts: { [key: string]: number };
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  applications,
  awards,
  reviews,
  applicationCounts,
}) => {
  const totalApplications = applications.length;
  const totalAwards = awards.length;
  const totalReviews = reviews.length;
  const pendingApplications = applications.filter(app => app.status === "pending").length;
  const submittedApplications = applications.filter(app => app.status === "submitted").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
              <p className="text-2xl font-bold text-foreground">{totalApplications}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Awards</p>
              <p className="text-2xl font-bold text-foreground">{totalAwards}</p>
            </div>
            <div className="p-3 bg-chart-2/10 rounded-full">
              <Award className="h-6 w-6 text-chart-2" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+5% from last month</span>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
              <p className="text-2xl font-bold text-foreground">{pendingApplications}</p>
            </div>
            <div className="p-3 bg-chart-3/10 rounded-full">
              <Users className="h-6 w-6 text-chart-3" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">Requires attention</span>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold text-foreground">{totalReviews}</p>
            </div>
            <div className="p-3 bg-chart-4/10 rounded-full">
              <FileText className="h-6 w-6 text-chart-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+8% from last month</span>
          </div>
        </div>
      </div>

      {/* Application Summary */}
      <div className="card-modern p-6">
        <h3 className="text-xl font-bold mb-4 text-foreground">
          Application Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award: any) => {
            const applicationCount = applicationCounts[award.id] || 0;
            return (
              <div
                key={award.id}
                className="bg-muted/30 p-4 rounded-lg border"
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-modern p-6">
        <h3 className="text-xl font-bold mb-4 text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button asChild className="btn-primary">
            <Link href="/admin?tab=applications">
              <FileText className="mr-2 h-4 w-4" />
              View Applications
            </Link>
          </Button>
          <Button asChild className="btn-secondary">
            <Link href="/admin?tab=awards">
              <Award className="mr-2 h-4 w-4" />
              Manage Awards
            </Link>
          </Button>
          <Button asChild className="btn-secondary">
            <Link href="/admin?tab=reviewer-activity">
              <Users className="mr-2 h-4 w-4" />
              Review Activity
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
