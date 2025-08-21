"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Mail, CheckCircle } from "lucide-react";

export default function SignUpSuccessPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Account created successfully!</h1>
                <p className="text-muted-foreground">
                  We've sent a verification email to your inbox. Please check your email and click the verification link to complete your registration.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Check your email for the verification link
                </span>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/awards">
                    Browse Awards
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Try signing in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
