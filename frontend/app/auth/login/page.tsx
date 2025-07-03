"use client";
import { LoginForm } from "@/components/login-form";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || undefined;
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm redirect={redirect} />
      </div>
    </div>
  );
}
