"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";

export interface Award {
  id: string;
  title: string;
  code: string;
  donor: string;
  value: string;
  deadline: string;
  citizenship: string[];
  description: string;
  eligibility: string;
  application_method: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Additional computed fields
  status: "open" | "closed" | "upcoming";
  application_count?: number;
}

export interface AwardFilters {
  search?: string;
  category?: string;
  citizenship?: string;
  is_active?: boolean;
}

export interface AwardSort {
  field: "deadline" | "value" | "title" | "created_at";
  direction: "asc" | "desc";
}

export function useAwards(filters?: AwardFilters, sort?: AwardSort) {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchAwards();
  }, [filters, sort]);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("awards")
        .select("*")
        .eq("is_active", true);

      // Apply filters
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      if (filters?.citizenship && filters.citizenship !== "all") {
        query = query.contains("citizenship", [filters.citizenship]);
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === "asc" });
      } else {
        // Default sorting by title ascending (alphabetical)
        query = query.order("title", { ascending: true });
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to add computed fields
      const transformedAwards = data?.map((award) => ({
        ...award,
        status: getAwardStatus(award.deadline),
      })) || [];

      setAwards(transformedAwards);

      // Extract unique categories for filters (filter out empty/null values)
      const uniqueCategories = [...new Set(transformedAwards.map(award => award.category))]
        .filter(category => category && category.trim() !== '')
        .sort();
      
      setCategories(uniqueCategories);

    } catch (err) {
      console.error("Error fetching awards:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch awards");
    } finally {
      setLoading(false);
    }
  };

  const getAwardById = async (id: string): Promise<Award | null> => {
    try {
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      return data ? {
        ...data,
        status: getAwardStatus(data.deadline),
      } : null;
    } catch (err) {
      console.error("Error fetching award by ID:", err);
      return null;
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
    fetchAwards();
  };

  return {
    awards,
    loading,
    error,
    categories,
    getAwardById,
    refetch,
  };
}
