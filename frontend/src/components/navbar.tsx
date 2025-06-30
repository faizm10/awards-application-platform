"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-white" />
          <span className="text-lg font-bold">Awards Portal</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/explore" className="text-sm text-gray-400 hover:text-white transition-colors">
            Explore
          </Link>
          <Link href="/categories" className="text-sm text-gray-400 hover:text-white transition-colors">
            Categories
          </Link>
          <Link href="/resources" className="text-sm text-gray-400 hover:text-white transition-colors">
            Resources
          </Link>
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:flex text-sm text-gray-400 hover:text-white">
            Sign In
          </Button>
          <Button className="hidden md:flex bg-white hover:bg-gray-200 text-black rounded-full px-4">
            Get Started
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black"
          >
            <div className="flex flex-col space-y-4 p-4">
              <Link
                href="/explore"
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/categories"
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/resources"
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <Button variant="ghost" className="justify-center text-gray-400 hover:text-white w-full">
                  Sign In
                </Button>
                <Button className="justify-center bg-white hover:bg-gray-200 text-black w-full">Get Started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
