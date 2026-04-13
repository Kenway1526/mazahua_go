"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Flashcard } from '@/components/ejercicios/flashcard'
import { LessonSummary } from '@/components/ejercicios/lesson-summary' // Importamos el resumen
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function LessonPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const variant = searchParams.get('variant') || 'oriental'
  
  const [currentStep, setCurrentStep] = useState(0)
  const [exercises, setExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false) // Estado para el final

  useEffect(() => {
    async function loadLesson() {
      const { data } = await supabase
        .from('vocabulary')
        .select('*')
        .or(`variant.eq.${variant},variant.eq.general`)
        .limit(8)

      if (data) setExercises(data)
      setLoading(false)
    }
    loadLesson()
  }, [variant])

  const handleAnswer = (known: boolean) => {
    if (known) setScore(s => s + 1)
    
    if (currentStep < exercises.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      setIsFinished(true) // ¡Llegamos al final!
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-[#D4641C] animate-pulse text-2xl">Cargando Jñatjo...</div>

  // Si terminó, mostramos el resumen con el confeti
  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <LessonSummary 
          score={score} 
          total={exercises.length} 
          xpEarned={score * 10} 
          onRestart={() => window.location.reload()} 
          currentLessonId={params.id}
        />
      </div>
    )
  }

  const progress = ((currentStep) / exercises.length) * 100

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 flex flex-col items-center font-nunito">
      {/* Barra de Progreso */}
      <div className="w-full max-w-2xl flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-600 font-black text-2xl">✕</button>
        <Progress value={progress} className="h-4" />
        <span className="font-black text-gray-400 tabular-nums">{currentStep + 1}/{exercises.length}</span>
      </div>

      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center gap-6">
        {/* INSTRUCCIONES DINÁMICAS */}
        <div className="text-center space-y-2 mb-4">
          <h2 className="text-3xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
            Estudia esta palabra
          </h2>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Toca la carta para ver la traducción</p>
        </div>
        
        <Flashcard 
          word_mazahua={exercises[currentStep].word_mazahua}
          word_spanish={exercises[currentStep].word_spanish}
          emoji={exercises[currentStep].emoji || "✨"}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
          <Button 
            className="py-10 rounded-3xl text-xl font-black bg-white text-gray-700 border-b-8 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all active:translate-y-1 active:border-b-0"
            onClick={() => handleAnswer(false)}
          >
            Aún no la sé
          </Button>
          <Button 
            className="py-10 rounded-3xl text-xl font-black bg-white text-gray-700 border-b-8 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all active:translate-y-1 active:border-b-0"
            onClick={() => handleAnswer(true)}
          >
            ¡La conozco!
          </Button>
        </div>
      </div>
    </div>
  )
}