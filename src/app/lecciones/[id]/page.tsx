"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { getContenidoLeccion, completarLeccion } from "@/lib/services";
import { QuizVisual } from "@/components/ejercicios/quiz-visual";
import { MemoryGame } from "@/components/ejercicios/memory-game";
import { Loader2 } from "lucide-react";

export default function JuegoPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Estados de Datos
  const [leccion, setLeccion] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  // Estados de Flujo
  const [loading, setLoading] = useState(true);
  const [enviandoProgreso, setEnviandoProgreso] = useState(false);
  const [terminado, setTerminado] = useState(false);

  // 1. Obtener Sesión Real y Datos de Lección
  useEffect(() => {
    async function inicializarJuego() {
      try {
        // Obtener usuario actual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Si no hay sesión, podrías redirigir o avisar
          console.warn("Usuario no autenticado. El progreso no se guardará.");
        } else {
          setUser(session.user);
        }

        // Obtener contenido de la lección
        if (id) {
          const data = await getContenidoLeccion(id as string);
          setLeccion(data);
        }
      } catch (error) {
        console.error("Error al inicializar:", error);
      } finally {
        setLoading(false);
      }
    }

    inicializarJuego();
  }, [id]);

  // 2. Manejador de Finalización (Lógica de Guardado Real)
  const handleFinish = async (score: number) => {
    if (enviandoProgreso) return;

    if (!user) {
      setTerminado(true); // Permitimos ver pantalla de éxito aunque no guarde
      return;
    }

    try {
      setEnviandoProgreso(true);
      // Guardar en Supabase usando el ID real del usuario logueado
      await completarLeccion(user.id, id as string);
      setTerminado(true);
    } catch (error) {
      console.error("Error al persistir progreso:", error);
      setTerminado(true);
    } finally {
      setEnviandoProgreso(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4641C] mb-4" />
        <p className="font-bold text-gray-500">Preparando tu lección...</p>
      </div>
    );
  }

  if (!leccion) return <div className="p-20 text-center">Lección no encontrada.</div>;

  if (terminado) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-gray-100 max-w-sm w-full">
          <span className="text-7xl mb-4 block">🥳</span>
          <h1 className="text-4xl font-bold text-[#D4641C]" style={{ fontFamily: 'var(--font-fredoka)' }}>
            ¡Buen trabajo!
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Has dominado <span className="text-gray-900 font-bold">{leccion.titulo}</span>
          </p>
          <div className="mt-6 pt-6 border-t border-gray-100">
             <p className="text-[#D4641C] font-bold">+15 XP ganados</p>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/lecciones')}
          className="bg-[#D4641C] text-white px-12 py-4 rounded-full font-bold shadow-[0_4px_0_0_#8B4513] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#8B4513] transition-all"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Botón de Salida */}
      <button 
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-10 p-2 text-gray-400 hover:text-gray-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Renderizado Condicional de Juegos */}
      <main className="pt-16 px-4">
        {leccion.tipo_juego === 'quiz' && (
          <QuizVisual 
            preguntas={leccion.contenido_json.preguntas} 
            onFinish={handleFinish} 
          />
        )}
      
        {leccion.tipo_juego === 'memory' && (
          <div className="max-w-4xl mx-auto space-y-10 py-10">
            <h2 className="text-3xl font-bold text-center text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
              Encuentra los pares
            </h2>
            <MemoryGame data={leccion.contenido_json} onFinish={() => handleFinish(100)} />
          </div>
        )}
      </main>
    </div>
  );
}