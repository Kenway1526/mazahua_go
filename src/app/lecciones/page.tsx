"use client"

import React, { useState, useEffect, Suspense } from 'react' // Importamos Suspense
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { CheckCircle2, Lock, ChevronRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

// Estructura de Niveles
const NIVELES = [
  { id: 1, title: "Nivel 1: Raíces", color: "bg-green-500", border: "border-green-600" },
  { id: 2, title: "Nivel 2: Hogar", color: "bg-orange-500", border: "border-orange-600" },
  { id: 3, title: "Nivel 3: Naturaleza", color: "bg-blue-500", border: "border-blue-600" },
  { id: 4, title: "Nivel 4: Diálogo", color: "bg-purple-500", border: "border-purple-600" },
]

// 1. Componente de Contenido (Aquí va toda la lógica original)
function LessonsContent() {
  const searchParams = useSearchParams()
  const variant = searchParams.get('variant') || 'oriental'
  
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProgress() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('user_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('completed', true)
        
        if (data) setCompletedIds(data.map(item => item.lesson_id))
      }
      setLoading(false)
    }
    getProgress()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#D4641C] animate-spin mb-4" />
        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Cargando tu ruta...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-10 pb-24 font-nunito">
      <header className="max-w-4xl mx-auto mb-12 text-center space-y-2">
        <h1 className="text-4xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Tu Ruta Jñatjo
        </h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Variante activa: {variant}</p>
      </header>

      <div className="max-w-2xl mx-auto space-y-16">
        {NIVELES.map((nivel) => (
          <section key={nivel.id} className="space-y-6">
            <div className={`inline-block px-6 py-2 rounded-2xl ${nivel.color} text-white font-black shadow-lg shadow-gray-200 uppercase text-xs tracking-wider`}>
              {nivel.title}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map((num) => {
                const lessonId = `L${nivel.id}-${num}`
                const isCompleted = completedIds.includes(lessonId)
                
                // Lógica de desbloqueo: Primera lección siempre abierta o si la anterior está completada
                const isLocked = lessonId !== 'L1-1' && !isCompleted && !completedIds.includes(`L${nivel.id}-${num-1}`) && nivel.id === 1 
                                 ? true : (nivel.id > 1 && !completedIds.includes(`L${nivel.id-1}-5`) ? true : false);
                
                // Nota: Simplificamos para el build, puedes pulir la lógica de bloqueo después
                const isActuallyLocked = num > 1 && !completedIds.includes(`L${nivel.id}-${num-1}`) && !isCompleted;

                return (
                  <LessonRow 
                    key={lessonId}
                    id={lessonId}
                    num={num}
                    isCompleted={isCompleted}
                    isLocked={isActuallyLocked}
                    color={nivel.color}
                    variant={variant}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

// Componente Auxiliar para las filas
function LessonRow({ id, num, isCompleted, isLocked, color, variant }: any) {
  const content = (
    <Card className={`group relative p-6 rounded-[2.5rem] border-b-8 transition-all flex items-center justify-between ${
      isLocked ? 'bg-gray-100 border-gray-200 grayscale opacity-60' : 'bg-white border-gray-100 hover:border-orange-200 cursor-pointer shadow-sm'
    }`}>
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110 ${isLocked ? 'bg-gray-300 shadow-none' : color}`}>
          {isLocked ? '🔒' : num}
        </div>
        <div className="space-y-1">
          <h4 className={`font-black uppercase tracking-tight ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
            Lección {num}
          </h4>
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] flex items-center gap-1">
            {isCompleted ? <span className="text-green-500">Completada</span> : isLocked ? "Bloqueada" : "Comenzar ahora"}
          </p>
        </div>
      </div>
      
      {!isLocked && (
        <div className="flex items-center gap-4">
          {isCompleted && <CheckCircle2 className="text-green-500 w-8 h-8" />}
          <ChevronRight className={`w-6 h-6 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
        </div>
      )}
    </Card>
  )

  return isLocked ? <div>{content}</div> : <Link href={`/lecciones/${id}?variant=${variant}`}>{content}</Link>
}

// 2. Exportación Principal envuelta en Suspense (Solución para Vercel)
export default function LessonsMapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4641C] animate-spin" />
      </div>
    }>
      <LessonsContent />
    </Suspense>
  )
}