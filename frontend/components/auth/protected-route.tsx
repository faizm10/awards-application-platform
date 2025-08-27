"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              Please sign in to access this page.
            </p>
            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href={`/auth/sign-up?redirect=${encodeURIComponent(pathname)}`}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
