"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Trophy, ArrowLeft, Mail, Lock, User } from 'lucide-react'
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const awardId = params.id

  const [step, setStep] = useState(1) // 1: Login/Register, 2: Application Form
  const [isLogin, setIsLogin] = useState(true)
  
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    studentId: "",
  })

  const [applicationData, setApplicationData] = useState({
    personalStatement: "",
    communityService: "",
    leadership: "",
    experientialLearning: "",
    internationalTravel: "",
    additionalInfo: "",
    agreeToTerms: false,
  })

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate uoguelph.ca email
    if (!authData.email.endsWith("@uoguelph.ca")) {
      alert("Please use your uoguelph.ca email address")
      return
    }

    // Simulate authentication
    setStep(2)
  }

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!applicationData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    // Simulate application submission
    alert("Application submitted successfully!")
    router.push("/awards")
  }

  const handleAuthInputChange = (field: string, value: string) => {
    setAuthData((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplicationInputChange = (field: string, value: string | boolean) => {
    setApplicationData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href={`/awards/${awardId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Award Details
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-amber-600" />
              <h1 className="text-xl font-bold text-gray-900">Apply for Award</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {step === 1 ? (
            // Authentication Step
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {isLogin ? "Sign In" : "Create Account"}
                </CardTitle>
                <CardDescription className="text-center">
                  {isLogin 
                    ? "Sign in with your uoguelph.ca email to apply" 
                    : "Create an account with your uoguelph.ca email"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={authData.firstName}
                            onChange={(e) => handleAuthInputChange("firstName", e.target.value)}
                            required={!isLogin}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={authData.lastName}
                            onChange={(e) => handleAuthInputChange("lastName", e.target.value)}
                            required={!isLogin}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID *</Label>
                        <Input
                          id="studentId"
                          placeholder="e.g., 1234567"
                          value={authData.studentId}
                          onChange={(e) => handleAuthInputChange("studentId", e.target.value)}
                          required={!isLogin}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">University of Guelph Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="yourname@uoguelph.ca"
                        value={authData.email}
                        onChange={(e) => handleAuthInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-600">Must be a valid uoguelph.ca email address</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={isLogin ? "Enter your password" : "Create a password"}
                        value={authData.password}
                        onChange={(e) => handleAuthInputChange("password", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                    {isLogin ? "Sign In & Continue" : "Create Account & Continue"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      {isLogin ? "Create one" : "Sign in"}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Application Form Step
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Janet Wardlaw Memorial Lang Scholarship</CardTitle>
                  <CardDescription>
                    Complete your application below. All fields marked with * are required.
                  </CardDescription>
                </CardHeader>
              </Card>

              <form onSubmit={handleApplicationSubmit} className="space-y-6">
                {/* Student Information Display */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Student Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">Name</p>
                        <p>{authData.firstName} {authData.lastName}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Email</p>
                        <p>{authData.email}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Student ID</p>
                        <p>{authData.studentId}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Essays */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Essays</CardTitle>
                    <CardDescription>Please provide detailed responses to the following questions.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="personalStatement">Personal Statement *</Label>
                      <Textarea
                        id="personalStatement"
                        placeholder="Tell us about yourself, your academic goals, and why you deserve this award..."
                        className="min-h-[120px]"
                        value={applicationData.personalStatement}
                        onChange={(e) => handleApplicationInputChange("personalStatement", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="communityService">Community Service and Extracurricular Involvement *</Label>
                      <Textarea
                        id="communityService"
                        placeholder="Describe your community-based service and extracurricular activities..."
                        className="min-h-[120px]"
                        value={applicationData.communityService}
                        onChange={(e) => handleApplicationInputChange("communityService", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leadership">Leadership Skills and Volunteerism *</Label>
                      <Textarea
                        id="leadership"
                        placeholder="Provide examples of your leadership roles and volunteer work..."
                        className="min-h-[120px]"
                        value={applicationData.leadership}
                        onChange={(e) => handleApplicationInputChange("leadership", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experientialLearning">Experiential Learning Experience *</Label>
                      <Textarea
                        id="experientialLearning"
                        placeholder="Describe your curriculum-embedded experiential learning experiences..."
                        className="min-h-[120px]"
                        value={applicationData.experientialLearning}
                        onChange={(e) => handleApplicationInputChange("experientialLearning", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="internationalTravel">International Travel (if applicable)</Label>
                      <Textarea
                        id="internationalTravel"
                        placeholder="If you have participated in experiential learning involving international travel, please describe..."
                        className="min-h-[100px]"
                        value={applicationData.internationalTravel}
                        onChange={(e) => handleApplicationInputChange("internationalTravel", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        placeholder="Any additional information you would like to share..."
                        className="min-h-[100px]"
                        value={applicationData.additionalInfo}
                        onChange={(e) => handleApplicationInputChange("additionalInfo", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Terms and Conditions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={applicationData.agreeToTerms}
                        onCheckedChange={(checked) => handleApplicationInputChange("agreeToTerms", checked as boolean)}
                      />
                      <div className="text-sm">
                        <Label htmlFor="terms" className="cursor-pointer">
                          I agree to the terms and conditions *
                        </Label>
                        <p className="text-gray-600 mt-1">
                          By submitting this application, I certify that all information provided is accurate and complete.
                          I understand that false information may result in disqualification.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                    Submit Application
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
