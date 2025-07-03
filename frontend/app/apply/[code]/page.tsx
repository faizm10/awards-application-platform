import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Search, BookOpen, Target, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function dashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
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
                Welcome back, {data.user.email?.split("@")[0]}! 🎉
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
              <Button asChild className="btn-primary">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Dashboard
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card-modern p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start btn-primary">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Scholarships
                </Button>
                <Button className="w-full justify-start btn-secondary">
                  <Target className="mr-2 h-4 w-4" />
                  Set Goals
                </Button>
                <Button className="w-full justify-start btn-secondary">
                  <Zap className="mr-2 h-4 w-4" />
                  Track Progress
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
