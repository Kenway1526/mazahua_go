"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rutas donde NO queremos Navbar ni Footer
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? "pt-20" : ""}> 
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}