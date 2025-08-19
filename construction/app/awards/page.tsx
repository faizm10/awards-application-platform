"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, AwardIcon, SortAsc, SortDesc } from "lucide-react"
import { AwardCard } from "@/components/award-card"
import { getAwards, getFaculties } from "@/lib/awards"

type SortOption = "deadline" | "value" | "title" | "applications"
type SortDirection = "asc" | "desc"

export default function AwardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("deadline")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const faculties = getFaculties()

  const filteredAndSortedAwards = useMemo(() => {
    const filtered = getAwards({
      search: searchTerm,
      faculty: selectedFaculty,
      awardType: selectedType,
      status: selectedStatus,
    })

    return filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "deadline":
          comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          break
        case "value":
          const aValue = Number.parseInt(a.value.replace(/[$,]/g, ""))
          const bValue = Number.parseInt(b.value.replace(/[$,]/g, ""))
          comparison = aValue - bValue
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "applications":
          comparison = a.applicationCount - b.applicationCount
          break
      }

      return sortDirection === "desc" ? -comparison : comparison
    })
  }, [searchTerm, selectedFaculty, selectedType, selectedStatus, sortBy, sortDirection])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedFaculty("all")
    setSelectedType("all")
    setSelectedStatus("all")
  }

  const activeFiltersCount = [
    searchTerm,
    selectedFaculty !== "all" ? selectedFaculty : null,
    selectedType !== "all" ? selectedType : null,
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
            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
              <SelectTrigger>
                <SelectValue placeholder="All Faculties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Faculties</SelectItem>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Award Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="scholarship">Scholarship</SelectItem>
                <SelectItem value="grant">Grant</SelectItem>
                <SelectItem value="bursary">Bursary</SelectItem>
                <SelectItem value="prize">Prize</SelectItem>
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
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="value">Value</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="applications">Applications</SelectItem>
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

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredAndSortedAwards.length} award{filteredAndSortedAwards.length !== 1 ? "s" : ""}
          {activeFiltersCount > 0 && " matching your criteria"}
        </p>
      </div>

      {/* Awards Grid */}
      {filteredAndSortedAwards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedAwards.map((award) => (
            <AwardCard key={award.id} award={award} />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  )
}
