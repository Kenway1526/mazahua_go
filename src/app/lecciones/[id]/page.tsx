"use client"

import React, { useState, useEffect, use } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Flashcard } from '@/components/ejercicios/flashcard'
import { LessonSummary } from '@/components/ejercicios/lesson-summary'
import { HeartsDisplay } from '@/components/ejercicios/hearts-display'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Loader2, X, AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { motion } from "framer-motion"

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Manejo de Parámetros asíncronos (Next.js 16)
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;

  const searchParams = useSearchParams()
  const router = useRouter()
  const variant = searchParams.get('variant') || 'oriental'
  
  // 2. Estados del Motor
  const [exercises, setExercises] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(5)
  const [loading, setLoading] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  // 3. Carga de datos
  useEffect(() => {
    async function loadLesson() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('lesson_id', lessonId)
          .or(`variant.eq.${variant},variant.eq.general`)
          .limit(8)

        if (error) throw error
        
        if (data && data.length > 0) {
          setExercises(data)
        } else {
          // Si no hay datos, evitamos el error redirigiendo o lanzando alerta
          console.warn("No se encontraron palabras para esta lección.");
          router.push('/lecciones');
        }
      } catch (err) {
        console.error("Error crítico de carga:", err)
      } finally {
        setLoading(false)
      }
    }
    loadLesson()
  }, [variant, lessonId, router])

  // 4. Lógica de Respuesta
  const handleAnswer = (known: boolean) => {
    if (!known) {
      // Usamos una función de actualización para asegurar que tenemos el valor real
      setLives((prevLives) => {
        const newLives = prevLives - 1;
        
        if (newLives <= 0) {
          setGameOver(true);
          return 0;
        }
        
        // Solo si le quedan vidas, avanzamos a la siguiente palabra
        avanzarSiguiente();
        return newLives;
      });
    } else {
      setScore(s => s + 1);
      avanzarSiguiente();
    }
  }

  const avanzarSiguiente = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Terminó con éxito
      saveProgressToSupabase(score);
    }
  }

  // 5. Persistencia
  const saveProgressToSupabase = async (finalScore: number) => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('user_progress').insert([{ 
          user_id: user.id, 
          lesson_id: lessonId, 
          completed: true,
          completed_at: new Date().toISOString()
        }])
      }
    } catch (err) {
      console.error("Error al guardar progreso:", err)
    } finally {
      setIsSaving(false);
      setIsFinished(true);
    }
  }

  // --- RENDERIZADO CONDICIONAL (ORDEN IMPORTANTE) ---

  // A. Cargando
  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-[#D4641C] animate-spin" />
      <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Cargando...</p>
    </div>
  )

  // B. Game Over
  if (gameOver) return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center space-y-8">
      <div className="bg-red-100 p-8 rounded-full">
        <AlertTriangle className="w-16 h-16 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>¡Sin vidas!</h2>
        <p className="text-gray-500 font-bold max-w-xs mx-auto text-sm uppercase tracking-tighter">Vuelve a intentarlo para dominar estas palabras.</p>
      </div>
      <div className="flex flex-col w-full max-w-xs gap-3">
        <Button onClick={() => window.location.reload()} className="py-8 rounded-2xl bg-[#D4641C] text-white font-black text-lg shadow-[0_6px_0_0_#8B4513] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 uppercase">
          <RefreshCcw size={20} /> Reintentar
        </Button>
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="font-black text-gray-400 uppercase text-xs flex items-center justify-center gap-2">
          <Home size={16} /> Salir
        </Button>
      </div>
    </div>
  )

  // C. Éxito (Resumen)
  if (isFinished) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <LessonSummary 
        score={score} 
        total={exercises.length} 
        xpEarned={score * 10} 
        onRestart={() => window.location.reload()} 
        currentLessonId={lessonId}
      />
    </div>
  )

  // D. Validación de Seguridad (Evita el error de "undefined")
  if (!exercises[currentStep]) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4641C] animate-spin" />
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL ---
  const progress = (currentStep / exercises.length) * 100

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 flex flex-col items-center font-nunito relative">
      
      {/* HEADER */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-6 mb-10">
        <button onClick={() => router.push('/lecciones')} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <X size={28} strokeWidth={3} />
        </button>
        <div className="flex-1">
          <Progress value={progress} className="h-4 border-2 border-white shadow-sm" />
        </div>
        <HeartsDisplay lives={lives} />
      </div>

      {/* CONTENIDO CENTRAL */}
      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center gap-8">
        
        <motion.div 
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-center space-y-2"
        >
          <h2 className="text-3xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
            Estudia la palabra
          </h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Variante: {variant}
          </p>
        </motion.div>
        
        <Flashcard 
          key={`card-${exercises[currentStep].id}`}
          word_mazahua={exercises[currentStep].word_mazahua}
          word_spanish={exercises[currentStep].word_spanish}
          emoji={exercises[currentStep].emoji}
        />

        {/* BOTONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
          <Button 
            variant="outline"
            className="py-10 rounded-[2rem] text-xl font-black text-gray-500 border-2 border-gray-100 bg-white hover:border-red-200 transition-all"
            onClick={() => handleAnswer(false)}
          >
            Aún no la sé
          </Button>
          <Button 
            className="py-10 rounded-[2rem] text-xl font-black bg-white text-gray-700 border-2 border-gray-100 border-b-8 hover:border-green-400 hover:bg-green-50 transition-all active:translate-y-1 active:border-b-2 shadow-sm"
            onClick={() => handleAnswer(true)}
          >
            ¡La conozco!
          </Button>
        </div>
      </div>

      {/* OVERLAY DE GUARDADO */}
      {isSaving && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="w-10 h-10 text-[#D4641C] animate-spin mb-2" />
          <p className="font-black text-orange-800 uppercase text-[10px] tracking-widest">Guardando progreso...</p>
        </div>
      )}
    </div>
  )
}