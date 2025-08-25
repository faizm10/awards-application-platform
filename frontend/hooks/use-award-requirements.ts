"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";

export interface AwardRequiredField {
  id: string;
  award_id: string;
  field_name: string;
  label: string;
  type: "file" | "text" | "textarea";
  required: boolean;
  question?: string;
  field_config?: any;
  description?: string;
  created_at: string;
}

export function useAwardRequirements(awardId: string) {
  const [requirements, setRequirements] = useState<AwardRequiredField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!awardId) {
      setError("No award ID provided");
      setLoading(false);
      return;
    }

    fetchRequirements();
  }, [awardId]);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("award_required_fields")
        .select("*")
        .eq("award_id", awardId)
        .order("created_at", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setRequirements(data || []);

    } catch (err) {
      console.error("Error fetching award requirements:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch requirements");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchRequirements();
  };

  return {
    requirements,
    loading,
    error,
    refetch,
  };
}
