import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { User, LogIn, UserPlus, Award } from "lucide-react";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4 card-modern px-4 py-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground">
            {user.email?.split('@')[0]}
          </span>
        </div>
      </div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-3">
      <Button 
        asChild 
        size="sm" 
        variant="outline"
        className="btn-secondary"
      >
        <Link href="/auth/login" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Sign in
        </Link>
      </Button>
      <Button 
        asChild 
        size="sm" 
        className="btn-primary"
      >
        <Link href="/auth/sign-up" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Sign up
        </Link>
      </Button>
    </div>
  );
}
