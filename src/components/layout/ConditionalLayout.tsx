'use client'
import { usePathname } from 'next/navigation'
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideLayout = pathname === '/' || pathname.startsWith('/auth')

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className={!hideLayout ? "flex-grow max-w-7xl mx-auto w-full py-6 sm:px-6 lg:px-8" : "flex-grow"}>
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  )
}