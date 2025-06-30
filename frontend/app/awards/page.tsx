import { Award, Search, Filter, Star, Clock, DollarSign, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AwardsPage() {
  
  const awards = [
    {
      id: 1,
      title: "Merit Scholarship",
      organization: "University Foundation",
      amount: "$10,000",
      deadline: "2024-03-15",
      category: "Academic Excellence",
      description: "Awarded to students with outstanding academic performance and leadership qualities.",
      requirements: ["GPA 3.8+", "Leadership experience", "Essay submission"],
      featured: true
    },
    {
      id: 2,
      title: "Research Grant",
      organization: "National Science Foundation",
      amount: "$5,000",
      deadline: "2024-04-01",
      category: "Research",
      description: "Funding for innovative research projects in STEM fields.",
      requirements: ["Research proposal", "Faculty recommendation", "GPA 3.5+"],
      featured: false
    },
    {
      id: 3,
      title: "Leadership Award",
      organization: "Student Leadership Council",
      amount: "$2,500",
      deadline: "2024-03-30",
      category: "Leadership",
      description: "Recognition for outstanding leadership and community service.",
      requirements: ["Leadership role", "Community service", "Essay submission"],
      featured: true
    },
    {
      id: 4,
      title: "Creative Arts Scholarship",
      organization: "Arts Foundation",
      amount: "$8,000",
      deadline: "2024-04-15",
      category: "Arts",
      description: "Support for students pursuing creative arts and design.",
      requirements: ["Portfolio submission", "Creative essay", "GPA 3.0+"],
      featured: false
    },
    {
      id: 5,
      title: "International Student Grant",
      organization: "Global Education Fund",
      amount: "$15,000",
      deadline: "2024-05-01",
      category: "International",
      description: "Financial support for international students pursuing higher education.",
      requirements: ["International student", "Financial need", "Academic merit"],
      featured: true
    },
    {
      id: 6,
      title: "Technology Innovation Award",
      organization: "Tech Innovation Institute",
      amount: "$12,000",
      deadline: "2024-04-30",
      category: "Technology",
      description: "Award for innovative technology projects and startups.",
      requirements: ["Innovation project", "Business plan", "Technical skills"],
      featured: false
    }
  ];

  const categories = [
    "All Categories",
    "Academic Excellence",
    "Research",
    "Leadership",
    "Arts",
    "International",
    "Technology"
  ];

  return (
    <div className="min-h-screen geometric-bg">
      {/* Floating Elements */}
      <div className="floating-element" style={{ top: '10%', left: '5%' }}></div>
      <div className="floating-element" style={{ bottom: '20%', right: '10%' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Discover <span className="gradient-text">Awards</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find scholarships, grants, and awards that match your profile and academic goals
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search awards, organizations, or keywords..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="card-modern">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className={index === 0 ? "btn-primary" : "btn-secondary"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Awards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-chart-3" />
            Featured Awards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.filter(award => award.featured).map((award) => (
              <Card key={award.id} className="card-modern group hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                        {award.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {award.organization}
                      </CardDescription>
                    </div>
                    <div className="p-2 rounded-full bg-gradient-to-r from-chart-3/20 to-chart-4/20">
                      <Star className="h-4 w-4 text-chart-3" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {award.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {award.amount}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-3 w-3" />
                      {award.deadline}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-full bg-gradient-to-r from-primary/20 to-chart-2/20 text-xs text-primary">
                      {award.category}
                    </div>
                  </div>
                  <Button className="w-full btn-primary">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Awards */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            All Awards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => (
              <Card key={award.id} className="card-modern group hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                        {award.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {award.organization}
                      </CardDescription>
                    </div>
                    {award.featured && (
                      <div className="p-2 rounded-full bg-gradient-to-r from-chart-3/20 to-chart-4/20">
                        <Star className="h-4 w-4 text-chart-3" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {award.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {award.amount}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-3 w-3" />
                      {award.deadline}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-full bg-gradient-to-r from-primary/20 to-chart-2/20 text-xs text-primary">
                      {award.category}
                    </div>
                  </div>
                  <Button className="w-full btn-primary">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 