"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Eye, Loader2, Search, Users } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  getApplicationsByAward,
  getStatusColor,
  getStatusLabel,
  type Application,
} from "@/lib/applications"
import { createClient } from "@/supabase/client"
import { formatSupabaseError } from "@/lib/supabase-errors"

function applicantName(app: Application): string {
  const student = app.student as { full_name?: string; first_name?: string; last_name?: string } | undefined
  if (student?.full_name?.trim()) return student.full_name.trim()
  const fromProfile = [student?.first_name, student?.last_name].filter(Boolean).join(" ").trim()
  if (fromProfile) return fromProfile
  const fromApp = [app.first_name, app.last_name].filter(Boolean).join(" ").trim()
  if (fromApp) return fromApp
  return "Unknown applicant"
}

function applicantEmail(app: Application): string {
  const student = app.student as { email?: string } | undefined
  return app.email || student?.email || "—"
}

function AdminAwardApplicationsContent() {
  const params = useParams()
  const awardId = typeof params.id === "string" ? params.id : ""
  const { userRole, loading: authLoading } = useAuth()
  const [awardTitle, setAwardTitle] = useState("")
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const isAdmin = userRole === "admin"

  useEffect(() => {
    if (authLoading || !awardId) return
    if (!isAdmin) {
      setLoading(false)
      return
    }

    let cancelled = false
    const supabase = createClient()

    const load = async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const { data: award, error: awardError } = await supabase
          .from("awards")
          .select("id, title")
          .eq("id", awardId)
          .single()

        if (awardError) throw new Error(formatSupabaseError(awardError))
        if (!award) throw new Error("Award not found.")

        const { data: apps, error: appsError } = await getApplicationsByAward(awardId)
        if (cancelled) return
        if (appsError) throw new Error(appsError)
        setAwardTitle(award.title)
        setApplications(apps)
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Failed to load applications.")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [authLoading, awardId, isAdmin])

  const filtered = applications.filter((app) => {
    const q = searchTerm.toLowerCase()
    if (!q) return true
    return (
      applicantName(app).toLowerCase().includes(q) ||
      applicantEmail(app).toLowerCase().includes(q) ||
      (app.student_id_text || "").toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q)
    )
  })

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Admin access is required to view applications.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/admin-dashboard">Back to Admin Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-destructive mb-4">{loadError}</p>
            <Button variant="outline" asChild>
              <Link href="/admin-dashboard">Back to Admin Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/admin-dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Link>
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Applications
          </CardTitle>
          <CardDescription>
            {awardTitle} — {applications.length} application
            {applications.length === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, student ID, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {applications.length === 0
                ? "No applications have been submitted for this award yet."
                : "No applications match your search."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{applicantName(app)}</TableCell>
                    <TableCell>{applicantEmail(app)}</TableCell>
                    <TableCell>{app.student_id_text || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(app.status)}>
                        {getStatusLabel(app.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {app.submitted_at
                        ? new Date(app.submitted_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/admin-dashboard/awards/${awardId}/applications/${app.id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminAwardApplicationsPage() {
  return (
    <ProtectedRoute>
      <AdminAwardApplicationsContent />
    </ProtectedRoute>
  )
}
