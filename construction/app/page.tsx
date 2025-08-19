"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, DollarSign, Users } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"

// Mock featured awards data
const featuredAwards = [
  {
    id: "1",
    title: "Excellence in Engineering Scholarship",
    value: "$5,000",
    deadline: "2024-03-15",
    description: "Recognizing outstanding academic achievement in engineering programs.",
    applicants: 45,
    faculty: "College of Engineering and Physical Sciences",
  },
  {
    id: "2",
    title: "Community Leadership Award",
    value: "$2,500",
    deadline: "2024-04-01",
    description: "For students demonstrating exceptional community service and leadership.",
    applicants: 32,
    faculty: "All Faculties",
  },
  {
    id: "3",
    title: "Research Innovation Grant",
    value: "$3,000",
    deadline: "2024-03-30",
    description: "Supporting undergraduate research projects with innovative potential.",
    applicants: 28,
    faculty: "College of Biological Science",
  },
]

export default function HomePage() {
  const user = getCurrentUser()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Award className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to the Student Awards Portal</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover and apply for scholarships, awards, and grants at the University of Guelph. Your academic excellence
          and achievements deserve recognition.
        </p>
        {user?.role === "student" && (
          <Button size="lg" asChild>
            <Link href="/awards">
              Browse Awards
              <Award className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Awards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Available this academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">In awards and scholarships</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground">Submitted this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Awards */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Awards</h2>
          <Button variant="outline" asChild>
            <Link href="/awards">View All Awards</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAwards.map((award) => (
            <Card key={award.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{award.title}</CardTitle>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {award.value}
                  </Badge>
                </div>
                <CardDescription>{award.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Deadline: {new Date(award.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {award.applicants} applicants
                  </div>
                  <div className="text-sm text-muted-foreground">Faculty: {award.faculty}</div>
                  <div className="pt-2">
                    {user?.role === "student" ? (
                      <Button className="w-full" asChild>
                        <Link href={`/awards/${award.id}`}>Apply Now</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/awards/${award.id}`}>View Details</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Role-specific sections */}
      {user?.role === "student" && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your award applications and profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <Link href="/my-applications">View My Applications</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile">Update Profile</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/awards?filter=eligible">Awards I'm Eligible For</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === "reviewer" && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Reviewer Dashboard</CardTitle>
            <CardDescription>Review applications and manage award evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/reviewer-dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/awards">Browse All Awards</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === "admin" && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Manage awards, applications, and system settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/admin-dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/awards/create">Create New Award</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
