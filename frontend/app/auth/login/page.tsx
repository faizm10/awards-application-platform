"use client";
import { LoginForm } from "@/components/auth/login-form";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || undefined;
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <LoginForm redirect={redirect} />
      </div>
    </div>
  );
}
