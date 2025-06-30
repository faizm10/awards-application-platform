"use client"

import React, { useState, createContext, useContext, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

const MenuContext = createContext<{
  activeItem: string | null
  setActiveItem: React.Dispatch<React.SetStateAction<string | null>>
}>({
  activeItem: null,
  setActiveItem: () => null,
})

export const Menu = ({
  children,
  setActive,
}: {
  children: React.ReactNode
  setActive: (item: string | null) => void
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActive(activeItem)
  }, [activeItem, setActive])

  useEffect(() => {
    const handleMouseLeave = () => {
      setHoveredItem(null)
    }

    const menuEl = menuRef.current
    if (menuEl) {
      menuEl.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        menuEl.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <MenuContext.Provider value={{ activeItem, setActiveItem }}>
      <div
        ref={menuRef}
        className="relative rounded-full p-1.5 bg-white/80 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center gap-2"
      >
        {children}
        {hoveredItem && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white"
            layoutId="menu-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
    </MenuContext.Provider>
  )
}

export const MenuItem = ({
  children,
  item,
  active,
  setActive,
}: {
  children?: React.ReactNode
  item: string
  active: string | null
  setActive: (item: string | null) => void
}) => {
  const { activeItem, setActiveItem } = useContext(MenuContext)
  const isActive = active === item
  const menuItemRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<"idle" | "active">("idle")

  useEffect(() => {
    if (isActive) {
      setState("active")
    } else {
      setState("idle")
    }
  }, [isActive])

  useEffect(() => {
    const menuItemEl = menuItemRef.current
    if (!menuItemEl) return

    const handleMouseEnter = () => {
      setActive(item)
    }

    menuItemEl.addEventListener("mouseenter", handleMouseEnter)
    return () => {
      menuItemEl.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [item, setActive])

  return (
    <div ref={menuItemRef} className="relative px-3 py-1.5 text-sm transition-colors text-neutral-700 hover:text-neutral-900">
      <div
        className={cn(
          "relative z-10 cursor-pointer",
          state === "active" ? "text-neutral-900 font-medium" : "text-neutral-700"
        )}
        onClick={() => {
          setActiveItem(item === activeItem ? null : item)
        }}
      >
        {item}
      </div>
      {isActive && children && (
        <div className="absolute top-full pt-2 left-1/2 -translate-x-1/2 w-64 md:w-96">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-2xl shadow-xl p-4 border border-white/20"
          >
            {children}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export const HoveredLink = ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => {
  return (
    <Link
      href={href}
      className={cn(
        "text-neutral-700 hover:text-neutral-900 block transition-colors py-1 relative hover:underline",
        className
      )}
    >
      {children}
    </Link>
  )
}
