"use client";

import { useState } from "react";
import { Award, Search, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AwardsList } from "@/components/awards";
import { NavbarDemo } from "@/components/womp";

function AwardsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
        <div className="mb-16">
          <div className="text-center mb-12 animate-slide-in-up">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
              Browse <span className="gradient-text">Awards</span>
            </h1>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto animate-slide-in-up">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-2xl blur-xl" />
              <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Search awards, organizations, or keywords..."
                      className="pl-12 h-12 bg-background/50 border-border/50 text-lg focus:ring-2 focus:ring-primary/20"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <Button size="lg" className="btn-primary h-12 px-8">
                    <Filter className="mr-2 h-5 w-5" />
                    Advanced Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="animate-slide-in-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Award className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 animate-pulse-ring border-2 border-primary rounded-full" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Featured Awards
                </h2>
                <p className="text-muted-foreground">
                  Handpicked opportunities for you
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last updated: 2 hours ago</span>
              </div>
              <div className="hexagon" />
            </div>
          </div>

          {/* Morphing decoration */}
          <div className="absolute top-20 right-10 w-32 h-32 opacity-10 -z-10">
            <div className="morphing-shape" />
          </div>

          <AwardsList searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}

export default AwardsPage;
