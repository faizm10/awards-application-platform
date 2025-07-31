"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-lg px-6 py-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Signing out...</span>
          </div>
        </div>
      )}
      <Button 
        onClick={logout}
        size="sm"
        variant="ghost"
        disabled={isLoading}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </>
  );
}