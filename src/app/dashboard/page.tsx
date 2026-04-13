"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { 
  Video, Languages, ArrowRight, FileText, 
  Headphones, Sparkles, Trophy, Flame, Loader2
} from "lucide-react";

interface Vocablo {
  id: string;
  word_mazahua: string;
  word_spanish: string;
  category: string;
  variant: string;
}

const iconMap: Record<string, string> = {
  "animales": "🦊", "frutas": "🍎", "comida": "🫓",
  "colores": "🎨", "familia": "👪", "saludos": "👋",
  "números": "🔢", "cuerpo": "💪", "naturaleza": "🌲"
};

export default function DashboardPage() {
  const [vocabulario, setVocabulario] = useState<Vocablo[]>([]);
  const [variante, setVariante] = useState<'oriental' | 'occidental'>('oriental');
  const [loading, setLoading] = useState(true);
  
  // ESTADOS REALES (Sincronizados con tu tabla user_progress)
  const [progresoGlobal, setProgresoGlobal] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [userName, setUserName] = useState("Estudiante");

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      
      // 1. Obtener sesión del usuario
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserName(user.user_metadata?.full_name || "Estudiante");

      // 2. Cargar Vocabulario según variante
      const { data: vData } = await supabase
        .from('vocabulary')
        .select('*')
        .or(`variant.eq.${variante},variant.eq.general`)
        .limit(4);
      if (vData) setVocabulario(vData);

      // 3. CARGAR PROGRESO REAL desde la tabla que creaste
      const { data: pData, count } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('completed', true);

      if (count !== null) {
        // Suponiendo 20 lecciones totales (4 niveles x 5 lecciones)
        setProgresoGlobal(Math.round((count / 20) * 100));
        // Simulamos XP: 10 por cada lección en la tabla
        setTotalXP(count * 10);
      }

      setLoading(false);
    }
    fetchAllData();
  }, [variante]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-10 space-y-8 pb-24 font-nunito">
      
      {/* HEADER: ESTADÍSTICAS REALES */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-2xl border-b-4 border-orange-200">
            <Flame className="text-orange-600 w-5 h-5" />
            <span className="font-black text-orange-700 uppercase text-xs tracking-tighter">Racha: Activa</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-2xl border-b-4 border-yellow-200">
            <Trophy className="text-yellow-600 w-5 h-5" />
            <span className="font-black text-yellow-700 uppercase text-xs tracking-tighter">{totalXP} XP</span>
          </div>
        </div>

        {/* SWITCH DE VARIANTE */}
        <div className="bg-white p-1.5 rounded-2xl flex gap-1 shadow-sm border border-gray-100">
          {['oriental', 'occidental'].map((v) => (
            <button 
              key={v}
              onClick={() => setVariante(v as any)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                variante === v ? 'bg-[#D4641C] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* BANNER PRINCIPAL */}
      <section className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between border-b-8 border-orange-100 relative group">
          <div className="space-y-6 text-center md:text-left max-w-lg z-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>
              ¡Yá'anú, {userName.split(' ')[0]}!
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black text-gray-400 uppercase">
                <span>Tu progreso</span>
                <span>{progresoGlobal}%</span>
              </div>
              <Progress value={progresoGlobal} className="h-4" />
            </div>
            <Link href={`/lecciones/1?variant=${variante}`} className="inline-block">
              <button className="bg-[#D4641C] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-[0_6px_0_0_#8B4513] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest flex items-center gap-3">
                Continuar <ArrowRight />
              </button>
            </Link>
          </div>
          <img 
            src="/images/zorro.png" 
            alt="Mascota" 
            className="w-64 h-64 md:w-96 md:h-96 object-contain group-hover:scale-105 transition-transform" 
          />
        </div>
      </section>

      {/* PALABRAS DEL DÍA */}
      <section className="max-w-6xl mx-auto space-y-6">
        <h3 className="text-2xl font-black text-gray-800 px-4" style={{ fontFamily: 'var(--font-fredoka)' }}>Palabras del día</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-3xl" />)
          ) : (
            vocabulario.map((item) => (
              <Card key={item.id} className="rounded-3xl p-6 flex flex-col items-center justify-center border-2 border-transparent hover:border-orange-200 transition-all bg-white shadow-sm">
                <span className="text-5xl mb-3">{iconMap[item.category?.toLowerCase()] || "✨"}</span>
                <p className="font-black text-[#D4641C] text-lg uppercase text-center leading-tight">{item.word_mazahua}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 tracking-tighter">{item.word_spanish}</p>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* CULTURA */}
      <section className="max-w-6xl mx-auto">
        <Link href="/dashboard/historia">
          <Card className="rounded-[2.5rem] p-8 bg-white border-2 border-transparent hover:border-blue-200 shadow-sm flex flex-col md:flex-row items-center gap-8 group transition-all">
            <img src="/images/muneca.png" alt="Cultura" className="w-40 md:w-56 drop-shadow-2xl group-hover:rotate-6 transition-transform" />
            <div className="space-y-3 text-center md:text-left">
              <div className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase w-fit mx-auto md:mx-0">Legado Jñatjo</div>
              <h4 className="text-3xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>Historia y Raíces</h4>
              <p className="text-gray-500 font-medium max-w-sm">Explora la cosmovisión del pueblo que da vida a esta lengua ancestral.</p>
            </div>
          </Card>
        </Link>
      </section>

      <section className="max-w-6xl mx-auto space-y-6">
        <h3 className="text-2xl font-black text-gray-800 px-4" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Herramientas de Apoyo
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ResourceBtn 
            href="/dashboard/recursos/lecturas" 
            icon={<FileText />} 
            label="Lecturas" 
            color="text-orange-500" 
            bg="bg-orange-50" 
          />
          <ResourceBtn 
            href="/dashboard/recursos/videos" 
            icon={<Video />} 
            label="Videos" 
            color="text-blue-500" 
            bg="bg-blue-50" 
          />
          <ResourceBtn 
            href="/dashboard/recursos/traductor" 
            icon={<Languages />} 
            label="Traductor" 
            color="text-green-600" 
            bg="bg-green-50" 
          />
          <ResourceBtn 
            href="/dashboard/recursos/audios" 
            icon={<Headphones />} 
            label="Audios" 
            color="text-purple-500" 
            bg="bg-purple-50" 
          />
        </div>
      </section>
    </div>
  );
}

function ResourceBtn({ href, icon, label, color, bg }: { href: string, icon: any, label: string, color: string, bg: string }) {
  return (
    <Link href={href}>
      <Card className="bg-white p-5 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-3 hover:translate-y-[-4px] border-2 border-transparent hover:border-gray-100 transition-all group active:scale-95 h-full cursor-pointer">
        <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:rotate-12 transition-transform`}>
          {icon}
        </div>
        <div className="text-center">
          <span className="font-black text-gray-700 block leading-none">{label}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">Explorar</span>
        </div>
      </Card>
    </Link>
  );
}