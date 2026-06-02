"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  ApplicationDetailContent,
  type ApplicationDetailPageProps,
} from "@/components/application-detail-content"

export default function ApplicationDetailPage(props: ApplicationDetailPageProps) {
  return (
    <ProtectedRoute>
      <ApplicationDetailContent {...props} />
    </ProtectedRoute>
  )
}
