"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, Music, Play, Pause, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AudiosPage() {
  const router = useRouter();
  const [audios, setAudios] = useState<any[]>([]);
  const [currentAudio, setCurrentAudio] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVariant, setUserVariant] = useState('general');

  useEffect(() => {
    async function fetchAudios() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let currentVariant = 'general';

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('variant')
            .eq('id', user.id)
            .maybeSingle();
          if (profile?.variant) {
            currentVariant = profile.variant;
            setUserVariant(profile.variant);
          }
        }

        // Consulta corregida a la tabla y esquema real de la Base de Datos
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('type', 'audio')
          .or(`variant.eq.${currentVariant},variant.eq.general`);

        if (error) throw error;
        setAudios(data || []);
      } catch (err) {
        console.error("Error cargando audios:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAudios();
  }, []);

  // Control operacional de la reproducción física asíncrona
  const togglePlayAudio = (track: any) => {
    if (currentAudio?.id === track.id) {
      if (isPlaying) {
        audioElement?.pause();
        setIsPlaying(false);
      } else {
        audioElement?.play();
        setIsPlaying(true);
      }
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const newAudio = new Audio(track.content_url);
      newAudio.play().catch(err => console.error("Error al reproducir recurso de audio:", err));
      setAudioElement(newAudio);
      setCurrentAudio(track);
      setIsPlaying(true);

      newAudio.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  // Limpieza del buffer del audio al desmontar el componente de la pantalla
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-[#D4641C] w-10 h-10 mb-2" />
      <p className="font-black text-gray-400 text-xs uppercase tracking-widest">Sintonizando frecuencias...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-10 font-nunito max-w-4xl mx-auto pb-24">
      <button 
        onClick={() => router.back()} 
        className="mb-6 flex items-center gap-2 text-gray-500 font-black hover:text-[#D4641C] transition-colors uppercase text-xs tracking-wider"
      >
        <ArrowLeft size={16} strokeWidth={3} /> Volver
      </button>

      <h1 className="text-3xl font-black text-gray-800 mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>Audios de Práctica</h1>
      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-8">Audios culturales y pronunciación ({userVariant})</p>

      {audios.length > 0 ? (
        <div className="grid gap-4">
          {audios.map((track) => (
            <div
              key={track.id}
              className={`bg-white p-6 rounded-[2.5rem] border-2 shadow-sm flex items-center justify-between transition-all ${
                currentAudio?.id === track.id && isPlaying ? 'border-purple-300 bg-purple-50/10' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <button
                  onClick={() => togglePlayAudio(track)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    currentAudio?.id === track.id && isPlaying 
                      ? 'bg-purple-600 text-white animate-pulse' 
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  {currentAudio?.id === track.id && isPlaying ? (
                    <Pause size={22} fill="currentColor" />
                  ) : (
                    <Play size={22} className="ml-1" fill="currentColor" />
                  )}
                </button>
                <div className="min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-widest bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                    {track.variant}
                  </span>
                  <h3 className="font-black text-gray-800 text-lg leading-tight mt-1 truncate">{track.title}</h3>
                  <p className="text-gray-400 text-xs font-bold truncate mt-0.5">{track.description}</p>
                </div>
              </div>

              <div className="text-purple-300 hidden sm:block">
                <Music size={24} className={currentAudio?.id === track.id && isPlaying ? 'animate-bounce' : ''} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-[2.5rem] border-4 border-dashed border-gray-100 max-w-md mx-auto">
          <HelpCircle className="text-gray-300 mx-auto mb-2" size={36} />
          <p className="text-gray-400 font-black text-sm uppercase">No hay material fonético disponible aún</p>
        </div>
      )}
    </div>
  );
}