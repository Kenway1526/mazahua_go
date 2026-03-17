"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Lock } from "lucide-react"
import { BrandSection } from "@/components/mazahua/brand-section"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login:", { email, password })
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF8F5]">
      {/* Contenedor centralizado */}
      <div className="flex flex-col items-center gap-10 w-full max-w-md">
        
        {/* Brand Section - El venado y logo arriba */}
        <div className="flex items-center justify-center">
          <BrandSection logoSize="lg" mascotSize="lg" />
        </div>

        {/* Form Section */}
        <div className="flex flex-col items-center gap-6 w-full">
          <h2 
            className="text-3xl md:text-4xl font-bold text-[#D4641C] text-center"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[#D4641C] focus:outline-none text-gray-700 placeholder:text-gray-400"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[#D4641C] focus:outline-none text-gray-700 placeholder:text-gray-400"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit"
                className="w-full h-12 text-lg font-semibold rounded-full bg-gradient-to-r from-[#D4641C] to-[#8B4513] hover:from-[#C4571A] hover:to-[#7A3D10] text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                Entrar
              </Button>
            </div>
          </form>

          {/* Register Link */}
          <p className="text-gray-600 text-center" style={{ fontFamily: 'var(--font-nunito)' }}>
            ¿No tienes cuenta?{" "}
            <Link 
              href="/auth/register" 
              className="text-[#D4641C] hover:text-[#8B4513] font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Registrarme
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
