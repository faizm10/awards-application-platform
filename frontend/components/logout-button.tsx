"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button 
      onClick={logout}
      size="sm"
      variant="ghost"
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
