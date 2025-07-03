"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Award } from "@/types/awards";
import { notFound, useParams } from "next/navigation";
import { NavbarDemo } from "@/components/womp";

const AwardDetailPage = () => {
  const params = useParams();
  const code = params.code as string;

  const [award, setAward] = useState<Award | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAward = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .eq("code", code)
        .single();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setAward(data);
      setLoading(false);
    };
    if (code) fetchAward();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center geometric-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !award) {
    console.log("params.code:", code);
    console.log("award:", award);
    console.log("error:", error);
    notFound();
  }

  return (
    <div className="min-h-screen geometric-bg">
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 floating-element animate-wave opacity-60" />
      <div className="fixed top-40 right-20 floating-element animate-wave opacity-40" />
      <div className="fixed bottom-32 left-1/4 floating-element animate-wave opacity-30" />

      <div className="max-w-7xl mx-auto p-8 relative z-10">
        {/* Navigation */}
        <div className="mb-36">
          <NavbarDemo />
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="text-center mb-12 animate-slide-in-up">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
              <span className="gradient-text">{award.title}</span>
            </h1>
          </div>
        </div>
        <div className="card-modern p-8 w-full">
          <h1 className="text-3xl font-bold mb-2 gradient-text">
            {award.title}
          </h1>
          <div className="mb-4 text-muted-foreground">{award.donor}</div>
          <div className="mb-4">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full mr-2">
              {award.category}
            </span>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {award.value}
            </span>
          </div>
          <div className="mb-4">
            <strong>Deadline:</strong>{" "}
            {new Date(award.deadline).toLocaleDateString()}
          </div>
          <div className="mb-4">
            <strong>Description:</strong>
            <p>{award.description}</p>
          </div>
          <div className="mb-4">
            <strong>Eligibility:</strong>
            <p>{award.eligibility}</p>
          </div>
          <div className="mb-4">
            <strong>Application Method:</strong> {award.application_method}
          </div>
          <div className="mb-4">
            <strong>Citizenship:</strong>{" "}
            {award.citizenship && award.citizenship.join(", ")}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              How to Apply
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Review the eligibility criteria above to ensure you qualify.
              </li>
              <li>
                Prepare the required documents (e.g., transcripts, essays,
                references).
              </li>
              <li>
                Complete the online application form
                {/* <a
                  href={
                    "application_link" in award &&
                    (award as any).application_link
                      ? (award as any).application_link
                      : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline ml-1"
                >
                  Apply Here
                </a> */}
              </li>
              <li>
                Submit your application before{" "}
                <strong>{new Date(award.deadline).toLocaleDateString()}</strong>
                .
              </li>
              <li>Wait for confirmation and further instructions via email.</li>
            </ol>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                For questions, contact:{" "}
                <a
                  href={`mailto:${
                    "contact_email" in award && (award as any).contact_email
                      ? (award as any).contact_email
                      : "awards@university.edu"
                  }`}
                  className="underline"
                >
                  {"contact_email" in award && (award as any).contact_email
                    ? (award as any).contact_email
                    : "awards@university.edu"}
                </a>
              </span>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="/awards"
              className="btn-secondary px-4 py-2 rounded font-semibold inline-block"
            >
              Back to Awards
            </a>
            <a
              href={`/apply/${award.code}`}
              className="btn-secondary px-4 py-2 rounded font-semibold inline-block"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardDetailPage;
