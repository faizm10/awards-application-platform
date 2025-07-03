import { createClient } from "@/lib/supabase/server";

export async function useDashboardData() {
  const supabase = await createClient();

  // Get user
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return { user: null, profile: null, error: error || new Error("No user") };
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", data.user.id)
    .single();

  return {
    user: data.user,
    profile: profile || null,
    error: profileError || null,
  };
} 