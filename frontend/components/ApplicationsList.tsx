"use client";
import { useState } from "react";
import { Award, Clock, CheckCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApplicationsList({ applications }: { applications: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleApps = showAll ? applications : applications.slice(0, 3);
  return (
    <>
      <div className="space-y-4">
        {visibleApps.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">No recent applications found.</div>
        ) : (
          visibleApps.map((app) => (
            <Link
              key={app.id}
              href={`/awards/${app.award?.code}`}
              className="block"
            >
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-chart-2/5 border border-primary/20 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-chart-2/20">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {app.award?.title || "Unknown Award"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {app.award?.category || ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-primary">{app.award?.value || ""}</p>
                    {app.status === "submitted" || app.status === "reviewed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : app.status === "draft" ? (
                      <Edit className="h-4 w-4 text-orange-500" />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {app.status === "submitted" || app.status === "reviewed" 
                        ? (app.submitted_at ? `Submitted: ${new Date(app.submitted_at).toLocaleDateString()}` : "Submitted")
                        : (app.award?.deadline ? `Deadline: ${new Date(app.award.deadline).toLocaleDateString()}` : "")
                      }
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      app.status === "submitted" || app.status === "reviewed"
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : app.status === "draft" 
                        ? "bg-orange-100 text-orange-700 border border-orange-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}>
                      {app.status === "submitted" || app.status === "reviewed" ? "Submitted" : app.status === "draft" ? "Draft" : app.status || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      {applications.length > 3 && (
        <div className="flex justify-center mt-4">
          <Button variant="ghost" className="text-primary hover:text-primary/80" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show Less" : "View All"}
          </Button>
        </div>
      )}
    </>
  );
} 