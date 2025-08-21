"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";
import type { Award } from "./use-awards";

export function useAward(id: string) {
  const [award, setAward] = useState<Award | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!id) {
      setError("No award ID provided");
      setLoading(false);
      return;
    }

    fetchAward();
  }, [id]);

  const fetchAward = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("awards")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        throw new Error("Award not found");
      }

      // Transform the data to add computed fields
      const transformedAward: Award = {
        ...data,
        status: getAwardStatus(data.deadline),
      };

      setAward(transformedAward);

    } catch (err) {
      console.error("Error fetching award:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch award");
    } finally {
      setLoading(false);
    }
  };

  const getAwardStatus = (deadline: string): "open" | "closed" | "upcoming" => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    if (deadlineDate < now) {
      return "closed";
    } else if (deadlineDate <= thirtyDaysFromNow) {
      return "open";
    } else {
      return "upcoming";
    }
  };

  const refetch = () => {
    fetchAward();
  };

  return {
    award,
    loading,
    error,
    refetch,
  };
}
