"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { NavbarDemo } from "@/components/womp"
import type { Award } from "@/types/awards"
import ApplicationManagement from "@/components/application-management"

const AwardDetailPage = () => {
  const params = useParams()
  const code = params.code as string
  const [award, setAward] = useState<Award | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchAward = async () => {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      const { data, error } = await supabase.from("awards").select("*").eq("code", code).single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setAward(data)
      setLoading(false)
    }

    if (code) fetchAward()
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center geometric-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error || !award) {
    notFound()
  }

  return (
    <div className="min-h-screen geometric-bg">
      {/* Navigation */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-2">
        <NavbarDemo />
      </div>

      {/* Hero Banner */}
      <div className="relative w-full bg-gradient-to-br from-primary/10 via-chart-2/10 to-background rounded-b-3xl shadow-lg overflow-hidden mb-12">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold gradient-text mb-4 drop-shadow-lg">{award.title}</h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 6v6l4 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {award.donor}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <InfoCard
              icon={
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              label="Category"
              value={award.category}
            />
            <InfoCard
              icon={
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              label="Value"
              value={award.value}
            />
            <InfoCard
              icon={
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              label="Deadline"
              value={new Date(award.deadline).toLocaleDateString()}
              className={(() => {
                const days = (new Date(award.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                return days < 7 ? "border border-primary bg-primary/10 text-primary" : ""
              })()}
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-40 h-40 floating-element opacity-20 -z-10" />
        <div className="absolute bottom-0 right-0 w-40 h-40 floating-element opacity-10 -z-10" />
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 gap-10 relative z-10">
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Award Details Sections */}
          <section className="card-modern p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 4v16m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Description
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">{award.description}</p>
          </section>

          <section className="card-modern p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Eligibility
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">{award.eligibility}</p>
          </section>

          <section className="card-modern p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Application Method
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">{award.application_method}</p>
          </section>

          <section className="card-modern p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              Citizenship
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {award.citizenship && award.citizenship.join(", ")}
            </p>
          </section>

          {/* Application Management Section */}
          <ApplicationManagement awardId={award.id} userId={user?.id} user={user} award={award} />
        </div>
      </div>
    </div>
  )
}

// Helper component (keeping your existing InfoCard)
const InfoCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  className?: string
}> = ({ icon, label, value, className = "" }) => (
  <div
    className={`flex flex-col items-center justify-center p-4 rounded-xl shadow card-modern min-w-[120px] ${className}`}
  >
    <div className="mb-2">{icon}</div>
    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</div>
    <div className="text-lg font-bold mt-1">{value}</div>
  </div>
)

export default AwardDetailPage
