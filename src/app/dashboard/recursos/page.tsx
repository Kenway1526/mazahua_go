"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Search, Loader2, Volume2, Globe, BookOpen, 
  ChevronLeft, ChevronRight, Video, Music, FileText, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALFABETO = "ABCDEGHIJKLMNOPRSTUXYZ".split("");

export default function RecursosHubPage() {
  // CONTROL DE PESTAÑA MAESTRA
  const [activeTab, setActiveTab] = useState<'diccionario' | 'lecturas' | 'videos'>('diccionario');

  // ESTADOS DE FILTRADO (DICCIONARIO Y MULTIMEDIA)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [userVariant, setUserVariant] = useState<string>('general');
  
  // ESTADOS DE CONTROL DE DATOS Y PAGINACIÓN
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 8;

  // 1. CARGAR LA VARIANTE REAL DEL PERFIL DEL USUARIO
  useEffect(() => {
    async function loadUserVariant() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('variant')
          .eq('id', user.id)
          .maybeSingle();
        if (profile?.variant) {
          setUserVariant(profile.variant);
        }
      }
    }
    loadUserVariant();
  }, []);

  // 2. CONSULTA DINÁMICA SEGÚN LA PESTAÑA ACTIVA
  useEffect(() => {
    async function loadHubContent() {
      setLoading(true);
      try {
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        // CASO A: Filtros aplicados al Diccionario Inteligente (Tabla: vocabulary)
        if (activeTab === 'diccionario') {
          let query = supabase.from('vocabulary').select('*', { count: 'exact' });

          if (searchTerm.trim()) {
            query = query.or(`word_spanish.ilike.%${searchTerm}%,word_mazahua.ilike.%${searchTerm}%`);
          }
          if (selectedLetter) {
            query = query.ilike('word_spanish', `${selectedLetter}%`);
          }
          
          // El diccionario muestra la variante del usuario + el vocabulario general
          query = query.or(`variant.eq.${userVariant},variant.eq.general`);

          const { data, count, error } = await query
            .order('word_spanish', { ascending: true })
            .range(from, to);

          if (error) throw error;
          setItems(data || []);
          setTotalCount(count || 0);

        // CASO B: Filtros aplicados a los Recursos Multimedia (Tabla: resources)
        } else {
          const mappedType = activeTab === 'lecturas' ? 'lectura' : 'video';
          
          let query = supabase
            .from('resources')
            .select('*', { count: 'exact' })
            .eq('type', mappedType)
            .or(`variant.eq.${userVariant},variant.eq.general`);

          const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

          if (error) throw error;
          setItems(data || []);
          setTotalCount(count || 0);
        }
      } catch (err) {
        console.error("Error cargando el Hub de Recursos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHubContent();
  }, [activeTab, searchTerm, selectedLetter, userVariant, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4 md:p-10 space-y-8 pb-24 font-nunito max-w-6xl mx-auto">
      
      {/* Encabezado Principal */}
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'var(--font-fredoka)' }}>
          <BookOpen className="text-[#D4641C]" size={36} /> Recursos Didácticos
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          Material complementario adaptado a la variante: {userVariant}
        </p>
      </header>

      {/* MENÚ DE PESTAÑAS (TABS) CONTENEDORAS */}
      <div className="flex gap-2 md:gap-4 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
        {(['diccionario', 'lecturas', 'videos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); setSearchTerm(""); setSelectedLetter(null); }}
            className={`flex items-center gap-2 pb-3 px-4 font-black uppercase text-xs tracking-wider transition-all border-b-4 whitespace-nowrap cursor-pointer ${
              activeTab === tab 
                ? 'text-[#D4641C] border-[#D4641C]' 
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {tab === 'diccionario' && <BookOpen size={16} />}
            {tab === 'lecturas' && <FileText size={16} />}
            {tab === 'videos' && <Video size={16} />}
            {tab}
          </button>
        ))}

        {/* PESTAÑA DE AUDIOS CONGELADA DE FORMA CONSISTENTE */}
        <div className="opacity-40 pointer-events-none cursor-not-allowed select-none flex items-center gap-2 pb-3 px-4 font-black uppercase text-xs tracking-wider border-b-4 border-transparent text-gray-400 whitespace-nowrap">
          <Music size={16} /> Audios
        </div>
      </div>

      {/* PANEL DE CONTROL DE BÚSQUEDA Y LETRAS (SOLO DICCIONARIO) */}
      <AnimatePresence mode="wait">
        {activeTab === 'diccionario' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border-b-4 border-gray-100 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Buscar palabra por significado o grafía..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedLetter(null); }}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent outline-none font-bold text-gray-700 focus:border-orange-200 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50">
              <button
                onClick={() => { setSelectedLetter(null); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all uppercase cursor-pointer ${!selectedLetter ? 'bg-[#D4641C] text-white shadow-sm' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                Todos
              </button>
              {ALFABETO.map((letra) => (
                <button
                  key={letra}
                  onClick={() => { setSelectedLetter(letra); setSearchTerm(""); setCurrentPage(1); }}
                  className={`w-8 h-8 rounded-xl font-black text-xs transition-all flex items-center justify-center cursor-pointer ${selectedLetter === letra ? 'bg-[#D4641C] text-white shadow-sm' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  {letra}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECCIÓN DE RENDERIZADO ASÍNCRONO */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="animate-spin text-[#D4641C] w-10 h-10" />
          <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Sincronizando biblioteca...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* RENDERIZADO DEL PLAN A: DICCIONARIO FILOLÓGICO */}
          {activeTab === 'diccionario' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={item.id}
                    className="bg-white p-6 rounded-[2rem] border-2 border-gray-50 shadow-sm flex flex-col justify-between items-center text-center relative group hover:border-orange-200 transition-all"
                  >
                    <span className="absolute top-3 left-4 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-orange-50 text-[#D4641C]">
                      {item.variant}
                    </span>

                    {/* BOTÓN DE AUDIO DESHABILITADO Y DECORATIVO CON TOOLTIP DE ENFOQUE */}
                    <button 
                      disabled
                      className="absolute top-2 right-2 p-2 bg-gray-50 text-gray-400 rounded-full cursor-not-allowed opacity-40 hover:bg-gray-100 relative group/audio flex items-center justify-center"
                    >
                      <Volume2 size={16} />
                      <span className="absolute bottom-full mb-1.5 hidden group-hover/audio:block bg-gray-800 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm whitespace-nowrap z-10">
                        Escritura exacta
                      </span>
                    </button>

                    <div className="my-4 space-y-1">
                      <span className="text-4xl block mb-2">{item.emoji || '✨'}</span>
                      <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>{item.word_mazahua}</h3>
                      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wide">{item.word_spanish}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            
            /* RENDERIZADO DEL PLAN B: MULTIMEDIA (LECTURAS, VIDEOS) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((res) => (
                <div key={res.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-100 shadow-sm flex flex-col justify-between animate-in fade-in duration-300">
                  <div>
                    <div className="w-full h-44 bg-gray-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center relative border border-gray-100">
                      {res.thumbnail_url ? (
                        <img src={res.thumbnail_url} alt={res.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-300">
                          {activeTab === 'videos' && <Video size={48} />}
                          {activeTab === 'lecturas' && <FileText size={48} />}
                        </div>
                      )}
                      <span className="absolute bottom-3 right-3 bg-black/70 text-white font-black text-[8px] px-2.5 py-1 rounded-md uppercase tracking-widest">
                        {res.variant}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-1 leading-tight">{res.title}</h3>
                    <p className="text-gray-400 text-sm font-medium mb-4 line-clamp-2">{res.description}</p>
                  </div>
                  <a href={res.content_url} target="_blank" rel="noreferrer" 
                    className="inline-block text-center bg-[#D4641C] text-white font-black py-4 px-6 rounded-xl text-xs uppercase tracking-wider shadow-[0_4px_0_0_#8B4513] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    Abrir Material
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* MENSAJE DE CONTROL DE RECIPIENTE VACÍO */}
          {items.length === 0 && (
            <div className="text-center py-16 bg-white rounded-[2.5rem] border-4 border-dashed border-gray-100 max-w-xl mx-auto">
              <HelpCircle className="text-gray-300 mx-auto mb-3" size={40} />
              <p className="text-gray-400 font-black text-base uppercase tracking-tight">Sin materiales cargados para este filtro</p>
            </div>
          )}

          {/* COMPONENTE MAESTRO DE PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                className="p-3 bg-white border-2 border-gray-100 rounded-xl text-gray-600 disabled:opacity-40 hover:border-orange-200 transition-all shadow-sm cursor-pointer"
              >
                <ChevronLeft size={18} strokeWidth={3} />
              </button>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Página {currentPage} de {totalPages} ({totalCount} elementos)
              </span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                className="p-3 bg-white border-2 border-gray-100 rounded-xl text-gray-600 disabled:opacity-40 hover:border-orange-200 transition-all shadow-sm cursor-pointer"
              >
                <ChevronRight size={18} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}