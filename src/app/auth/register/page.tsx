"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Mail, Lock, CheckSquare, Square } from "lucide-react"
import { BrandSection } from "@/components/mazahua/brand-section"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    if (!formData.acceptTerms) {
      alert("Debes aceptar los términos y condiciones")
      return
    }
    console.log("Register:", formData)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF8F5]">
      {/* Contenedor centralizado y compacto */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        
        {/* Brand Section - Sin venado (mascotSize null o prop para ocultar) */}
        <div className="flex items-center justify-center">
          <BrandSection logoSize="lg" mascotSize="sm" /> 
        </div>

        <div className="flex flex-col items-center gap-6 w-full">
          <h2 
            className="text-3xl font-bold text-[#D4641C] text-center"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Registrarme
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-11 pl-12 pr-4 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[#D4641C] focus:outline-none text-gray-700 placeholder:text-gray-400"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-11 pl-12 pr-4 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[#D4641C] focus:outline-none text-gray-700 placeholder:text-gray-400"
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
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-11 pl-12 pr-4 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[#D4641C] focus:outline-none text-gray-700 placeholder:text-gray-400"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-11 pl-12 pr-4 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[#D4641C] focus:outline-none text-gray-700 placeholder:text-gray-400"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer py-1" style={{ fontFamily: 'var(--font-nunito)' }}>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, acceptTerms: !prev.acceptTerms }))}
                className="text-gray-400 hover:text-[#D4641C] transition-colors"
              >
                {formData.acceptTerms ? (
                  <CheckSquare className="w-5 h-5 text-[#D4641C]" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <span className="text-gray-600 text-sm">
                Acepto{" "}
                <Link href="/terminos" className="text-[#D4641C] hover:underline font-semibold">
                  términos y condiciones
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit"
                className="w-full h-12 text-lg font-semibold rounded-full bg-gradient-to-r from-[#D4641C] to-[#8B4513] hover:from-[#C4571A] hover:to-[#7A3D10] text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                Crear cuenta
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm" style={{ fontFamily: 'var(--font-nunito)' }}>
            ¿Ya tienes cuenta?{" "}
            <Link 
              href="/auth/login" 
              className="text-[#D4641C] hover:text-[#8B4513] font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}