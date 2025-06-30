"use client";

import { FloatingNavbar } from "@/components/floating-navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { Trophy } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingNavbar />
      <HeroSection />
      <FeaturesSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Awards Portal</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering students worldwide to discover and secure academic
                awards that fuel their educational dreams and career
                aspirations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/awards"
                    className="hover:text-white transition-colors"
                  >
                    Browse Awards
                  </a>
                </li>
                <li>
                  <a
                    href="/scholarships"
                    className="hover:text-white transition-colors"
                  >
                    Scholarships
                  </a>
                </li>
                <li>
                  <a
                    href="/grants"
                    className="hover:text-white transition-colors"
                  >
                    Research Grants
                  </a>
                </li>
                <li>
                  <a
                    href="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 Awards Portal. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
