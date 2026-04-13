"use client"

import { Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function HeartsDisplay({ lives }: { lives: number }) {
  return (
    <div className="flex gap-1.5 items-center bg-white px-4 py-2 rounded-2xl border-2 border-gray-100 shadow-sm min-w-[140px] justify-center">
      <AnimatePresence mode="popLayout">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Heart
              size={20}
              strokeWidth={2.5}
              // Si el índice es menor a las vidas actuales, se pinta rojo
              className={`${
                i < lives 
                ? "fill-red-500 text-red-500" 
                : "fill-gray-100 text-gray-200"
              } transition-colors duration-300`}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}