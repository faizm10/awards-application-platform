import { redirect } from "next/navigation";
import { useDashboardData } from "@/app/hooks/useDashboardData";
import {
  
  Search,
  

  BookOpen,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockAwards, upcomingDeadlines, stats } from "@/constants/constants";
import ApplicationsList from "@/components/ApplicationsList";

export default async function dashboardPage() {
  const { user, profile, applications, error } = await useDashboardData();
  if (error || !user) {
    redirect("/auth/login");
  }
  if (profile && profile.user_type === "admin") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen geometric-bg">
      {/* Floating Elements */}
      <div
        className="floating-element"
        style={{ top: "5%", right: "10%" }}
      ></div>
      <div
        className="floating-element"
        style={{ bottom: "20%", left: "5%" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, {profile?.full_name ? profile.full_name : user.email?.split("@")[0]}! 🎉
              </h1>
              <p className="text-xl text-muted-foreground">
                Here's your awards journey overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild className="btn-primary">
                <Link href="/awards" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Awards
                </Link>
              </Button>
              <div className="hexagon neon-glow"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-modern p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Recent Applications
                </h2>
              </div>
              {/* Use the client component for the applications list */}
              <ApplicationsList applications={applications} />
            </div>

            {/* Upcoming Deadlines */}
            {/* <div className="card-modern p-6">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-chart-3" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-chart-3/10 border border-chart-3/20"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {deadline.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {deadline.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-chart-3">
                        {deadline.days} days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card-modern p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/awards">
                <Button className="w-full justify-start btn-primary">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Scholarships
                </Button>
                </Link>
               
              </div>
            </div>

            
            
            
            
          </div>
        </div>
      </div>
    </div>
  );
}
