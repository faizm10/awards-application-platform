import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Award } from "@/hooks/use-awards";
import { getCurrentUser } from "@/lib/auth";
import { ROUTES } from "@/constants/routes";
import { useApplications } from "@/hooks/use-applications";

interface AwardCardProps {
  award: Award;
}

export function AwardCard({ award }: AwardCardProps) {
  const user = getCurrentUser();
  const isStudent = user?.role === "student";
  const { hasAppliedToAward, getApplicationStatus } = useApplications();
  
  const hasApplied = hasAppliedToAward(award.id);
  const applicationStatus = getApplicationStatus(award.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scholarship":
        return "bg-primary/10 text-primary border-primary/20";
      case "grant":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      case "bursary":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "prize":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const applicationProgress = award.application_count
    ? (award.application_count / 100) * 100
    : 0;

  const isDeadlineSoon = () => {
    const deadline = new Date(award.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{award.title}</CardTitle>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Badge variant="outline" className={getTypeColor(award.category)}>
              {award.category}
            </Badge>
            {hasApplied && (
              <Badge 
                variant="secondary" 
                className={
                  applicationStatus === "submitted" 
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                }
              >
                {applicationStatus === "submitted" ? "✓ Submitted" : "📝 Draft"}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-sm">
          {award.description}
        </CardDescription>
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
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Eligibility:</div>
            <div className="text-xs text-muted-foreground">
              {award.eligibility}
            </div>
          </div>
        </div>

        <div className="pt-4 mt-auto">
          {award.status === "open" && isStudent ? (
            hasApplied ? (
              <Button 
                variant="outline" 
                className={
                  applicationStatus === "submitted"
                    ? "w-full bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                    : "w-full bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
                } 
                asChild
              >
                <Link href={ROUTES.AWARD_DETAILS(award.id)}>
                  {applicationStatus === "submitted" ? "✓ View Application" : "📝 Continue Draft"}
                </Link>
              </Button>
            ) : (
              <Button className="w-full" asChild>
                <Link href={ROUTES.AWARD_DETAILS(award.id)}>Apply Now</Link>
              </Button>
            )
          ) : award.status === "closed" ? (
            <Button
              variant="outline"
              className="w-full bg-transparent"
              disabled
            >
              Applications Closed
            </Button>
          ) : award.status === "upcoming" ? (
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href={ROUTES.AWARD_DETAILS(award.id)}>View Details</Link>
            </Button>
          ) : (
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href={ROUTES.AWARD_DETAILS(award.id)}>View Details</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
