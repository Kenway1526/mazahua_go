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

  // Función segura para calcular la siguiente lección
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

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
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

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4 max-w-md mx-auto">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
        <img src="/images/muneca.png" alt="¡Felicidades!" className="w-64 h-64 drop-shadow-2xl" />
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-4 -right-4 bg-yellow-400 p-4 rounded-full shadow-lg"
        >
          <Trophy className="text-white w-8 h-8" />
        </motion.div>
      </motion.div>

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>¡Buen trabajo!</h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Lección completada</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <Card className="p-4 bg-white border-b-4 border-orange-100 flex flex-col items-center rounded-3xl">
          <span className="text-gray-400 font-black text-[10px] uppercase">Precisión</span>
          <span className="text-2xl font-black text-[#D4641C]">{Math.round((score/total)*100)}%</span>
        </Card>
        <Card className="p-4 bg-white border-b-4 border-blue-100 flex flex-col items-center rounded-3xl">
          <span className="text-gray-400 font-black text-[10px] uppercase">Puntos XP</span>
          <div className="flex items-center gap-1 text-2xl font-black text-blue-600">
            <Star className="fill-blue-600 w-5 h-5" /> {xpEarned}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Link href={`/lecciones/${nextLessonId}?variant=${variant}`} className="w-full">
          <Button className="w-full py-8 rounded-2xl text-xl font-black bg-[#D4641C] hover:bg-[#B35317] text-white shadow-[0_6px_0_0_#8B4513] active:translate-y-1 active:shadow-none transition-all uppercase flex items-center justify-center gap-2">
            Siguiente Lección <ArrowRight />
          </Button>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" onClick={onRestart} className="text-gray-400 font-black uppercase text-xs">
            <RotateCcw className="mr-2 w-4 h-4" /> Repetir
          </Button>
          <Link href="/dashboard" className="w-full">
            <Button variant="ghost" className="w-full text-gray-400 font-black uppercase text-xs">
              <Home className="mr-2 w-4 h-4" /> Salir
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}