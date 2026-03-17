'use client'
import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#5D2B12] to-[#D4641C] text-white py-10 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <Link href="/" className="text-lg font-bold hover:text-orange-200 transition-colors" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Inicio
        </Link>

        <div className="flex items-center gap-8">
          <Link href="#" className="hover:scale-110 transition-transform"><Instagram size={28} /></Link>
          <Link href="#" className="hover:scale-110 transition-transform"><Facebook size={28} /></Link>
          <Link href="#" className="hover:scale-110 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
          </Link>
        </div>

        <Link href="/nosotros" className="text-lg font-bold hover:text-orange-200 transition-colors" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Nosotros
        </Link>
      </div>
    </footer>
  )
}