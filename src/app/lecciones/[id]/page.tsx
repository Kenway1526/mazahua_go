"use client"

import React, { useState, useEffect, use } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LessonSummary } from '@/components/ejercicios/lesson-summary'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  Loader2, X, AlertTriangle, BookOpen, Brain, 
  Volume2, Eye, LayoutGrid, Heart, Home, RefreshCcw 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const variant = searchParams.get('variant') || 'oriental';
  
  // ESTADOS CORE DEL FLUJO
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'study' | 'quiz' | 'syntax' | 'summary'>('study');
  const [isSaving, setIsSaving] = useState(false);

  // ESTADOS DEL GESTOR DE VIDAS (GAMIFICATION)
  const [hearts, setHearts] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // ESTADOS DEL QUIZ MULTIMODAL
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizType, setQuizType] = useState<'text' | 'audio_to_text' | 'image_to_text'>('text');

  // ESTADOS DEL SENTENCE BUILDER (SINTAXIS)
  const [phraseData, setPhraseData] = useState<{ spanish: string; mazahua: string } | null>(null);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [syntaxChecked, setSyntaxChecked] = useState(false);
  const [isSyntaxCorrect, setIsSyntaxCorrect] = useState<boolean | null>(null);

  // REPRODUCTOR FONÉTICO ASÍNCRONO
  const playWordAudio = (url: string) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch(err => console.error("Error de reproducción fonética:", err));
  };

  // CARGA INICIAL DE DATOS Y SINCRONIZACIÓN DE VIDAS DESDE EL PERFIL
  useEffect(() => {
    async function initializeLesson() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // 1. Recuperar vidas persistidas del estudiante
        const { data: profile } = await supabase
          .from('profiles')
          .select('hearts')
          .eq('id', user.id)
          .maybeSingle();

        if (profile && profile.hearts !== undefined) {
          setHearts(profile.hearts);
          if (profile.hearts <= 0) {
            setIsGameOver(true);
            setLoading(false);
            return;
          }
        }

        // 2. Cargar set de vocabulario de la lección filtrando por variantes geográficas
        const { data: vocabularyData } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('lesson_id', lessonId)
          .or(`variant.eq.${variant},variant.eq.general`)
          .limit(6);

        if (vocabularyData && vocabularyData.length > 0) {
          setExercises(vocabularyData);
          
          // Isolar frase contextual de la lección para la fase de Sintaxis Práctica
          const itemConFrase = vocabularyData.find(ex => ex.phrase_spanish && ex.phrase_mazahua);
          if (itemConFrase) {
            setPhraseData({
              spanish: itemConFrase.phrase_spanish,
              mazahua: itemConFrase.phrase_mazahua
            });
            const words = itemConFrase.phrase_mazahua.split(/\s+/).sort(() => 0.5 - Math.random());
            setShuffledWords(words);
          }

          determineQuizType(vocabularyData[0]);
          generateOptions(vocabularyData[0], vocabularyData);
        } else {
          router.push('/lecciones');
        }
      } catch (err) {
        console.error("Error en inicialización de lección:", err);
      } finally {
        setLoading(false);
      }
    }
    initializeLesson();
  }, [lessonId, variant, router]);

  // CONFIGURACIÓN DINÁMICA DEL TIPO DE QUIZ MULTIMODAL
  const determineQuizType = (currentExercise: any) => {
    const types: ('text' | 'audio_to_text' | 'image_to_text')[] = ['text'];
    if (currentExercise.audio_url) types.push('audio_to_text');
    if (currentExercise.emoji) types.push('image_to_text');
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    setQuizType(randomType);

    if (randomType === 'audio_to_text' && currentExercise.audio_url) {
      playWordAudio(currentExercise.audio_url);
    }
  };

  const generateOptions = (current: any, all: any[]) => {
    const wrong = all
      .filter(ex => ex.id !== current.id)
      .map(ex => ex.word_spanish)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setOptions([current.word_spanish, ...wrong].sort(() => 0.5 - Math.random()));
  };

  // CONSUMO DE CORAZONES EN FALLOS
  const handleIncorrectAnswer = async () => {
    const newHearts = hearts - 1;
    setHearts(newHearts);
    if (newHearts <= 0) setIsGameOver(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ hearts: newHearts }).eq('id', user.id);
      }
    } catch (err) {
      console.error("Error al persistir descuento de vida:", err);
    }
  };

  // RESTAURACIÓN OPERACIONAL DE VIDAS DESDE LA PANTALLA DE GAME OVER
  const handleResetHearts = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ hearts: 5 }).eq('id', user.id);
        setHearts(5);
        setIsGameOver(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error al restaurar corazones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const correct = option === exercises[currentStep].word_spanish;
    setIsCorrect(correct);

    if (!correct) {
      handleIncorrectAnswer();
    } else {
      setScore(prev => prev + 1);
    }
  };

  const nextStep = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    
    if (currentStep < exercises.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      determineQuizType(exercises[next]);
      generateOptions(exercises[next], exercises);
    } else if (phraseData) {
      setPhase('syntax');
    } else {
      saveProgress();
    }
  };

  // INTERACCIÓN DE BLOQUES (SENTENCE BUILDER)
  const handleWordClick = (word: string, fromSelected: boolean) => {
    if (syntaxChecked) return;
    if (fromSelected) {
      setSelectedWords(prev => prev.filter(w => w !== word));
      setShuffledWords(prev => [...prev, word]);
    } else {
      setShuffledWords(prev => prev.filter(w => w !== word));
      setSelectedWords(prev => [...prev, word]);
    }
  };

  const verifySyntax = () => {
    if (!phraseData) return;
    const userPhrase = selectedWords.join(" ");
    const correct = userPhrase.toLowerCase().trim() === phraseData.mazahua.toLowerCase().trim();
    
    setIsSyntaxCorrect(correct);
    setSyntaxChecked(true);

    if (!correct) {
      handleIncorrectAnswer();
    } else {
      setScore(prev => prev + 1);
    }
  };

  // PERSISTENCIA FINAL DE ANALÍTICAS EN LA BASE DE DATOS
  const saveProgress = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('lesson_attempts').insert([{
          user_id: user.id,
          lesson_id: lessonId,
          score: score,
          total_exercises: exercises.length + (phraseData ? 1 : 0),
          lives_remaining: hearts,
          variant: variant
        }]);

        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('max_score, attempts_count')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .maybeSingle();

        if (existingProgress) {
          const newMaxScore = Math.max(existingProgress.max_score || 0, score);
          const newAttempts = (existingProgress.attempts_count || 0) + 1;

          await supabase
            .from('user_progress')
            .update({
              completed: true,
              max_score: newMaxScore,
              attempts_count: newAttempts,
              completed_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId);
        } else {
          await supabase.from('user_progress').insert([{
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            max_score: score,
            attempts_count: 1,
            completed_at: new Date().toISOString()
          }]);
        }
      }
    } catch (err) {
      console.error("Error al persistir analíticas en base de datos:", err);
    } finally {
      setIsSaving(false);
      setPhase('summary');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]"><Loader2 className="animate-spin text-orange-500 w-10 h-10" /></div>;

  // --- RENDERIZADO INTERCEPTOR: PANTALLA GAME OVER ---
  if (isGameOver) return (
    <div className="fixed inset-0 bg-[#FAF8F5] z-50 flex flex-col items-center justify-center p-6 font-nunito animate-in fade-in duration-300">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-[3rem] p-8 text-center shadow-xl border-b-8 border-red-100 flex flex-col items-center space-y-6">
        <div className="relative flex items-center justify-center">
          <Heart size={80} className="text-red-200" fill="currentColor" />
          <span className="absolute font-black text-red-600 text-4xl" style={{ fontFamily: 'var(--font-fredoka)' }}>✕</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>¡Vidas agotadas!</h2>
          <p className="text-gray-500 font-medium text-sm">Has cometido demasiados errores en esta sesión. Te sugerimos repasar el vocabulario bilingüe antes de reintentar.</p>
        </div>
        <div className="w-full space-y-3 pt-4">
          <button onClick={handleResetHearts} className="w-full bg-[#D4641C] text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-[0_5px_0_0_#8B4513] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
            <RefreshCcw size={18} /> Restaurar Corazones
          </button>
          <button onClick={() => router.push('/dashboard')} className="w-full bg-gray-50 border-2 border-gray-200 text-gray-600 font-black py-4 rounded-2xl text-sm uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
            <Home size={16} /> Volver al Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (phase === 'summary') return (
    <LessonSummary score={score} total={exercises.length + (phraseData ? 1 : 0)} xpEarned={score * 10} onRestart={() => window.location.reload()} currentLessonId={lessonId} />
  );

  // --- RENDER FASE 1: ESTUDIO / FLASHCARDS ---
  if (phase === 'study') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-6 flex flex-col items-center font-nunito">
        <header className="w-full max-w-2xl flex justify-between mb-10 items-center">
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2"><BookOpen /> Fase de Estudio</h2>
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600"><X size={28}/></button>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-10">
          {exercises.map((ex, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={ex.id} 
              onClick={() => playWordAudio(ex.audio_url)}
              className={`bg-white p-6 rounded-[2rem] border-2 border-gray-100 flex flex-col items-center shadow-sm relative transition-all group ${ex.audio_url ? 'cursor-pointer hover:border-orange-300 hover:shadow-md active:scale-98' : ''}`}>
              {ex.audio_url && <div className="absolute top-4 right-4 text-gray-300 group-hover:text-orange-500 transition-colors"><Volume2 size={18} /></div>}
              <span className="text-4xl mb-2">{ex.emoji || '✨'}</span>
              <p className="text-xl font-black text-orange-600 uppercase tracking-tight">{ex.word_mazahua}</p>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{ex.word_spanish}</p>
            </motion.div>
          ))}
        </div>
        <Button onClick={() => { setPhase('quiz'); determineQuizType(exercises[0]); }} className="w-full max-w-md py-8 rounded-2xl bg-orange-600 text-white font-black text-xl shadow-[0_6px_0_0_#8B4513] uppercase tracking-wider">
          ¡EMPEZAR PRÁCTICA!
        </Button>
      </div>
    );
  }

  // --- RENDER FASE 3: SINTAXIS / SENTENCE BUILDER ---
  if (phase === 'syntax' && phraseData) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-6 flex flex-col items-center relative font-nunito">
        <div className="w-full max-w-2xl flex items-center justify-between gap-6 mb-10">
          <Progress value={95} className="h-4 flex-1 bg-gray-100" />
          <div className="flex gap-1 text-red-500 font-black">
            {Array(5).fill(0).map((_, i) => <Heart key={i} size={20} fill={i < hearts ? "currentColor" : "none"} />)}
          </div>
        </div>

        <div className="w-full max-w-2xl flex-1 flex flex-col justify-center space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2"><LayoutGrid size={14}/> Módulo de Sintaxis Práctica</h3>
            <h2 className="text-2xl font-black text-gray-700">Ordena los bloques para traducir la oración:</h2>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-100 shadow-sm max-w-xl mx-auto text-center w-full">
            <p className="text-2xl font-black text-orange-600 italic">"{phraseData.spanish}"</p>
          </div>

          <div className="w-full min-h-[80px] p-4 border-b-4 border-dashed border-gray-200 flex flex-wrap gap-2 justify-center items-center">
            {selectedWords.map((word, idx) => (
              <motion.button layout key={`sel-${idx}`} onClick={() => handleWordClick(word, true)} disabled={syntaxChecked}
                className="bg-white px-5 py-3 rounded-xl border-2 border-orange-500 font-black text-gray-800 shadow-sm transition-all">
                {word}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-4 max-w-xl mx-auto">
            {shuffledWords.map((word, idx) => (
              <motion.button layout key={`shuf-${idx}`} onClick={() => handleWordClick(word, false)} disabled={syntaxChecked}
                className="bg-gray-100 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-black shadow-sm hover:bg-white hover:border-gray-300 transition-all">
                {word}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md pt-6">
          {!syntaxChecked ? (
            <Button onClick={verifySyntax} disabled={selectedWords.length === 0}
              className="w-full py-6 rounded-2xl bg-green-600 text-white font-black text-lg shadow-[0_6px_0_0_#16a34a] disabled:opacity-50 uppercase tracking-wide">
              COMPROBAR ORACIÓN
            </Button>
          ) : (
            <Button onClick={saveProgress} className={`w-full py-6 rounded-2xl font-black text-lg text-white uppercase tracking-wide ${isSyntaxCorrect ? 'bg-green-600 shadow-[0_6px_0_0_#16a34a]' : 'bg-red-600 shadow-[0_6px_0_0_#dc2626]'}`}>
              CONTINUAR
            </Button>
          )}
        </div>

        <AnimatePresence>
          {syntaxChecked && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className={`fixed bottom-0 left-0 right-0 p-8 ${isSyntaxCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border-t-4 flex flex-col items-center z-40`}>
              <div className="max-w-2xl w-full flex items-center justify-between">
                <div>
                  <p className={`font-black text-2xl ${isSyntaxCorrect ? 'text-green-700' : 'text-red-700'}`}>{isSyntaxCorrect ? '¡Estructura Sintáctica Perfecta!' : 'Estructura incorrecta'}</p>
                  <p className="text-gray-700 font-bold mt-1">Solución: <span className="underline">{phraseData.mazahua}</span></p>
                </div>
                <Button onClick={saveProgress} className={`py-4 px-10 rounded-xl font-black text-white ${isSyntaxCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  CONTINUAR
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- RENDER FASE 2: QUIZ MULTIMODAL ALTERNANTE ---
  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 flex flex-col items-center relative">
      <div className="w-full max-w-2xl flex items-center justify-between gap-6 mb-10">
        <Progress value={(currentStep / exercises.length) * 100} className="h-4 flex-1" />
        <div className="flex gap-1 text-red-500 font-black">
          {Array(5).fill(0).map((_, i) => <Heart key={i} size={20} fill={i < hearts ? "currentColor" : "none"} />)}
        </div>
      </div>

      <div className="w-full max-w-xl space-y-8 flex-1 flex flex-col justify-center">
        <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center">
          <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest mb-4 flex items-center justify-center gap-2">
            {quizType === 'audio_to_text' && <><Volume2 size={14}/> Escucha el audio y traduce</>}
            {quizType === 'image_to_text' && <><Eye size={14}/> ¿Qué representa esta imagen?</>}
            {quizType === 'text' && <><Brain size={14}/> Selecciona la traducción</>}
          </h3>
          
          <div onClick={() => quizType === 'audio_to_text' && playWordAudio(exercises[currentStep]?.audio_url)}
            className={`bg-white p-12 rounded-[3.5rem] border-2 border-gray-100 shadow-sm mb-10 relative flex flex-col items-center justify-center min-h-[200px] ${quizType === 'audio_to_text' ? 'cursor-pointer border-orange-200 hover:bg-orange-50/30' : ''}`}>
            {quizType === 'text' && <p className="text-5xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>{exercises[currentStep].word_mazahua}</p>}
            {quizType === 'image_to_text' && <div className="space-y-4"><span className="text-7xl block animate-bounce">{exercises[currentStep].emoji || '✨'}</span><p className="text-3xl font-black text-gray-700">{exercises[currentStep].word_mazahua}</p></div>}
            {quizType === 'audio_to_text' && <div className="flex flex-col items-center gap-3"><div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shadow-md animate-pulse"><Volume2 size={36} /></div><p className="text-sm font-black text-orange-700 uppercase tracking-wider">Toca para volver a oír</p></div>}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button key={opt} onClick={() => handleQuizAnswer(opt)} disabled={selectedOption !== null}
                className={`py-6 px-8 rounded-2xl border-2 font-black text-lg transition-all text-left flex justify-between items-center ${selectedOption === opt ? opt === exercises[currentStep].word_spanish ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700' : selectedOption && opt === exercises[currentStep].word_spanish ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedOption && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className={`fixed bottom-0 left-0 right-0 p-8 ${isCorrect ? 'bg-green-100' : 'bg-red-100'} border-t-4 ${isCorrect ? 'border-green-500' : 'border-red-500'} flex flex-col items-center z-40`}>
            <div className="max-w-2xl w-full flex items-center justify-between">
              <div>
                <p className={`font-black text-2xl ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{isCorrect ? '¡Excelente trabajo!' : 'Sigue practicando'}</p>
                <p className="text-gray-700 font-bold mt-1">{exercises[currentStep].word_mazahua} = <span className="underline">{exercises[currentStep].word_spanish}</span></p>
              </div>
              <Button onClick={nextStep} className={`py-4 px-10 rounded-xl font-black text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                CONTINUAR
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSaving && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="animate-spin text-orange-600 mb-2" />
          <p className="font-black text-xs uppercase tracking-widest text-orange-800">Guardando progreso...</p>
        </div>
      )}
    </div>
  );
}