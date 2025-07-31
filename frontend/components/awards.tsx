"use client";
// import { useAwards } from "@/app/hooks/useAwards"; // Commented out GraphQL/React Query
import type { Award } from "@/types/awards";
import { Button } from "./ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function AwardCard({ award }: { award: Award }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{award.title}</h3>
          {/* <p className="text-sm text-gray-600">Code: {award.code}</p> */}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">{award.value}</p>
          {/* <p className="text-sm text-gray-600">{award.category}</p> */}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 mb-2">{award.description}</p>
        <p className="text-sm text-gray-600">
          <strong>Donor:</strong> {award.donor}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">
          <strong>Eligibility:</strong>
        </p>
        <p className="text-sm text-gray-700">{award.eligibility}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">
          <strong>Application Method:</strong>
        </p>
        <p className="text-sm text-gray-700">{award.application_method}</p>
      </div>

      {award.citizenship.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">
            <strong>Citizenship Requirements:</strong>
          </p>
          <div className="flex flex-wrap gap-1">
            {award.citizenship.map((country, index) => (
              <span key={index} className="px-2 py-1  text-xs rounded">
                {country}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isDeadlineSoon(award.deadline)
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Deadline: {formatDate(award.deadline)}
        </span>
        <Link href={`/awards/${award.code}`}>
          <Button className="btn-primary group">
            More Information
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface AwardsListProps {
  searchTerm?: string;
  category?: string;
  minValue?: number;
  maxValue?: number;
  deadlineFilter?: string;
  citizenship?: string[];
  sortBy?: string;
}

export function AwardsList({ 
  searchTerm = "", 
  category = "All Categories",
  minValue = 0,
  maxValue = 100000,
  deadlineFilter = "all",
  citizenship = [],
  sortBy = "title"
}: AwardsListProps) {
  // const { data: awards, isLoading, error } = useAwards(); // Commented out GraphQL/React Query
  const [awards, setAwards] = useState<Award[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAwards = async () => {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .eq("is_active", true)
        .order("title", { ascending: true }); // Changed from "deadline" to "title"
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      setAwards(data || []);
      setIsLoading(false);
    };
    fetchAwards();
  }, []);

  // Helper function to extract numeric value from award value string
  const extractValue = (valueString: string): number => {
    const match = valueString.match(/\$?([\d,]+)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  };

  // Helper function to check if award meets deadline filter
  const meetsDeadlineFilter = (deadline: string): boolean => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (deadlineFilter) {
      case "this-week":
        return daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
      case "this-month":
        return daysUntilDeadline <= 30 && daysUntilDeadline >= 0;
      case "next-month":
        return daysUntilDeadline <= 60 && daysUntilDeadline > 30;
      case "past":
        return daysUntilDeadline < 0;
      default:
        return true;
    }
  };

  // Helper function to check if award meets citizenship filter
  const meetsCitizenshipFilter = (awardCitizenship: string[]): boolean => {
    if (citizenship.length === 0) return true;
    return citizenship.some(c => awardCitizenship.includes(c));
  };

  // Filter and sort awards
  const filteredAwards = (awards || [])
    .filter((award) => {
      // Search term filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          award.title.toLowerCase().includes(term) ||
          award.donor.toLowerCase().includes(term) ||
          award.code.toLowerCase().includes(term) ||
          award.description.toLowerCase().includes(term) ||
          award.eligibility.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (category !== "All Categories" && award.category !== category) {
        return false;
      }

      // Value range filter
      const awardValue = extractValue(award.value);
      if (awardValue < minValue || awardValue > maxValue) {
        return false;
      }

      // Deadline filter
      if (!meetsDeadlineFilter(award.deadline)) {
        return false;
      }

      // Citizenship filter
      if (!meetsCitizenshipFilter(award.citizenship)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "value-high":
          return extractValue(b.value) - extractValue(a.value);
        case "value-low":
          return extractValue(a.value) - extractValue(b.value);
        case "deadline":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "deadline-late":
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        default:
          return a.title.localeCompare(b.title);
      }
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading awards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold">Error Loading Awards</h3>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!awards || awards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <h3 className="text-lg font-semibold">No Awards Available</h3>
          <p className="text-sm text-gray-600 mt-2">
            There are currently no active awards to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Available Awards</h2>
        <span className="text-sm text-gray-600">
          {filteredAwards.length} awards found
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {filteredAwards.map((award) => (
          <Link
            key={award.id}
            href={`/awards/${award.code}`}
            className="block hover:shadow-lg transition-shadow"
          >
            <AwardCard award={award} />
          </Link>
        ))}
      </div>
    </div>
  );
}
