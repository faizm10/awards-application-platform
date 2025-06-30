"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Calendar, DollarSign, Users, ArrowLeft, Search, Filter, Star, Clock, Globe, Award, TrendingUp, Zap } from 'lucide-react'
import { awards } from "@/lib/awards"

export default function AwardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("deadline")

  // Featured awards (first 3)
  const featuredAwards = awards.slice(0, 3)
  const regularAwards = awards.slice(3)

  const getCardVariant = (index: number) => {
    const variants = ['default', 'large', 'wide']
    return variants[index % variants.length]
  }

  const getGradientClass = (category: string) => {
    const gradients = {
      'Business & Economics': 'from-blue-500 to-cyan-500',
      'Engineering': 'from-purple-500 to-pink-500',
      'Science': 'from-green-500 to-emerald-500',
      'Arts': 'from-orange-500 to-red-500',
      'Medicine': 'from-indigo-500 to-purple-500',
      'default': 'from-gray-500 to-gray-600'
    }
    return gradients[category as keyof typeof gradients] || gradients.default
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Browse Awards
                  </h1>
                  <p className="text-sm text-gray-500">Discover opportunities that match your goals</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{awards.length} opportunities available</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search and Filters */}
        <div className="mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    placeholder="Search awards by title, donor, or keyword..." 
                    className="pl-12 h-12 bg-white/80 border-white/30 rounded-xl text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-48 h-12 bg-white/80 border-white/30 rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="business">Business & Economics</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48 h-12 bg-white/80 border-white/30 rounded-xl">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="value">Award Value</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['All', 'Scholarships', 'Research Grants', 'Travel Awards', 'Achievement Awards'].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-white/60 border-white/30 hover:bg-blue-50"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Awards Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <Star className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Awards</h2>
            <Badge className="bg-yellow-100 text-yellow-800">Hot</Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredAwards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${getGradientClass(award.category)}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={`bg-gradient-to-r ${getGradientClass(award.category)} text-white border-0`}>
                        {award.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">Featured</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/awards/${award.id}`}>
                        {award.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {award.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-green-100 rounded">
                          <DollarSign className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-green-700">{award.value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-orange-100 rounded">
                          <Clock className="h-3 w-3 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-600">Due {award.deadline}</span>
                      </div>
                    </div>
                    
                    <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0">
                      <Link href={`/awards/${award.id}`}>
                        <Award className="h-4 w-4 mr-2" />
                        Apply Now
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* All Awards Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">All Awards</h2>
            </div>
            <div className="text-sm text-gray-600">
              {awards.length} opportunities
            </div>
          </div>

          {/* Masonry-style Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {regularAwards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 3) * 0.05 }}
                className="break-inside-avoid"
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group mb-6">
                  <div className={`h-1 bg-gradient-to-r ${getGradientClass(award.category)}`} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        {award.code}
                      </Badge>
                      <Badge className={`bg-gradient-to-r ${getGradientClass(award.category)} text-white border-0 text-xs`}>
                        {award.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/awards/${award.id}`}>
                        {award.title}
                      </Link>
                    </h3>
                    
                    <p className="text-xs text-gray-500 mb-3">Donor: {award.donor}</p>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {award.description}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-green-100 rounded">
                          <DollarSign className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-green-700">{award.value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-orange-100 rounded">
                          <Calendar className="h-3 w-3 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-600">Deadline: {award.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-blue-100 rounded">
                          <Globe className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {award.citizenship.includes("Non-Canadian-PR-PP") ? "All Students" : "Canadian/PR Only"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {award.citizenship.map((citizenship) => (
                        <Badge 
                          key={citizenship} 
                          variant="outline" 
                          className="text-xs border-gray-200 text-gray-600"
                        >
                          {citizenship === "Canadian-PR-PP" ? "Canadian/PR" : "International"}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button asChild size="sm" className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
                      <Link href={`/awards/${award.id}`}>
                        View Details
                        <ArrowLeft className="h-3 w-3 ml-2 rotate-180" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            Load More Awards
          </Button>
        </div>
      </div>
    </div>
  )
}
