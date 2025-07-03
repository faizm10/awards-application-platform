"use client";
import { useState } from "react";
import { Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <div
              key={app.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-chart-2/5 border border-primary/20 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-chart-2/20">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {app.award?.title || "Unknown Award"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {app.award?.category || ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{app.award?.value || ""}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {app.award?.deadline ? new Date(app.award.deadline).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </div>
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