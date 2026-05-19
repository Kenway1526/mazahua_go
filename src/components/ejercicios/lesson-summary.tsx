"use client"

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, ArrowRight, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface LessonSummaryProps {
  score: number;
  total: number;
  xpEarned: number;
  onRestart: () => void;
  currentLessonId: string;
}

export function LessonSummary({ score, total, xpEarned, onRestart, currentLessonId }: LessonSummaryProps) {
  const searchParams = useSearchParams()
  const variant = searchParams.get('variant') || 'oriental'

  // Algoritmo seguro de indexación secuencial para la ruta de aprendizaje
  const getNextLessonId = (id: string) => {
    if (!id || !id.includes('-')) return "L1-1"; 
    
    try {
      const parts = id.split('-'); // L1-1 -> ["L1", "1"]
      const nivel = parts[0];
      const numero = parseInt(parts[1]);
      
      if (numero < 5) {
        return `${nivel}-${numero + 1}`; 
      } else {
        const nivelNum = parseInt(nivel.replace('L', ''));
        return `L${nivelNum + 1}-1`; 
      }
    } catch (e) {
      return "L1-1";
    }
  }

  const nextLessonId = getNextLessonId(currentLessonId);

  // Efecto inmersivo de ráfagas laterales de Confeti (canvas-confetti)
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-6 max-w-md mx-auto min-h-screen font-nunito animate-in fade-in duration-500">
      
      {/* Ilustración de Logro Principal */}
      <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} className="relative">
        <img src="/images/muneca.png" alt="¡Felicidades!" className="w-56 h-56 md:w-64 md:h-64 drop-shadow-2xl" />
        <motion.div 
          animate={{ rotate: [0, 12, -12, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-2 -right-2 bg-yellow-400 p-4 rounded-full shadow-lg border-2 border-white"
        >
          <Trophy className="text-white w-6 h-6 md:w-8 md:h-8" />
        </motion.div>
      </motion.div>

      {/* Retroalimentación Textual */}
      <div className="text-center space-y-1">
        <h2 className="text-4xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>¡Buen trabajo!</h2>
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Lección completada con éxito</p>
      </div>

      {/* Módulo Analítico de Rendimiento Final */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <Card className="p-5 bg-white border-b-4 border-orange-100 flex flex-col items-center rounded-[2rem] shadow-sm">
          <span className="text-gray-400 font-black text-[9px] uppercase tracking-wider mb-1">Precisión</span>
          <span className="text-2xl font-black text-[#D4641C]">{accuracy}%</span>
        </Card>
        <Card className="p-5 bg-white border-b-4 border-blue-100 flex flex-col items-center rounded-[2rem] shadow-sm">
          <span className="text-gray-400 font-black text-[9px] uppercase tracking-wider mb-1">Puntos XP</span>
          <div className="flex items-center gap-1 text-2xl font-black text-blue-600">
            <Star className="fill-blue-600 w-5 h-5" /> {xpEarned}
          </div>
        </Card>
      </div>

      {/* Controles de Continuación Operacional de Enrutamiento */}
      <div className="flex flex-col gap-3 w-full pt-2">
        {/* Enlace corregido usando la propiedad asChild para evitar duplicar el DOM */}
        <Link href={`/lecciones/${nextLessonId}?variant=${variant}`} passHref legacyBehavior>
          <Button asChild className="w-full py-8 rounded-2xl text-xl font-black bg-[#D4641C] hover:bg-[#B35317] text-white shadow-[0_6px_0_0_#8B4513] active:translate-y-0.5 active:shadow-none transition-all uppercase flex items-center justify-center gap-2 cursor-pointer">
            <a>Siguiente Lección <ArrowRight size={20} strokeWidth={3} /></a>
          </Button>
        </Link>

        {/* Acciones Secundarias de Retorno Estilizadas de Forma Consistente */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button 
            onClick={onRestart} 
            className="bg-white border-2 border-gray-200 text-gray-500 font-black py-4 rounded-2xl text-xs uppercase tracking-wider hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw size={14} strokeWidth={2.5} /> Repetir
          </button>
          
          <Link href="/dashboard" passHref legacyBehavior>
            <a className="bg-white border-2 border-gray-200 text-gray-500 font-black py-4 rounded-2xl text-xs uppercase tracking-wider hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center">
              <Home size={14} strokeWidth={2.5} /> Salir
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}