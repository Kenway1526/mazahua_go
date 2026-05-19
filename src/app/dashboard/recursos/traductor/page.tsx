"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Languages, Search, ArrowLeft, Loader2, AlertCircle, Info, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TraductorPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [userVariant, setUserVariant] = useState('oriental'); 

  // Recuperar variante real del perfil del usuario en sesión
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
        console.error("Error al obtener la variante del perfil:", err);
      }
    }
    getProfileVariant();
  }, []);

  const reproducirAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.error("Error al reproducir audio:", err));
    }
  };

  // Función de limpieza radical para extraer solo la palabra/equivalente puro
  const aislarEquivalente = (texto: string): string => {
    if (!texto) return "";
    return texto
      .replace(/ga\s+kjanu\s+ra\s+tsjaa\s*/i, "")
      .replace(/así\s+se\s+hace\s+al\s*/i, "")
      .replace(/así\s+se\s+hace\s+a\s+la\s*/i, "")
      .replace(/el\s+hombre\s+pensaba\s+en\s+el\s*/i, "")
      .replace(/el\s+hombre\s+pensaba\s+en\s+la\s*/i, "")
      .trim();
  };

  const traducirProcesado = async () => {
    const textoLimpio = query.trim();
    if (!textoLimpio) return;
    
    setLoading(true);
    setError(false);
    setResultado(null);
    setAudioUrl(null);

    try {
      // Consulta directa y estricta por igualdad (.eq) en las 4 columnas potenciales
      const { data: registro, error: errorQuery } = await supabase
        .from('vocabulary')
        .select('phrase_mazahua, phrase_spanish, word_spanish, word_mazahua, audio_url')
        .or(`phrase_spanish.eq.${textoLimpio},phrase_mazahua.eq.${textoLimpio},word_spanish.eq.${textoLimpio},word_mazahua.eq.${textoLimpio}`)
        .or(`variant.eq.${userVariant},variant.eq.general`)
        .limit(1)
        .maybeSingle();

      if (errorQuery) throw errorQuery;

      if (registro) {
        // Detectar si la entrada del usuario corresponde al idioma Español
        const esEspanol = 
          (registro.phrase_spanish && registro.phrase_spanish.toLowerCase() === textoLimpio.toLowerCase()) ||
          (registro.word_spanish && registro.word_spanish.toLowerCase() === textoLimpio.toLowerCase());
        
        // Obtener la cadena cruda correspondiente a la inversa
        const cadenaCruda = esEspanol 
          ? (registro.word_mazahua || registro.phrase_mazahua)
          : (registro.word_spanish || registro.phrase_spanish);
        
        // Aislar el vocablo limpiando los prefijos estructurales repetitivos de la inyección
        const vocabloLimpio = aislarEquivalente(cadenaCruda);

        if (vocabloLimpio) {
          // Encapsular el resultado estrictamente entre corchetes [ ] como solicitaste
          setResultado(`[${vocabloLimpio}]`);
        } else {
          setError(true);
        }
        
        if (registro.audio_url) setAudioUrl(registro.audio_url);
      } else {
        setError(true);
      }

    } catch (err) {
      console.error("Error crítico en el formateador del traductor:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 font-nunito pb-24">
      {/* Botón de escape al Dashboard principal */}
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-8 flex items-center gap-2 text-gray-500 font-black hover:text-[#D4641C] transition-colors uppercase text-xs tracking-wider cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={3} /> VOLVER AL DASHBOARD
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Encabezado */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
            <Languages size={36} />
          </div>
          <h1 className="text-4xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
            Traductor Jñatjo
          </h1>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">
            Filtro de Variante: {userVariant} & General
          </p>
        </div>

        {/* Panel principal */}
        <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-sm border-b-8 border-gray-100 space-y-6">
          <div className="relative">
            <Search className="absolute left-5 top-7 text-gray-400" size={24} />
            <textarea 
              placeholder="Escribe la palabra u oración exacta a consultar..."
              className="w-full p-6 pl-14 bg-gray-50 rounded-3xl border-2 border-transparent outline-none font-bold text-xl focus:border-green-200 focus:bg-white transition-all min-h-[140px] resize-none text-gray-800"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), traducirProcesado())}
            />
          </div>

          <button 
            onClick={traducirProcesado}
            disabled={loading || !query.trim()}
            className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-[0_6px_0_0_#15803d] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none uppercase tracking-wide cursor-pointer h-16"
          >
            {loading ? <Loader2 className="animate-spin" /> : "TRADUCIR"}
          </button>

          {/* Área de Resultados */}
          <div className="pt-2">
            <AnimatePresence mode="wait">
              {resultado ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="p-6 md:p-8 bg-green-50 rounded-[2.5rem] border-2 border-green-100 relative space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-black text-green-600 uppercase tracking-widest">Equivalente Encontrado:</p>
                    {audioUrl && (
                      <button 
                        onClick={reproducirAudio}
                        className="p-3 bg-white text-green-600 rounded-2xl border-2 border-green-100 hover:bg-green-100 active:scale-95 transition-all shadow-sm cursor-pointer"
                        title="Escuchar audio"
                      >
                        <Volume2 size={20} />
                      </button>
                    )}
                  </div>
                  
                  {/* Visualización del vocablo formateado con corchetes */}
                  <p className="text-4xl font-black text-gray-800 leading-snug pr-12 tracking-wide font-mono">
                    {resultado}
                  </p>
                  
                  <div className="mt-6 flex items-start gap-2 p-4 bg-white/60 rounded-2xl border border-green-100">
                    <Info className="text-green-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-green-800 font-bold leading-normal">
                      Mapeo Simétrico: Se ha aislado el vocablo del dataset de forma estricta y se presenta encapsulado en notación de corchetes.
                    </p>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="p-6 bg-red-50 rounded-[2rem] border-2 border-red-100 flex items-center gap-3 text-red-500 font-black text-sm uppercase tracking-tight"
                >
                  <AlertCircle className="shrink-0" />
                  <p>No se localizó el equivalente exacto para el término especificado.</p>
                </motion.div>
              ) : (
                <div className="text-center p-12 border-4 border-dashed border-gray-100 rounded-[2.5rem]">
                  <p className="text-gray-300 font-bold text-base">Ingresa un término y presiona el botón para procesar la correspondencia</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}