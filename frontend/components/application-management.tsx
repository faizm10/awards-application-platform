"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import ApplicationStatus from "./application-display"

interface ApplicationManagementProps {
  awardId: string
  userId: string
  user: any
  award: any
}

const ApplicationManagement: React.FC<ApplicationManagementProps> = ({ awardId, userId, user, award }) => {
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application
          </CardTitle>
          <CardDescription>Please log in to apply for this award</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="w-full">
            <a href={`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`}>Log in to Apply</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <ApplicationStatus awardId={awardId} userId={userId} />
}

export default ApplicationManagement
