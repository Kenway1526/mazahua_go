"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface QuizVisualProps {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizVisual({ pregunta, opciones, respuestaCorrecta, onAnswer }: QuizVisualProps) {
  return (
    <div className="w-full max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm">¿Cómo se dice en Jñatjo?</h3>
        <h2 className="text-5xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
          {pregunta}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {opciones.map((opcion, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onAnswer(opcion === respuestaCorrecta)}
              className="w-full py-8 rounded-[2rem] text-xl font-bold bg-white text-gray-700 border-2 border-gray-100 hover:border-orange-400 hover:bg-orange-50 transition-all shadow-sm"
            >
              <span className="bg-orange-100 text-[#D4641C] w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm">
                {index + 1}
              </span>
              {opcion}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}