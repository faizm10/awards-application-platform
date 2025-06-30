"use client"

import Image from "next/image"
import Link from "next/link"

interface ProductItemProps {
  title: string
  description: string
  href: string
  src: string
}

export function ProductItem({ title, description, href, src }: ProductItemProps) {
  return (
    <Link href={href} className="flex flex-col gap-2 group">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:opacity-75 transition-opacity" />
        <Image
          src={src || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105 duration-300"
        />
      </div>
      <div>
        <h3 className="font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
    </Link>
  )
}
