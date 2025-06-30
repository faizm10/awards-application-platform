"use client";
import { useAwards } from "@/app/hooks/useAwards";
import type { Award } from "@/types/awards";
import { Button } from "./ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
          <p className="text-sm text-gray-600">Code: {award.code}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">{award.value}</p>
          <p className="text-sm text-gray-600">{award.category}</p>
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
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
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
            Apply Now
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function AwardsList() {
  const { data: awards, isLoading, error } = useAwards();

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
          <p className="text-sm text-gray-600 mt-2">
            {error instanceof Error ? error.message : "Failed to load awards"}
          </p>
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
          {awards.length} awards found
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {awards.map((award) => (
          <AwardCard key={award.id} award={award} />
        ))}
      </div>
    </div>
  );
}
