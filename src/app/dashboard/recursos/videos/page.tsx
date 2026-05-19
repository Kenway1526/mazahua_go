"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Video, PlayCircle, ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      // Consulta corregida con los nombres oficiales de tu tabla en Supabase
      const { data } = await supabase
        .from('resources')
        .select('*')
        .eq('type', 'video');
      
      if (data) setVideos(data);
    };
    fetchVideos();
  }, []);

  // Función utilitaria para extraer el ID de YouTube y renderizar la miniatura e iframe
  const obtenerIdYouTube = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-10 font-nunito max-w-6xl mx-auto pb-24">
      {/* Botón de escape operacional al Dashboard */}
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-500 font-black hover:text-[#D4641C] transition-colors uppercase text-xs tracking-wider cursor-pointer"
      >
        <ArrowLeft size={16} strokeWidth={3} /> VOLVER AL DASHBOARD
      </button>

      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Videos y Documentales
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest pt-1">
          Material multimedia interactivo de la cultura Jñatjo
        </p>
      </header>

      {/* Grilla Bento de Tarjetas Multimedia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((vid) => {
          const videoId = obtenerIdYouTube(vid.content_url);
          // Portada por defecto de YouTube en alta definición basada en su ID
          const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

          return (
            <div 
              key={vid.id} 
              onClick={() => setActiveVideoUrl(vid.content_url)}
              className="bg-white overflow-hidden rounded-[2.5rem] shadow-sm group border-2 border-transparent hover:border-orange-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Contenedor de la miniatura de YouTube con filtro oscurecedor */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
                {thumbnailUrl ? (
                  <img 
                    src={thumbnailUrl} 
                    alt={vid.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <Video size={40} className="text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 text-[#D4641C] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                    <PlayCircle size={32} fill="currentColor" className="text-white group-hover:text-orange-600 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Cuerpo informativo */}
              <div className="p-6 space-y-2">
                <span className="text-[9px] font-black uppercase tracking-wider bg-orange-100 text-[#D4641C] px-2.5 py-0.5 rounded-full">
                  {vid.variant || 'general'}
                </span>
                <h3 className="font-black text-gray-800 text-xl leading-tight pt-1">
                  {vid.title}
                </h3>
                <p className="text-gray-400 text-xs font-bold line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* REPRODUCTOR EN MODAL FLOTANTE INTERACTIVO (CINEMÁTICO) */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={() => setActiveVideoUrl(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-black w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón de cierre superior */}
              <button 
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Contenedor embebido responsivo con relación de aspecto 16:9 */}
              <div className="relative pt-[56.25%] w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${obtenerIdYouTube(activeVideoUrl)}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}