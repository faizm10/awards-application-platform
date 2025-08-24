"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, Award, Home, FileText, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { ROUTES, NAVIGATION_ITEMS, ADMIN_NAVIGATION_ITEMS, REVIEWER_NAVIGATION_ITEMS } from "@/constants/routes"

export function Navigation() {
  const { user, signOut, loading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut()
    setIsLoggingOut(false)
  }

  const getNavigationItems = (userRole: string) => {
    const baseItems = [{ href: ROUTES.HOME, label: "Home", icon: Home }]

    switch (userRole) {
      case "student":
        return [
          ...baseItems,
          { href: ROUTES.AWARDS, label: "Awards", icon: Award },
          { href: ROUTES.MY_APPLICATIONS, label: "My Applications", icon: FileText },
        ]
      case "reviewer":
        return [
          ...baseItems,
          { href: ROUTES.AWARDS, label: "Awards", icon: Award },
          { href: ROUTES.REVIEWER_DASHBOARD, label: "Dashboard", icon: BarChart3 },
        ]
      case "admin":
        return [
          ...baseItems,
          { href: ROUTES.AWARDS, label: "Awards", icon: Award },
          { href: ROUTES.ADMIN_DASHBOARD, label: "Admin Dashboard", icon: BarChart3 },
        ]
      default:
        return baseItems
    }
  }

  if (loading) {
    return (
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={ROUTES.HOME} className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">Student Awards Portal</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-muted h-8 w-16 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (!user) {
    return (
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={ROUTES.HOME} className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">Student Awards Portal</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Simple admin check - in a real app, this would come from user metadata
  const isAdmin = user.email?.includes('admin') || user.email?.includes('administrator')
  const userRole = isAdmin ? "admin" : "student"
  const navigationItems = getNavigationItems(userRole)
  const userName = user.email?.split('@')[0] || 'User'

  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href={ROUTES.HOME} className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Student Awards Portal</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {isAdmin ? (
                  <DropdownMenuItem asChild>
                    <Link href="/admin-dashboard" className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/my-applications" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      My Applications
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
