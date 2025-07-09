import { createClient } from "@/lib/supabase/server";

export async function useDashboardData() {
  const supabase = await createClient();

  // Get user
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return {
      user: null,
      profile: null,
      applications: [],
      error: error || new Error("No user"),
    };
  }

  // Fetch profile (include full_name)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type, full_name")
    .eq("id", data.user.id)
    .single();

  // Fetch recent applications (with award info)
  const { data: applications, error: appError } = await supabase
    .from("applications")
    .select("*, award:awards(*)")
    .eq("student_id", data.user.id)
    .order("submitted_at", { ascending: false })
    .limit(5);

  return {
    user: data.user,
    profile: profile || null,
    applications: applications || [],
    error: profileError || appError || null,
  };
}