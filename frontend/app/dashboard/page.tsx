import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Award,
  Search,
  Clock,
  CheckCircle,
  DollarSign,
  BookOpen,
  Target,
  Calendar,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function dashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch profile to check user_type
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", data.user.id)
    .single();

  if (profile && profile.user_type === "admin") {
    redirect("/admin");
  }

  // Mock data for awards
  const mockAwards = [
    {
      id: 1,
      title: "Merit Scholarship",
      amount: "$10,000",
      deadline: "2024-03-15",
      status: "applied",
      category: "Academic Excellence",
      progress: 100,
    },
    {
      id: 2,
      title: "Research Grant",
      amount: "$5,000",
      deadline: "2024-04-01",
      status: "pending",
      category: "Research",
      progress: 75,
    },
    {
      id: 3,
      title: "Leadership Award",
      amount: "$2,500",
      deadline: "2024-03-30",
      status: "won",
      category: "Leadership",
      progress: 100,
    },
  ];

  const stats = [
    {
      icon: Award,
      label: "Total Awards",
      value: "15",
      color: "from-primary to-chart-2",
      change: "+3",
    },
    {
      icon: CheckCircle,
      label: "Applied",
      value: "8",
      color: "from-chart-2 to-chart-3",
      change: "+2",
    },
    {
      icon: Clock,
      label: "Pending",
      value: "5",
      color: "from-chart-3 to-chart-4",
      change: "+1",
    },
    {
      icon: DollarSign,
      label: "Total Value",
      value: "$45K",
      color: "from-chart-4 to-chart-5",
      change: "+$12K",
    },
  ];

  const upcomingDeadlines = [
    { title: "Merit Scholarship", date: "Mar 15", days: 5 },
    { title: "Research Grant", date: "Apr 1", days: 22 },
    { title: "Leadership Award", date: "Mar 30", days: 20 },
  ];

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
              <div className="hexagon neon-glow"></div>
            </div>
          </div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="card-modern p-6 group hover:scale-105 transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div> */}
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
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/80"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {mockAwards.map((award) => (
                  <div
                    key={award.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-chart-2/5 border border-primary/20 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-chart-2/20">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {award.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {award.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{award.amount}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {award.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="card-modern p-6">
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

            {/* Profile Summary */}
            {/* <div className="card-modern p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Profile Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-semibold text-primary">85%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-chart-2 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Complete your profile to get better award matches
                </div>
              </div>
            </div> */}

            {/* Recent Activity */}
            <div className="card-modern p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Applied to Merit Scholarship
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Won Leadership Award
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Updated profile
                    </p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
