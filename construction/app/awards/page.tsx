"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, AwardIcon, SortAsc, SortDesc, Loader2 } from "lucide-react"
import { AwardCard } from "@/components/award-card"
import { useAwards, type AwardFilters, type AwardSort } from "@/hooks/use-awards"

export default function AwardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState<"deadline" | "value" | "title" | "created_at">("deadline")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Prepare filters for the hook
  const filters: AwardFilters = useMemo(() => ({
    search: searchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  }), [searchTerm, selectedCategory])

  // Prepare sort for the hook
  const sort: AwardSort = useMemo(() => ({
    field: sortBy,
    direction: sortDirection,
  }), [sortBy, sortDirection])

  // Use the hook to fetch awards
  const { awards, loading, error, categories } = useAwards(filters, sort)

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedStatus("all")
  }

  const activeFiltersCount = [
    searchTerm,
    selectedCategory !== "all" ? selectedCategory : null,
    selectedStatus !== "all" ? selectedStatus : null,
  ].filter(Boolean).length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AwardIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Awards & Scholarships</h1>
        </div>
        <p className="text-muted-foreground">
          Discover scholarships, grants, bursaries, and awards available at the University of Guelph.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Awards
          </CardTitle>
          <CardDescription>Find awards that match your criteria and interests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search awards by title, description, or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories
                  .filter(category => category && category.trim() !== '')
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "deadline" | "value" | "title" | "created_at")}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="value">Value</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="created_at">Date Created</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Active Filters & Clear */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading awards...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="text-center py-12">
          <CardContent>
            <AwardIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading awards</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {!loading && !error && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {awards.length} award{awards.length !== 1 ? "s" : ""}
            {activeFiltersCount > 0 && " matching your criteria"}
          </p>
        </div>
      )}

      {/* Awards Grid */}
      {!loading && !error && awards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award) => (
            <AwardCard key={award.id} award={award} />
          ))}
        </div>
      ) : !loading && !error && awards.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <AwardIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No awards found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more awards.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
