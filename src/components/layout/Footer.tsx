'use client'
import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#5D2B12] to-[#D4641C] text-white py-10 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Link Inicio */}
        <Link href="/dashboard" className="text-lg font-bold hover:text-orange-200 transition-all active:scale-95" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Inicio
        </Link>

        {/* Redes Sociales Funcionales */}
        <div className="flex items-center gap-8">
          <a 
            href="https://instagram.com/hevnoraak11" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:scale-125 transition-transform duration-300"
          >
            <Instagram size={28} />
          </a>
          
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:scale-125 transition-transform duration-300"
          >
            <Facebook size={28} />
          </a>

          <a 
            href="https://tiktok.com/@mazahuago" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:scale-125 transition-transform duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
            </svg>
          </a>
        </div>

        {/* Link Nosotros */}
        <Link href="/nosotros" className="text-lg font-bold hover:text-orange-200 transition-all active:scale-95" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Nosotros
        </Link>
      </div>

      {/* Copyright */}
      <div className="text-center mt-10 text-orange-200/50 text-xs font-bold uppercase tracking-widest">
        © 2026 Mazahua Go! • Toluca, México
      </div>
    </footer>
  )
}