"use client";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Award, Star, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Award className="relative h-20 w-20 text-primary" />
              </div>
            </div>

            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              <Star className="w-3 h-3 mr-1" />
              University of Guelph Awards Platform
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Discover Your Path to
              <span className="text-primary block">Excellence</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Unlock opportunities with scholarships, awards, and grants
              designed to recognize your academic achievements and support your
              educational journey at the University of Guelph.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href={ROUTES.AWARDS}>
                  Browse Awards
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                asChild
              >
                <Link href={ROUTES.MY_APPLICATIONS}>
                  My Applications
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
