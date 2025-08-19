import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, DollarSign, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { Award } from "@/lib/awards"
import { getCurrentUser } from "@/lib/auth"

interface AwardCardProps {
  award: Award
}

export function AwardCard({ award }: AwardCardProps) {
  const user = getCurrentUser()
  const isStudent = user?.role === "student"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-red-100 text-red-800 border-red-200"
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scholarship":
        return "bg-primary/10 text-primary border-primary/20"
      case "grant":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "bursary":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "prize":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const applicationProgress = award.maxApplications ? (award.applicationCount / award.maxApplications) * 100 : 0

  const isDeadlineSoon = () => {
    const deadline = new Date(award.deadline)
    const now = new Date()
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{award.title}</CardTitle>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Badge variant="outline" className={getStatusColor(award.status)}>
              {award.status}
            </Badge>
            <Badge variant="outline" className={getTypeColor(award.awardType)}>
              {award.awardType}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm">{award.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-semibold text-primary">
              <DollarSign className="h-4 w-4 mr-1" />
              {award.value}
            </div>
            {isDeadlineSoon() && (
              <div className="flex items-center text-sm text-orange-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                Deadline Soon
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Deadline: {new Date(award.deadline).toLocaleDateString()}
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              {award.applicationCount} applicants
              {award.maxApplications && ` / ${award.maxApplications} max`}
            </div>
          </div>

          {award.maxApplications && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Application Progress</span>
                <span>{Math.round(applicationProgress)}%</span>
              </div>
              <Progress value={applicationProgress} className="h-2" />
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <strong>Faculty:</strong> {award.faculty}
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Key Requirements:</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              {award.eligibility.slice(0, 2).map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>{req}</span>
                </li>
              ))}
              {award.eligibility.length > 2 && (
                <li className="text-muted-foreground">+{award.eligibility.length - 2} more requirements</li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-4 mt-auto">
          {award.status === "open" && isStudent ? (
            <Button className="w-full" asChild>
              <Link href={`/awards/${award.id}`}>Apply Now</Link>
            </Button>
          ) : award.status === "closed" ? (
            <Button variant="outline" className="w-full bg-transparent" disabled>
              Applications Closed
            </Button>
          ) : award.status === "upcoming" ? (
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href={`/awards/${award.id}`}>View Details</Link>
            </Button>
          ) : (
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href={`/awards/${award.id}`}>View Details</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
