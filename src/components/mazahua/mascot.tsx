"use client"

import Image from "next/image"

interface MascotProps {
  size?: "sm" | "md" | "lg"
}

export function Mascot({ size = "md" }: MascotProps) {
  const sizeClasses = {
    sm: { width: 180, height: 180, className: "w-[180px] h-[180px]" },
    md: { width: 250, height: 250, className: "w-[250px] h-[250px]" },
    lg: { width: 320, height: 320, className: "w-[320px] h-[320px]" }
  }

  const config = sizeClasses[size]

  return (
    <div className={`${config.className} relative`}>
      <Image
        src="/images/venado.png"
        alt="Venado mascota de MazahuaGo"
        width={config.width}
        height={config.height}
        className="object-contain rounded-2xl"
        priority
      />
    </div>
  )
}
