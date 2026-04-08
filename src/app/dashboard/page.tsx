"use client";

import { useVocabulario } from "@/lib/useData";
import { getMediaUrl } from "@/lib/supabase";
import { BrandSection } from "@/components/mazahua/brand-section";
import { Card } from "../../components/ui/card";
import Link from "next/link";
import { BookOpen, Video, Languages, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { vocabulario, loading } = useVocabulario();

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-10 space-y-10">
      
      {/* 1. Sección de Desafío (El Zorro) */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between border-b-4 border-gray-100">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
              Intenta completar un nuevo desafío
            </h2>
            <Link href="/lecciones">
              <button className="bg-[#D4641C] text-white px-8 py-3 rounded-full font-bold shadow-[0_4px_0_0_#8B4513] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#8B4513] transition-all">
                Empezar ahora
              </button>
            </Link>
          </div>
          <img src="/images/fox-mascot.png" alt="Zorro Mazahua" className="w-48 h-48 object-contain mt-6 md:mt-0" />
        </div>
      </section>

      {/* 2. Sección de Vocabulario (Grid Dinámico) */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>Vocabulario</h3>
          <Link href="/dashboard/vocabulario" className="text-[#D4641C] font-bold flex items-center gap-1 hover:underline">
            Ver más <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-3xl" />)
          ) : (
            vocabulario.slice(0, 4).map((item) => (
              <Card key={item.id} className="rounded-3xl p-6 flex flex-col items-center justify-center border-none shadow-sm hover:shadow-md transition-shadow">
                <span className="text-4xl mb-2">🍎</span> {/* Placeholder para item.image_url */}
                <p className="font-bold text-[#D4641C] text-xl">{item.mazahua}</p>
                <p className="text-gray-400 text-sm uppercase font-bold tracking-tighter">{item.categoria}</p>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* 3. Sección de Recursos y Cultura */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Historia - Card Grande */}
        <Link href="/dashboard/historia" className="md:col-span-2">
          <Card className="rounded-[2rem] p-8 h-full bg-white border-none shadow-sm flex items-center gap-6 hover:bg-orange-50/30 transition-colors">
            <img src="/images/doll-mazahua.png" alt="Muñeca" className="w-24" />
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>Historia Mazahua</h4>
              <p className="text-gray-500">Conoce las raíces y tradiciones del pueblo Jñatjo.</p>
            </div>
          </Card>
        </Link>

        {/* Mini Recursos Grid */}
        <div className="grid grid-cols-1 gap-4">
          <ResourceItem href="/dashboard/recursos/lecturas" icon={<BookOpen />} label="Lecturas" />
          <ResourceItem href="/dashboard/recursos/videos" icon={<Video />} label="Videos" />
          <ResourceItem href="/dashboard/recursos/traductor" icon={<Languages />} label="Traductor" />
        </div>
      </section>
    </div>
  );
}

// Sub-componente para los botones de recursos
function ResourceItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href}>
      <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:border-[#D4641C] border-2 border-transparent transition-all group">
        <div className="p-2 bg-orange-50 text-[#D4641C] rounded-lg group-hover:bg-[#D4641C] group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className="font-bold text-gray-700">{label}</span>
      </div>
    </Link>
  );
}