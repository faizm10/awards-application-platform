"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface GradientCardProps {
  icon: ReactNode
  title: string
  description: string
  gradient: string
}

export function GradientCard({ icon, title, description, gradient }: GradientCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="relative group">
      <div
        className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
        style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
      />
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm p-6">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5`} />
        <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r ${gradient} p-3 mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  )
}
