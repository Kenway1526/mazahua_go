"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { 
  Video, 
  Languages, 
  ArrowRight, 
  FileText, 
  Headphones, 
  Sparkles,
  Loader2
} from "lucide-react";

// --- TIPOS ---
interface Vocablo {
  id: string;
  word_mazahua: string;
  word_spanish: string;
  category: string;
}

// --- CONFIGURACIÓN VISUAL ---
const iconMap: Record<string, string> = {
  "animales": "🦊",
  "frutas": "🍎",
  "comida": "🫓",
  "colores": "🎨",
  "familia": "👪",
  "saludos": "👋",
  "números": "🔢",
  "cuerpo": "💪",
  "naturaleza": "🌲",
  "gramática": "📝",
  "conectores": "🔗"
};

export default function DashboardPage() {
  const [vocabulario, setVocabulario] = useState<Vocablo[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data, error } = await supabase
          .from('vocabulary')
          .select('id, word_mazahua, word_spanish, category')
          .limit(4); // Solo necesitamos 4 para el preview
        
        if (!error && data) setVocabulario(data);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-10 space-y-12 pb-24 font-nunito">
      
      {/* 1. SECCIÓN DE DESAFÍO (BANNER) */}
      <section className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between border-b-8 border-orange-100">
          <div className="space-y-6 text-center md:text-left max-w-lg">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>
              ¿Listo para practicar Jñatjo?
            </h2>
            <p className="text-gray-500 text-lg font-medium">Completa tu racha de hoy y desbloquea nuevos logros en tu perfil.</p>
            <Link href="/lecciones" className="inline-block">
              <button className="bg-[#D4641C] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_0_#8B4513] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider">
                Empezar lección
              </button>
            </Link>
          </div>
          <div className="relative mt-10 md:mt-0">
            <div className="absolute inset-0 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
            <img 
              src="/images/fox-mascot.png" 
              alt="Zorro" 
              className="relative w-56 h-56 md:w-72 md:h-72 object-contain" 
            />
          </div>
        </div>
      </section>

      {/* 2. PALABRAS DEL DÍA (GRID) */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-end px-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>Palabras del día</h3>
            <p className="text-gray-400 font-bold text-sm uppercase italic tracking-wider">Vocabulario clave</p>
          </div>
          <Link href="/dashboard/vocabulario" className="text-[#D4641C] font-black flex items-center gap-1 hover:gap-2 transition-all">
            Ver todo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-44 bg-gray-200 animate-pulse rounded-[2rem]" />
            ))
          ) : (
            vocabulario.map((item) => {
              const catKey = item.category?.toLowerCase().trim() || "";
              const emoji = iconMap[catKey] || "✨";
              
              return (
                <Card key={item.id} className="rounded-[2rem] p-6 flex flex-col items-center justify-center border-2 border-transparent hover:border-orange-200 shadow-sm hover:shadow-md transition-all group bg-white cursor-default">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {emoji}
                  </div>
                  <p className="font-black text-[#D4641C] text-xl uppercase tracking-tight text-center leading-tight">
                    {item.word_mazahua}
                  </p>
                  <p className="text-gray-400 text-xs font-bold uppercase mt-1">
                    {item.word_spanish}
                  </p>
                </Card>
              );
            })
          )}
        </div>
      </section>

      {/* 3. RECURSOS Y CULTURA */}
      <section className="max-w-6xl mx-auto space-y-6">
        <h3 className="text-2xl font-black text-gray-800 px-4" style={{ fontFamily: 'var(--font-fredoka)' }}>Recursos y Cultura</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Historia Card */}
          <Link href="/dashboard/historia" className="md:col-span-2 group">
            <Card className="rounded-[2.5rem] p-8 h-full bg-white border-2 border-transparent shadow-sm flex flex-col md:flex-row items-center gap-8 group-hover:border-blue-200 transition-all">
              <div className="relative shrink-0">
                <img src="/images/doll-mazahua.png" alt="Cultura" className="w-32 md:w-40 drop-shadow-xl group-hover:rotate-6 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-40 scale-150"></div>
              </div>
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-black uppercase w-fit mx-auto md:mx-0">
                  <Sparkles size={14} /> Jñatjo
                </div>
                <h4 className="text-3xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>Historia Mazahua</h4>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Conoce las raíces y la cosmovisión del pueblo que da vida a esta lengua.
                </p>
              </div>
            </Card>
          </Link>

          {/* Botones de Recursos */}
          <div className="flex flex-col gap-4">
            <ResourceBtn href="/dashboard/recursos/lecturas" icon={<FileText />} label="Lecturas PDF" color="text-orange-500" bg="bg-orange-50" />
            <ResourceBtn href="/dashboard/recursos/videos" icon={<Video />} label="Videos" color="text-blue-500" bg="bg-blue-50" />
            <ResourceBtn href="/dashboard/recursos/traductor" icon={<Languages />} label="Traductor" color="text-green-600" bg="bg-green-50" />
            <ResourceBtn href="/dashboard/recursos/audios" icon={<Headphones />} label="Audios" color="text-purple-500" bg="bg-purple-50" />
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-componente interno para limpieza del código
function ResourceBtn({ href, icon, label, color, bg }: { href: string, icon: any, label: string, color: string, bg: string }) {
  return (
    <Link href={href}>
      <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center gap-4 hover:translate-x-2 border-2 border-transparent hover:border-gray-100 transition-all group active:scale-95">
        <div className={`p-3 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-black text-gray-700 leading-none">{label}</span>
          <span className="text-xs text-gray-400 font-bold mt-1 uppercase">Explorar</span>
        </div>
      </div>
    </Link>
  );
}