"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Languages, Search, ArrowLeft, Loader2, AlertCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TraductorPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const traducirProcesado = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(false);
    
    // 1. Limpiamos y tokenizamos la oración
    const palabrasOriginales = query.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(p => p.length > 0);

    try {
      // 2. Buscamos todas las palabras en una sola consulta (escalable)
      const { data, error: sbError } = await supabase
        .from('vocabulary') // Nombre de la tabla actualizado
        .select('word_spanish, word_mazahua') // Columnas actualizadas
        .in('word_spanish', palabrasOriginales);

      if (sbError) throw sbError;

      // 3. Mapeamos resultados para acceso rápido
      const mapaDiccionario = new Map(
        data?.map(item => [item.word_spanish.toLowerCase(), item.word_mazahua])
      );

      // 4. Reconstruimos la oración traducida
      const oracionTraducida = palabrasOriginales.map(palabra => {
        return mapaDiccionario.get(palabra) || `[${palabra}]`;
      }).join(" ");

      // Si no se encontró ninguna palabra del total
      if (data?.length === 0) {
        setError(true);
        setResultado(null);
      } else {
        setResultado(oracionTraducida);
      }

    } catch (err) {
      console.error("Error en traducción:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 font-nunito">
      {/* Botón Volver */}
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-500 font-black hover:text-[#D4641C] transition-colors"
      >
        <ArrowLeft size={20} /> VOLVER AL DASHBOARD
      </button>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Encabezado */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
            <Languages size={40} />
          </div>
          <h1 className="text-4xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
            Traductor Jñatjo
          </h1>
          <p className="text-gray-500 font-bold italic">Traduce palabras u oraciones completas</p>
        </div>

        {/* Caja de Traducción */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border-b-8 border-gray-100 space-y-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <textarea 
              placeholder="Escribe aquí en español..."
              className="w-full p-6 pl-14 bg-gray-50 rounded-3xl border-2 border-transparent outline-none font-bold text-xl focus:border-green-200 focus:bg-white transition-all min-h-[120px] resize-none text-gray-800"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), traducirProcesado())}
            />
          </div>

          <button 
            onClick={traducirProcesado}
            disabled={loading || !query.trim()}
            className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-[0_6px_0_0_#15803d] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
          >
            {loading ? <Loader2 className="animate-spin" /> : "TRADUCIR AHORA"}
          </button>

          {/* Resultados */}
          <div className="pt-4">
            {resultado ? (
              <div className="p-8 bg-green-50 rounded-[2.5rem] border-2 border-green-100 animate-in zoom-in-95 duration-300">
                <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-4">Traducción Jñatjo:</p>
                <p className="text-3xl font-black text-gray-800 leading-snug">
                  {resultado}
                </p>
                <div className="mt-6 flex items-start gap-2 p-4 bg-white/60 rounded-2xl border border-green-100">
                  <Info className="text-green-500 shrink-0" size={18} />
                  <p className="text-xs text-green-800 font-medium">
                    Nota: Las palabras que no están en el diccionario aparecen entre corchetes [ ].
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 rounded-[2rem] border-2 border-red-100 flex items-center gap-3 text-red-500 font-bold animate-in shake">
                <AlertCircle />
                <p>No encontramos ninguna de estas palabras en nuestra base de datos.</p>
              </div>
            ) : (
              <div className="text-center p-12 border-4 border-dashed border-gray-50 rounded-[2.5rem]">
                <p className="text-gray-300 font-bold text-lg">Escribe algo para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}