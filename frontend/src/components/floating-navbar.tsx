"use client"
import { useState } from "react"

import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu"
import { Trophy } from "lucide-react"
import { ProductItem } from "./ui/product-item"

export function FloatingNavbar() {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div className="fixed top-10 inset-x-0 max-w-2xl mx-auto z-50">
      <Menu setActive={setActive}>
        <div className="flex items-center space-x-2 mr-4">
          <Trophy className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-lg">Awards Portal</span>
        </div>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/">Dashboard</HoveredLink>
            <HoveredLink href="/profile">My Profile</HoveredLink>
            <HoveredLink href="/applications">Applications</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Awards">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Scholarships"
              href="/awards/scholarships"
              src="/placeholder.svg?height=70&width=140"
              description="Merit-based financial aid for academic excellence"
            />
            <ProductItem
              title="Research Grants"
              href="/awards/grants"
              src="/placeholder.svg?height=70&width=140"
              description="Funding for innovative research projects"
            />
            <ProductItem
              title="Achievement Awards"
              href="/awards/achievements"
              src="/placeholder.svg?height=70&width=140"
              description="Recognition for outstanding accomplishments"
            />
            <ProductItem
              title="Travel Grants"
              href="/awards/travel"
              src="/placeholder.svg?height=70&width=140"
              description="Support for academic conferences and events"
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/guides">Application Guides</HoveredLink>
            <HoveredLink href="/tips">Writing Tips</HoveredLink>
            <HoveredLink href="/deadlines">Important Deadlines</HoveredLink>
            <HoveredLink href="/faq">FAQ</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  )
}
