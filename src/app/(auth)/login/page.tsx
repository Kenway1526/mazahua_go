"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Lock, Loader2, AlertCircle } from "lucide-react"
import { BrandSection } from "@/components/mazahua/brand-section"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. Intentando iniciar sesión con:", email); // LOG DE CONTROL
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("2. Error de Supabase:", authError.message); // LOG DE ERROR
        setError(authError.message);
        return;
      }

      if (data.user) {
        console.log("3. Login exitoso");
        
        // 1. Refrescar los datos del router
        router.refresh();
        
        // 2. Pequeña pausa para asegurar la cookie
        setTimeout(() => {
          console.log("4. Redirigiendo...");
          window.location.href = "/dashboard";
        }, 300); 
      }
    } catch (err) {
      console.error("5. Error inesperado:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        
        <div className="mb-8 w-full flex justify-center">
          <BrandSection logoSize="lg" mascotSize="lg" />
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <h2 
            className="text-4xl font-bold text-[#D4641C] text-center"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Iniciar Sesión
          </h2>

          {/* Alerta de Error */}
          {error && (
            <div className="w-full bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in zoom-in duration-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Input Correo */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4641C] transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-full bg-white border-2 border-transparent focus:border-[#D4641C]/20 focus:bg-white shadow-sm focus:ring-4 focus:ring-[#D4641C]/5 focus:outline-none text-gray-700 placeholder:text-gray-400 transition-all"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Input Contraseña */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4641C] transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-full bg-white border-2 border-transparent focus:border-[#D4641C]/20 focus:bg-white shadow-sm focus:ring-4 focus:ring-[#D4641C]/5 focus:outline-none text-gray-700 placeholder:text-gray-400 transition-all"
                style={{ fontFamily: 'var(--font-nunito)' }}
                required
              />
            </div>

            {/* Botón Entrar con estado de carga */}
            <div className="pt-4">
              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-14 text-xl font-bold rounded-full bg-[#D4641C] hover:bg-[#B45415] text-white shadow-[0_4px_0_0_#8B4513] active:shadow-none active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Entrar"}
              </Button>
            </div>
          </form>

          <div className="text-center space-y-2" style={{ fontFamily: 'var(--font-nunito)' }}>
            <p className="text-gray-500">
              ¿No tienes cuenta?{" "}
              <Link 
                href="/register" 
                className="text-[#D4641C] font-bold hover:text-[#8B4513] transition-colors"
              >
                Registrarme
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}