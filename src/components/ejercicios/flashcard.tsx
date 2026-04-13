"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from "@/components/ui/card"

interface FlashcardProps {
  word_mazahua: string;
  word_spanish: string;
  emoji?: string;
}

export function Flashcard({ word_mazahua, word_spanish, emoji }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="perspective-1000 w-full max-w-sm h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Lado Frontal (Jñatjo) */}
        <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 border-b-8 border-orange-200 rounded-[2.5rem] bg-white">
          <span className="text-6xl mb-4">{emoji || "✨"}</span>
          <h2 className="text-3xl font-black text-[#D4641C] uppercase tracking-tight text-center">
            {word_mazahua}
          </h2>
          <p className="text-gray-400 font-bold mt-4 uppercase text-xs">Toca para voltear</p>
        </Card>

        {/* Lado Posterior (Español) */}
        <Card 
          className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 border-b-8 border-blue-200 rounded-[2.5rem] bg-blue-50"
          style={{ transform: "rotateY(180deg)" }}
        >
          <h3 className="text-4xl font-black text-blue-600 uppercase">
            {word_spanish}
          </h3>
          <p className="text-blue-400 font-bold mt-2 uppercase text-xs">Significado</p>
        </Card>
      </motion.div>
    </div>
  )
}