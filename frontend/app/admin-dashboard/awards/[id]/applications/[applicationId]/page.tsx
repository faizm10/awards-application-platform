"use client"

import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ApplicationDetailContent } from "@/components/application-detail-content"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function AdminApplicationDetailContent() {
  const params = useParams()
  const awardId = typeof params.id === "string" ? params.id : ""
  const applicationId =
    typeof params.applicationId === "string" ? params.applicationId : ""
  const { userRole, loading } = useAuth()

  if (loading) {
    return null
  }

  if (userRole !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Admin access is required.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/admin-dashboard">Back to Admin Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!awardId || !applicationId) {
    return null
  }

  return (
    <ApplicationDetailContent
      params={Promise.resolve({ id: applicationId })}
      adminContext={{ awardId }}
    />
  )
}

export default function AdminApplicationDetailPage() {
  return (
    <ProtectedRoute>
      <AdminApplicationDetailContent />
    </ProtectedRoute>
  )
}
