"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, Columns, Eye, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Historialectura {
  id: string;
  title: string;
  shortTitle: string;
  variant: string;
  paragraphs: Array<{ mazahua: string; spanish: string }>;
}

export default function LecturasPage() {
  const router = useRouter();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userVariant, setUserVariant] = useState('general');
  const [viewMode, setViewMode] = useState<'split' | 'interleaved'>('split');
  
  // Biblioteca en memoria local: Carga instantánea garantizada para la demo
  const bibilotecaLecturas: Historialectura[] = [
    {
      id: "lectura-1",
      title: "Nu Hyadi unpa nu Zänä (El Sol y la Luna)",
      shortTitle: "El Sol y la Luna",
      variant: "general",
      paragraphs: [
        {
          mazahua: "Nu Hyadi unpa mi paja nzio jango mi ñetse jens'e. Nu'u mi tsjaa na ndo tsje̷di kja ne xove.",
          spanish: "El Sol calienta el día alto en el cielo. Él trabaja con mucha fuerza desde la mañana."
        },
        {
          mazahua: "Ko xonxi, nu Zänä mi jia ko tsje̷di na ndo jmicha kjo̷ mi unte nzo̷o̷.",
          spanish: "Por la noche, la Luna ilumina con gran fuerza la tierra mientras los árboles descansan."
        },
        {
          mazahua: "Ga kjanu k'u̷ b'e̷zo mi mbe̷ntha nza ts'ichji kja nu dyëë.",
          spanish: "De esta manera los viejos sabios cuidan a la familia bajo su propia mano."
        }
      ]
    },
    {
      id: "lectura-2",
      title: "Nu Detho kja ne Mbe̷pji (El Maíz Sagrado)",
      shortTitle: "El Maíz Sagrado",
      variant: "general",
      paragraphs: [
        {
          mazahua: "Nu ts'ichji mi chjo̷~o̷ tr'eje xat'i ko daja k'ua mi unpa kja ne k'uajme.",
          spanish: "La familia come tortilla con sal y un tamal caliente en la cocina tradicional."
        },
        {
          mazahua: "Ri maza na ndo jango ri siji ne ndeje xove kja ne monte.",
          spanish: "Nos sentimos muy bien cuando tomamos el agua limpia de la mañana en el monte."
        },
        {
          mazahua: "Jñatjo b'e̷zo mi ne̷xt'i̷ ne jmicha k'u̷ o̷ xaja ndeme na ndo.",
          spanish: "Los hombres Mazahuas cuidan el conocimiento que heredaron de sus abuelos."
        }
      ]
    },
    {
      id: "lectura-3",
      title: "Nu Ts'ints'u̷ mi ne̷ji̷ (El Canto del Pájaro)",
      shortTitle: "El Canto del Pájaro",
      variant: "oriental",
      paragraphs: [
        {
          mazahua: "Nu Ts'ints'u̷ mi ne̷ji̷ t'e̷ mbe̷zo ne b'e̷zo mi mbe̷ntha nza jmicha.",
          spanish: "El pájaro cantaba sobre el árbol mientras el viejo sabio escuchaba con atención."
        },
        {
          mazahua: "Kjimi k'u̷ mi jia ne xat'i mi ne̷je̷ k'o̷ kju̷ k'u̷ tr'eje mi ts'i̷i̷.",
          spanish: "La lluvia que caía por la tarde refrescaba los sembradíos de maíz y calabaza."
        }
      ]
    }
  ];

  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const lecturaActiva = bibilotecaLecturas[currentBookIndex];

  // Carga paralela de metadatos del usuario sin bloquear la UI principal
  useEffect(() => {
    async function getProfileVariant() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('variant')
            .eq('id', user.id)
            .maybeSingle();
          if (data?.variant) setUserVariant(data.variant);
        }
      } catch (err) {
        console.error("Error al obtener la variante:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    getProfileVariant();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-10 font-nunito max-w-6xl mx-auto pb-24">
      
      {/* Botón de escape directo hacia el Dashboard */}
      <button 
        onClick={() => router.push('/dashboard')} 
        className="mb-8 flex items-center gap-2 text-gray-500 font-black hover:text-[#D4641C] transition-colors uppercase text-xs tracking-wider cursor-pointer"
      >
        <ArrowLeft size={16} strokeWidth={3} /> VOLVER AL DASHBOARD
      </button>

      {/* Selectores superiores de lectura */}
      <div className="mb-6 flex flex-wrap gap-2">
        {bibilotecaLecturas.map((libro, idx) => (
          <button
            key={libro.id}
            onClick={() => setCurrentBookIndex(idx)}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border-2 cursor-pointer ${currentBookIndex === idx ? 'bg-orange-600 border-orange-600 text-white shadow-md' : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200'}`}
          >
            <BookOpen size={12} className="inline mr-1.5 shrink-0" /> {libro.shortTitle}
          </button>
        ))}
      </div>

      {/* CONTENEDOR DEL VISOR INTERACTIVO */}
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border-b-8 border-gray-100">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
              {lecturaActiva.title}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Variante del recurso: {lecturaActiva.variant} | {loadingProfile ? "Cargando perfil..." : `Tu perfil: ${userVariant}`}
            </p>
          </div>

          {/* Controlador de Layout (Espejo / Intercalado) */}
          <div className="bg-gray-50 p-1 rounded-xl flex gap-1 border border-gray-200 shrink-0">
            <button 
              onClick={() => setViewMode('split')}
              className={`p-2 rounded-lg flex items-center gap-1 text-xs font-black uppercase tracking-tight transition-all cursor-pointer ${viewMode === 'split' ? 'bg-[#D4641C] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Columns size={14} /> Espejo
            </button>
            <button 
              onClick={() => setViewMode('interleaved')}
              className={`p-2 rounded-lg flex items-center gap-1 text-xs font-black uppercase tracking-tight transition-all cursor-pointer ${viewMode === 'interleaved' ? 'bg-[#D4641C] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Eye size={14} /> Intercalado
            </button>
          </div>
        </header>

        {/* Bloques de texto en espejo o intercalados */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={lecturaActiva.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {lecturaActiva.paragraphs.map((para, index) => (
                <div key={index} className="w-full">
                  {viewMode === 'split' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Columna Mazahua */}
                      <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-orange-100 shadow-sm relative group hover:border-orange-300 transition-colors">
                        <span className="absolute top-3 right-4 font-black text-[9px] text-orange-400 uppercase tracking-widest">Jñatjo</span>
                        <p className="text-xl font-black text-gray-800 leading-relaxed pr-6">{para.mazahua}</p>
                      </div>
                      {/* Columna Español */}
                      <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm relative group hover:border-gray-200 transition-colors">
                        <span className="absolute top-3 right-4 font-black text-[9px] text-gray-400 uppercase tracking-widest">Castellano</span>
                        <p className="text-lg font-bold text-gray-500 leading-relaxed italic pr-6">"{para.spanish}"</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
                      <p className="text-xl font-black text-gray-800 leading-relaxed">{para.mazahua}</p>
                      <p className="text-base font-bold text-gray-400 italic">"{para.spanish}"</p>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}