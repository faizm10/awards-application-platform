import { NAVBAR_LINKS } from '@/lib/constants'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
export const NavBar = () => {
  return (
    <header className="container mx-auto py-6">
          <nav className="flex items-center justify-between">
            <a href={NAVBAR_LINKS.home}>
            <div className="flex items-center gap-2">
              
              <div className="h-10 w-10 rounded-md bg-[#E51937] flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="font-semibold text-lg">
                University of Guelph
              </span>
            </div>
            </a>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href={NAVBAR_LINKS.awards}
                className="text-sm hover:text-[#E51937] transition-colors"
              >
                Awards
              </Link>
            </div>
            <Button className="bg-[#E51937] hover:bg-[#E51937]/90">
              Apply Now
            </Button>
          </nav>
        </header>
  )
}
