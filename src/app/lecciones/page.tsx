"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, CheckCircle2, Star } from "lucide-react";
import { getMapaConProgreso } from "../../lib/services";

// ID de prueba hasta que implementemos el Auth real
const TEST_USER_ID = "tu-uuid-de-prueba-aqui"; 

export default function MapaLecciones() {
  const [niveles, setNiveles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMapa() {
      const data = await getMapaConProgreso(TEST_USER_ID);
      setNiveles(data || []);
      setLoading(false);
    }
    loadMapa();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#D4641C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-gray-600">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-16">
        
        <header className="text-center space-y-2 pt-4">
          <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
            Mi Camino Mazahua
          </h1>
          <p className="text-gray-500 font-medium">Completa lecciones para desbloquear nuevos niveles</p>
        </header>

        {niveles.map((nivel, idx) => (
          <section key={nivel.id} className="relative">
            {/* Cabecera del Nivel */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#D4641C] shadow-[0_4px_0_0_#8B4513] flex items-center justify-center text-white text-2xl">
                {idx === 0 ? "🌱" : idx === 1 ? "🌿" : "🌳"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
                  Nivel {nivel.orden}: {nivel.nombre}
                </h2>
              </div>
            </div>

            {/* Grid de Lecciones estilo Duolingo */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {nivel.lessons?.sort((a: any, b: any) => a.orden - b.orden).map((leccion: any) => {
                const isCompletada = leccion.estado === 'completada';
                // Por ahora permitimos entrar a todas las que no estén completadas como 'disponibles'
                const isBloqueada = false; 

                return (
                  <Link 
                    key={leccion.id}
                    href={isBloqueada ? "#" : `/lecciones/${leccion.id}`}
                    className={`group relative flex flex-col items-center transition-all ${isBloqueada ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                  >
                    {/* Botón Circular de Lección */}
                    <div className={`
                      w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-3xl shadow-lg border-b-8 transition-all
                      ${isCompletada ? 'bg-yellow-400 border-yellow-600 text-white' : 'bg-white border-gray-200 text-gray-400'}
                      ${isBloqueada ? 'bg-gray-100 border-gray-300 opacity-50' : ''}
                    `}>
                      {isCompletada ? <Star className="w-10 h-10 fill-white" /> : <span className="grayscale opacity-50">📖</span>}
                      
                      {/* Badge de Estado */}
                      <div className="absolute -top-2 -right-2">
                        {isCompletada && (
                          <div className="bg-green-500 rounded-full p-1 border-4 border-[#FAF8F5]">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        )}
                        {isBloqueada && (
                          <div className="bg-gray-400 rounded-full p-1 border-4 border-[#FAF8F5]">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    <span className={`mt-3 font-bold text-lg ${isCompletada ? 'text-gray-800' : 'text-gray-500'}`}>
                      {leccion.titulo}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}