'use client'
import { User as UserIcon } from "lucide-react"
import { Logo } from "@/components/mazahua/logo" // Importamos solo el logo

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      {/* Solo el Logo de texto */}
      <div className="flex items-center">
        <Logo /> 
      </div>

      {/* Perfil */}
      <button className="flex items-center gap-3 group">
        <span className="font-bold text-[#8B4513] group-hover:text-[#D4641C] transition-colors" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Mi perfil
        </span>
        <div className="w-10 h-10 rounded-full bg-[#8B4513] flex items-center justify-center text-white shadow-md group-hover:bg-[#D4641C] transition-all">
          <UserIcon size={20} />
        </div>
      </button>
    </nav>
  )
}