import { NextLogo } from "./next-logo";
import { SupabaseLogo } from "./supabase-logo";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Award, Users, Zap, Star, Hexagon, BookOpen, Target } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      
      <div className="flex gap-8 justify-center items-center animate-bounce-in">
        <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          rel="noreferrer"
          className="group hover:scale-110 transition-transform duration-300"
        >
          <div className="p-4 rounded-full bg-gradient-to-r from-primary/20 to-chart-2/20 group-hover:from-primary/30 group-hover:to-chart-2/30 transition-all duration-300">
            <SupabaseLogo />
          </div>
        </a>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
        <a 
          href="https://nextjs.org/" 
          target="_blank" 
          rel="noreferrer"
          className="group hover:scale-110 transition-transform duration-300"
        >
          <div className="p-4 rounded-full bg-gradient-to-r from-primary/20 to-chart-2/20 group-hover:from-primary/30 group-hover:to-chart-2/30 transition-all duration-300">
            <NextLogo />
          </div>
        </a>
      </div>

      {/* Main Content */}
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            <span className="text-foreground">AwardFlow</span>
            <br />
            <span className="gradient-text">Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The most advanced platform for discovering and applying to scholarships, grants, and academic awards. 
            Built with cutting-edge technology for the modern student.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {[
            { icon: Sparkles, title: "Smart AI", description: "Intelligent matching algorithm" },
            { icon: Award, title: "10K+ Awards", description: "Comprehensive database" },
            { icon: Users, title: "50K+ Students", description: "Active community" }
          ].map((feature, index) => (
            <div key={index} className="card-modern p-6 text-center group animate-slide-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-chart-2/20 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button asChild size="lg" className="btn-primary text-lg px-8 py-4">
            <Link href="/awards" className="flex items-center gap-2">
              Explore Awards
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              View Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Geometric Divider */}
      <div className="w-full flex justify-center">
        <div className="flex gap-4">
          <div className="hexagon"></div>
          <div className="hexagon" style={{ animationDelay: '0.5s' }}></div>
          <div className="hexagon" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}
