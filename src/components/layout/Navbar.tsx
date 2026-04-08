'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User as UserIcon, LogOut, Settings, UserCircle } from "lucide-react"
import { Logo } from "@/components/mazahua/logo"
import { supabase } from "@/lib/supabase"

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh() // Obliga al middleware a re-evaluar la sesión
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      {/* Solo el Logo de texto */}
      <div className="flex items-center cursor-pointer" onClick={() => router.push('/dashboard')}>
        <Logo /> 
      </div>

      {/* Perfil con Menú Desplegable */}
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <span 
            className="hidden md:block font-bold text-[#8B4513] group-hover:text-[#D4641C] transition-colors" 
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Mi perfil
          </span>
          <div className="w-10 h-10 rounded-full bg-[#8B4513] flex items-center justify-center text-white shadow-md group-hover:bg-[#D4641C] transition-all">
            <UserIcon size={20} />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Capa invisible para cerrar el menú al hacer clic fuera */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            ></div>

            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in duration-150">
              <button 
                onClick={() => { router.push('/perfil'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors font-semibold"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                <UserCircle size={18} className="text-[#8B4513]" />
                Ver Perfil
              </button>
              
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors font-semibold"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                <Settings size={18} className="text-[#8B4513]" />
                Ajustes
              </button>

              <hr className="my-2 border-gray-100" />

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-bold"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}