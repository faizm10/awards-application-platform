import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Home, Award, User, Settings, Search, BookOpen } from "lucide-react";
import { IconDashboard } from "@tabler/icons-react";

export default function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen geometric-bg">
      {/* Floating Elements */}
      <div className="floating-element" style={{ top: '10%', left: '5%' }}></div>
      <div className="floating-element" style={{ bottom: '20%', right: '10%' }}></div>

      <div className="flex-1 w-full flex flex-col items-center relative z-10">
        {/* Modern navbar */}
        <nav className="w-full flex justify-center h-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-chart-2/10 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-7xl flex justify-between items-center p-6 px-8">
            <div className="flex gap-8 items-center">
              <Link 
                href={"/"} 
                className="text-2xl font-bold gradient-text hover:scale-105 transition-transform"
              >
                AwardFlow
              </Link>
              <div className="hidden md:flex items-center gap-6">
              <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                
                <Link 
                  href="/awards" 
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  <Award className="h-4 w-4" />
                  Awards
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AuthButton />
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        <div className="flex-1 w-full">
          {children}
        </div>

        {/* Modern footer */}
        <footer className="w-full flex items-center justify-center py-16 border-t border-border">
          <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center gap-8 px-8">
            <div className="flex items-center gap-4">
              <div className="hexagon"></div>
              <span className="text-sm text-muted-foreground">
                © 2024 AwardFlow. Built with Next.js & Supabase
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}