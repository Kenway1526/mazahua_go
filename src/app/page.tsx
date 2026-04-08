"use client"

import Link from "next/link"
import { BrandSection } from "@/components/mazahua/brand-section"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF8F5]">
      {/* Contenedor central que agrupa todo verticalmente */}
      <div className="flex flex-col items-center gap-12 max-w-lg">
        {/* Brand Section - El venado y logo (arriba) */}
        <div className="flex items-center justify-center">
          <BrandSection logoSize="lg" mascotSize="lg" />
        </div>

        {/* Content Section - Título y botones (abajo) */}
        <div className="flex flex-col items-center gap-8 w-full">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B4513] text-center leading-tight text-balance"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Aprender Mazahua ahora es fácil y divertido!
          </h2>

          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            {/* Ajuste de ruta a /auth/login */}
            <Link href="/login" className="w-full">
              <Button 
                className="w-full h-12 text-lg font-semibold rounded-full bg-gradient-to-r from-[#D4641C] to-[#8B4513] hover:from-[#C4571A] hover:to-[#7A3D10] text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                Iniciar Sesión
              </Button>
            </Link>

            {/* Ajuste de ruta a /auth/register */}
            <Link 
              href="/register" 
              className="text-[#D4641C] hover:text-[#8B4513] font-semibold text-lg transition-colors underline-offset-4 hover:underline"
              style={{ fontFamily: 'var(--font-fredoka)' }}
            >
              Registrarme
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}