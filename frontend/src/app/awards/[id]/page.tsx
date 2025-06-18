import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trophy, Calendar, DollarSign, Users, ArrowLeft, Mail, FileText, CheckCircle } from "lucide-react"
import { awards } from "@/lib/awards"
import { notFound } from "next/navigation"

interface AwardDetailPageProps {
  params: {
    id: string
  }
}

export default function AwardDetailPage({ params }: AwardDetailPageProps) {
  const award = awards.find((a) => a.id === params.id)

  if (!award) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/awards">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Awards
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Award Details</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Award Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl">{award.title}</CardTitle>
                  <Badge variant="secondary">{award.code}</Badge>
                </div>
                <CardDescription className="text-lg">Donor: {award.donor}</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">{award.category}</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Award Value</p>
                  <p className="font-semibold">{award.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Application Deadline</p>
                  <p className="font-semibold">{award.deadline}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Eligibility</p>
                  <p className="font-semibold">
                    {award.citizenship.includes("Non-Canadian-PR-PP") ? "All Students" : "Canadian/PR Only"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{award.description}</p>
          </CardContent>
        </Card>

        {/* Eligibility Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Eligibility Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{award.eligibility}</p>

            <Separator className="my-4" />

            <div>
              <h4 className="font-semibold mb-2">Citizenship Requirements:</h4>
              <div className="flex gap-2">
                {award.citizenship.map((citizenship) => (
                  <Badge key={citizenship} variant="outline">
                    {citizenship === "Canadian-PR-PP" ? "Canadian/Permanent Resident" : "International Students"}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              How to Apply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{award.applicationMethod}</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Application Deadline:</strong> {award.deadline}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Apply for This Award
          </Button>
          <Button variant="outline" size="lg">
            Save to Favorites
          </Button>
          <Button variant="outline" size="lg">
            Share Award
          </Button>
        </div>
      </div>
    </div>
  )
}
