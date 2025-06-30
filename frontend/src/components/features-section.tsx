"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Award, Trophy, Target, Clock, Shield } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: "Smart Discovery",
    description:
      "AI-powered matching system finds awards perfectly suited to your profile, achievements, and academic goals.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Award,
    title: "Comprehensive Database",
    description:
      "Access thousands of scholarships, grants, and awards from universities, foundations, and organizations worldwide.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Trophy,
    title: "Success Tracking",
    description: "Monitor your applications, track deadlines, and celebrate your wins with our intuitive dashboard.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Target,
    title: "Personalized Recommendations",
    description:
      "Get tailored suggestions based on your field of study, GPA, extracurriculars, and career aspirations.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Clock,
    title: "Deadline Management",
    description: "Never miss an opportunity with smart notifications and deadline reminders for all your applications.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your personal information and academic records are protected with enterprise-grade security.",
    color: "from-teal-500 to-blue-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Students Choose
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to streamline your{" "}
            <span className="relative inline-block">
              <span className="relative z-10">award</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent blur-sm animate-spotlight"></div>
            </span>{" "}
            discovery and application process
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-30`}
                    ></div>
                    <div
                      className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
