"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, Loader2 } from "lucide-react"
import { BrandSection } from "@/components/mazahua/brand-section"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 🚀 1. REGISTRO EN AUTH: Enviamos los metadatos necesarios al Trigger de Postgres
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nombre, // Capturado por el Trigger para la columna 'username'
            variant: 'general',       // Capturado por el Trigger para la columna 'variant'
          },
        },
      })

      if (authError) throw authError

      // 🛡️ 2. CONTROL SÍNCRONO: Redirección inmediata
      // El Trigger en el servidor ya creó de manera atómica las filas en 'profiles' y 'user_progress'
      if (data.user) {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error durante el registro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        
        <div className="mb-6 w-full flex justify-center scale-90">
          <BrandSection logoSize="lg" mascotSize="lg" />
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <h2 
            className="text-3xl font-bold text-[#D4641C] text-center" 
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Crear mi cuenta
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-sm w-full text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            {/* Input: Nombre completo */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4641C]">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full h-12 pl-12 pr-6 rounded-full bg-white border-2 border-transparent focus:border-[#D4641C]/20 shadow-sm focus:outline-none text-gray-700"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Input: Correo electrónico */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4641C]">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full h-12 pl-12 pr-6 rounded-full bg-white border-2 border-transparent focus:border-[#D4641C]/20 shadow-sm focus:outline-none text-gray-700"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Input: Contraseña */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4641C]">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full h-12 pl-12 pr-6 rounded-full bg-white border-2 border-transparent focus:border-[#D4641C]/20 shadow-sm focus:outline-none text-gray-700"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Botón de Envío */}
            <div className="pt-2">
              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-14 text-xl font-bold rounded-full bg-[#D4641C] hover:bg-[#B45415] text-white shadow-[0_4px_0_0_#8B4513] active:shadow-none active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Registrarme"}
              </Button>
            </div>
          </form>

          <div className="text-center" style={{ fontFamily: 'var(--font-nunito)' }}>
            <p className="text-gray-500">
              ¿Ya eres parte de la familia?{" "}
              <Link href="/login" className="text-[#D4641C] font-bold hover:text-[#8B4513]">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}