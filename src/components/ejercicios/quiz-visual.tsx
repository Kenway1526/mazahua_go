"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizProps {
  preguntas: any[];
  onFinish: (score: number) => void;
}

export function QuizVisual({ preguntas, onFinish }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const currentPrendunta = preguntas[currentIdx];

  const handleCheck = () => {
    const correct = selected === currentPrendunta.correcta;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentIdx + 1 < preguntas.length) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      onFinish(score + (isCorrect ? 1 : 0));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Barra de Progreso */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / preguntas.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
            {currentPrendunta.pregunta}
          </h2>

          {/* Imagen de la pregunta */}
          <div className="bg-white p-6 rounded-[3rem] shadow-sm inline-block">
            <img 
              src={currentPrendunta.imagen} 
              alt="Imagen de referencia" 
              className="w-48 h-48 object-contain" 
            />
          </div>

          {/* Opciones */}
          <div className="grid grid-cols-1 gap-4">
            {currentPrendunta.opciones.map((opcion: string) => (
              <button
                key={opcion}
                disabled={isCorrect !== null}
                onClick={() => setSelected(opcion)}
                className={`
                  p-5 rounded-2xl text-xl font-bold border-2 transition-all
                  ${selected === opcion ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}
                  ${isCorrect !== null && opcion === currentPrendunta.correcta ? 'border-green-500 bg-green-50 text-green-700' : ''}
                  ${isCorrect === false && selected === opcion ? 'border-red-500 bg-red-50 text-red-700' : ''}
                `}
              >
                {opcion}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer de Validación */}
      <div className={`fixed bottom-0 left-0 w-full p-6 border-t-2 transition-colors ${
        isCorrect === true ? 'bg-green-100 border-green-200' : 
        isCorrect === false ? 'bg-red-100 border-red-200' : 'bg-white border-gray-100'
      }`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCorrect === true && <><CheckCircle2 className="text-green-600 w-8 h-8" /> <span className="text-green-800 font-bold text-xl">¡Excelente!</span></>}
            {isCorrect === false && <><XCircle className="text-red-600 w-8 h-8" /> <span className="text-red-800 font-bold text-xl">Respuesta correcta: {currentPrendunta.correcta}</span></>}
          </div>

          {isCorrect === null ? (
            <Button 
              disabled={!selected}
              onClick={handleCheck}
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 h-14 rounded-2xl font-bold text-lg shadow-[0_4px_0_0_#8B4513]"
            >
              Comprobar
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className={`${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-10 h-14 rounded-2xl font-bold text-lg shadow-lg`}
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}