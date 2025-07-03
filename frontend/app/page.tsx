import Link from "next/link";
import { Award, Users, TrendingUp, Zap, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarDemo } from "../components/womp";
export default function Home() {
  return (
    <main className="min-h-screen geometric-bg">
      <div className="relative z-10">
        <section className="relative py-20 ">
          <NavbarDemo />
        </section>

        <section className="relative py-20 ">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-slide-in-left">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="text-foreground">Unlock Your</span>
                    <br />
                    <span className="gradient-text">Potential</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-lg">
                    Discover and apply for scholarships, grants, and awards with
                    our intelligent matching platform.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="btn-primary text-lg px-8 py-4"
                  >
                    <Link href="/awards" className="flex items-center gap-2">
                      Start Exploring
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  {[
                    { icon: Award, value: "10K+", label: "Awards" },
                    { icon: Users, value: "50K+", label: "Students" },
                    { icon: TrendingUp, value: "$100M+", label: "Distributed" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center animate-bounce-in"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-chart-2/20">
                          <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold gradient-text">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content - Morphing Shape */}
              <div className="flex justify-center animate-slide-in-right">
                <div className="relative">
                  <div className="morphing-shape"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white font-bold text-xl">
                      <Award className="h-12 w-12 mx-auto mb-2" />
                      Awards Portal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 to-chart-2/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Why Choose <span className="gradient-text">AwardFlow</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform combines cutting-edge technology with personalized
                recommendations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Smart Matching",
                  description:
                    "AI-powered algorithm matches you with the perfect awards based on your profile",
                  color: "from-chart-3 to-chart-4",
                },
                {
                  icon: Star,
                  title: "Premium Awards",
                  description:
                    "Access exclusive scholarships and grants from top organizations worldwide",
                  color: "from-chart-4 to-chart-5",
                },
                {
                  icon: TrendingUp,
                  title: "Track Progress",
                  description:
                    "Monitor your applications and celebrate your achievements in real-time",
                  color: "from-primary to-chart-2",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="card-modern p-8 text-center group animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex justify-center mb-6">
                    <div
                      className={`p-4 rounded-full bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Geometric Grid Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Award <span className="gradient-text">Categories</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Explore diverse opportunities across different fields and
                interests
              </p>
            </div>

            <div className="geometric-grid">
              {[
                "Academic Excellence",
                "Research & Innovation",
                "Leadership & Service",
                "Arts & Creativity",
                "STEM & Technology",
                "International Studies",
              ].map((category, index) => (
                <div
                  key={index}
                  className="geometric-item flex items-center justify-center"
                >
                  <span className="text-foreground font-semibold text-center px-4">
                    {category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="hexagon"></div>
                  <span className="text-2xl font-bold gradient-text">
                    AwardFlow
                  </span>
                </div>
                <p className="text-muted-foreground max-w-md">
                  Empowering students worldwide to discover and secure academic
                  awards that fuel their educational dreams.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="/awards"
                      className="hover:text-foreground transition-colors"
                    >
                      Browse Awards
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="hover:text-foreground transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="/help"
                      className="hover:text-foreground transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-foreground transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="hover:text-foreground transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 AwardFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
