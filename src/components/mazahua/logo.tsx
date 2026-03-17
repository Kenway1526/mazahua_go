"use client"

import { Sparkles } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
}

export function Logo({ size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl"
  }

  const starSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Sparkles 
          className={`${starSizes[size]} text-[#D4641C] absolute -top-4 left-1/2 -translate-x-1/2 fill-[#D4641C]`}
        />
        <h1 className={`${sizeClasses[size]} font-bold tracking-tight`} style={{ fontFamily: 'var(--font-fredoka)' }}>
          <span className="text-[#D4641C]">m</span>
          <span className="text-[#C4A35A]">a</span>
          <span className="text-[#2F847C]">z</span>
          <span className="text-[#D4641C]">a</span>
          <span className="text-[#8B4513]">h</span>
          <span className="text-[#D4641C]">u</span>
          <span className="text-[#C4A35A]">a</span>
          <span className="text-[#2F847C]">G</span>
          <span className="text-[#D4641C]">o</span>
          <span className="text-[#8B4513]">!</span>
        </h1>
      </div>
      <span className="text-[#8B4513] text-sm tracking-widest mt-1" style={{ fontFamily: 'var(--font-nunito)' }}>
        jnatrjo
      </span>
    </div>
  )
}
