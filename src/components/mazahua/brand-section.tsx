"use client"

import { Logo } from "./logo"
import { Mascot } from "./mascot"

interface BrandSectionProps {
  logoSize?: "sm" | "md" | "lg"
  mascotSize?: "sm" | "md" | "lg"
}

export function BrandSection({ logoSize = "md", mascotSize = "md" }: BrandSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Logo size={logoSize} />
      <Mascot size={mascotSize} />
    </div>
  )
}