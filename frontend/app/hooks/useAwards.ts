import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Award } from "@/types/awards";
const supabase = createClient();
export function useAwards() {
  return useQuery({
    queryKey: ["awards"],
    queryFn: async (): Promise<Award[]> => {
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .eq("is_active", true)
        .order("deadline", { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch awards: ${error.message}`);
      }

      return data || [];
    },
  });
}
export function fetchAwardsDetails(code: string) {
  return useQuery({
    queryKey: ["awards"],
    queryFn: async (): Promise<Award[]> => {
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .eq("code", code);
      if (error) {
        throw new Error(`Failed to fetch awards: ${error.message}`);
      }

      return data || [];
    },
  });
}
