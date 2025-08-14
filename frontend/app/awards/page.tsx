"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Search,
  Filter,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AwardsList } from "@/components/awards";
import { NavbarDemo } from "@/components/womp";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterState {
  searchTerm: string;
  category: string;
  minValue: number;
  maxValue: number;
  deadlineFilter: string;
  citizenship: string[];
  sortBy: string;
  showAdvanced: boolean;
}

function AwardsPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    category: "All Categories",
    minValue: 0,
    maxValue: 100000,
    deadlineFilter: "all",
    citizenship: [],
    sortBy: "title",
    showAdvanced: false,
  });

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableCitizenships, setAvailableCitizenships] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch("/api/awards/filter-options");
        if (response.ok) {
          const data = await response.json();
          setAvailableCategories(data.categories || []);
          setAvailableCitizenships(data.citizenships || []);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleDeadlineFilterChange = (filter: string) => {
    setFilters((prev) => ({ ...prev, deadlineFilter: filter }));
  };

  const handleCitizenshipToggle = (citizenship: string) => {
    setFilters((prev) => ({
      ...prev,
      citizenship: prev.citizenship.includes(citizenship)
        ? prev.citizenship.filter((c) => c !== citizenship)
        : [...prev.citizenship, citizenship],
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: "",
      category: "All Categories",
      minValue: 0,
      maxValue: 100000,
      deadlineFilter: "all",
      citizenship: [],
      sortBy: "title",
      showAdvanced: false,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.category !== "All Categories") count++;
    if (filters.minValue > 0 || filters.maxValue < 100000) count++;
    if (filters.deadlineFilter !== "all") count++;
    if (filters.citizenship.length > 0) count++;
    return count;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen geometric-bg">
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 floating-element animate-wave opacity-60" />
      <div className="fixed top-40 right-20 floating-element animate-wave opacity-40" />
      <div className="fixed bottom-32 left-1/4 floating-element animate-wave opacity-30" />

      <div className="max-w-7xl mx-auto p-8 relative z-10">
        {/* Navigation */}
        <div className="mb-36">
          <NavbarDemo />
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center mb-8 animate-slide-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse <span className="gradient-text">Awards</span>
            </h1>
          </div>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto animate-slide-in-up">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-xl blur-lg" />
              <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Search awards, organizations, or keywords..."
                      className="pl-10 h-10 bg-background/50 border-border/50 text-base focus:ring-2 focus:ring-primary/20"
                      value={filters.searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          // Scroll to awards list
                          const awardsSection = document.getElementById('awards-section');
                          if (awardsSection) {
                            awardsSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }}
                    />
                  </div>
                  <Button
                    size="default"
                    className="btn-primary h-10 px-6"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        showAdvanced: !prev.showAdvanced,
                      }))
                    }
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Advanced Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Advanced Filters */}
                <Collapsible open={filters.showAdvanced}>
                  <CollapsibleContent className="space-y-6 pt-6 border-t border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Category Filter */}
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={filters.category}
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Categories">
                              All Categories
                            </SelectItem>
                            {availableCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Deadline Filter */}
                      <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Select
                          value={filters.deadlineFilter}
                          onValueChange={handleDeadlineFilterChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select deadline filter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Deadlines</SelectItem>
                            <SelectItem value="this-week">This Week</SelectItem>
                            <SelectItem value="this-month">
                              This Month
                            </SelectItem>
                            <SelectItem value="next-month">
                              Next Month
                            </SelectItem>
                            <SelectItem value="past">Past Deadline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sort By */}
                      <div className="space-y-2">
                        <Label htmlFor="sort">Sort By</Label>
                        <Select
                          value={filters.sortBy}
                          onValueChange={handleSortChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="title">Title (A-Z)</SelectItem>
                            <SelectItem value="value-high">
                              Value (High to Low)
                            </SelectItem>
                            <SelectItem value="value-low">
                              Value (Low to High)
                            </SelectItem>
                            <SelectItem value="deadline">
                              Deadline (Soonest)
                            </SelectItem>
                            <SelectItem value="deadline-late">
                              Deadline (Latest)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Citizenship Filter */}
                    {availableCitizenships.length > 0 && (
                      <div className="space-y-3">
                        <Label>Citizenship Requirements</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableCitizenships.map((citizenship) => (
                            <div
                              key={citizenship}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={citizenship}
                                checked={filters.citizenship.includes(
                                  citizenship
                                )}
                                onCheckedChange={() =>
                                  handleCitizenshipToggle(citizenship)
                                }
                              />
                              <Label htmlFor={citizenship} className="text-sm">
                                {citizenship}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clear Filters */}
                    {getActiveFiltersCount() > 0 && (
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          onClick={clearAllFilters}
                          className="flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div id="awards-section" className="animate-slide-in-up">
          {/* Morphing decoration */}
          <div className="absolute top-20 right-10 w-32 h-32 opacity-10 -z-10">
            <div className="morphing-shape" />
          </div>

          <AwardsList
            searchTerm={filters.searchTerm}
            category={filters.category}
            minValue={filters.minValue}
            maxValue={filters.maxValue}
            deadlineFilter={filters.deadlineFilter}
            citizenship={filters.citizenship}
            sortBy={filters.sortBy}
          />
        </div>
      </div>
    </div>
  );
}

export default AwardsPage;
