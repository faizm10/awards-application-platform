"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Calendar,
  DollarSign,
  ArrowLeft,
  Mail,
  FileText,
  CheckCircle,
  Star,
  Share2,
  Heart,
  Clock,
  Globe,
  Award,
  BookOpen,
  Target,
  AlertCircle,
  ExternalLink,
  Download,
} from "lucide-react"
import { awards } from "@/lib/awards"
import { notFound } from "next/navigation"

export default function Page({ params }: { params: { id: string } }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const award = awards.find((a) => a.id === params.id)

  if (!award) {
    notFound()
  }

  const getGradientClass = (category: string) => {
    const gradients = {
      "Business & Economics": "from-blue-500 to-cyan-500",
      Engineering: "from-purple-500 to-pink-500",
      Science: "from-green-500 to-emerald-500",
      Arts: "from-orange-500 to-red-500",
      Medicine: "from-indigo-500 to-purple-500",
      default: "from-gray-500 to-gray-600",
    }
    return gradients[category as keyof typeof gradients] || gradients.default
  }

  // Calculate days until deadline (mock calculation)
  const daysUntilDeadline = 45
  const progressPercentage = Math.max(0, 100 - (daysUntilDeadline / 90) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50">
                <Link href="/awards">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Awards
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-gradient-to-r ${getGradientClass(award.category)} rounded-xl`}>
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Award Details
                  </h1>
                  <p className="text-sm text-gray-500">Complete information and application guide</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className="hover:bg-red-50"
              >
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Award Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-2xl overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${getGradientClass(award.category)}`} />
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge
                      className={`bg-gradient-to-r ${getGradientClass(award.category)} text-white border-0 px-3 py-1`}
                    >
                      {award.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {award.code}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">Featured</span>
                    </div>
                  </div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{award.title}</h1>
                  <p className="text-lg text-gray-600 mb-6">Sponsored by {award.donor}</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">Award Value</p>
                        <p className="text-xl font-bold text-green-800">{award.value}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Deadline</p>
                        <p className="text-lg font-bold text-orange-800">{award.deadline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Eligibility</p>
                        <p className="text-lg font-bold text-blue-800">
                          {award.citizenship.includes("Non-Canadian-PR-PP") ? "All Students" : "Canadian/PR"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-80">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{daysUntilDeadline}</div>
                      <div className="text-sm text-gray-600">days remaining</div>
                    </div>
                    <Progress value={progressPercentage} className="mb-4" />
                    <div className="space-y-3">
                      <Button
                        size="lg"
                        className={`w-full bg-gradient-to-r ${getGradientClass(award.category)} hover:opacity-90 text-white border-0`}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                      <Button variant="outline" size="lg" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Guide
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">About This Award</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">{award.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Eligibility Requirements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Eligibility Requirements</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Academic Requirements:</h4>
                      <ul className="text-green-700 space-y-1">
                        <li>• Minimum GPA of 3.5/4.0</li>
                        <li>• Full-time enrollment status</li>
                        <li>• Good academic standing</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-2">Citizenship Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {award.citizenship.map((citizenship) => (
                          <Badge key={citizenship} variant="outline" className="border-blue-200 text-blue-700">
                            {citizenship === "Canadian-PR-PP"
                              ? "Canadian/Permanent Resident"
                              : "International Students"}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-purple-800 mb-2">Additional Requirements:</h4>
                      <ul className="text-purple-700 space-y-1">
                        <li>• Demonstrated leadership experience</li>
                        <li>• Community involvement</li>
                        <li>• Strong personal statement</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Process */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Target className="h-5 w-5 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Application Process</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: "Complete Online Application",
                        desc: "Fill out the comprehensive application form",
                      },
                      {
                        step: 2,
                        title: "Submit Required Documents",
                        desc: "Upload transcripts, essays, and references",
                      },
                      {
                        step: 3,
                        title: "Interview Process",
                        desc: "Selected candidates will be invited for an interview",
                      },
                      { step: 4, title: "Final Selection", desc: "Winners will be notified by email" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Application Guide
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Donor
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Official Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Important Dates */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Important Dates</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">Application Deadline</p>
                        <p className="text-sm text-orange-600">{award.deadline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Results Announced</p>
                        <p className="text-sm text-blue-600">June 15, 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tips */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-yellow-800">Pro Tips</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• Start your application early</li>
                    <li>• Get strong letters of recommendation</li>
                    <li>• Tailor your essay to the award criteria</li>
                    <li>• Proofread everything carefully</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
