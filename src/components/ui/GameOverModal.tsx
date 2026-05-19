"use client";

import React from 'react';
import { Heart, Home, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface GameOverModalProps {
  isOpen: boolean;
  onReset: () => void;
}

export default function GameOverModal({ isOpen, onReset }: GameOverModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#FAF8F5]/95 z-50 flex flex-col items-center justify-center p-6 font-nunito animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-8 text-center shadow-xl border-b-8 border-red-100 flex flex-col items-center space-y-6"
      >
        {/* Iconografía de Vidas Agotadas */}
        <div className="relative flex items-center justify-center">
          <Heart size={80} className="text-red-200" fill="currentColor" />
          <span className="absolute font-black text-red-600 text-4xl" style={{ fontFamily: 'var(--font-fredoka)' }}>✕</span>
        </div>

        {/* Textos de Bloqueo Pedagógico */}
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>
            ¡Se acabaron las vidas!
          </h2>
          <p className="text-gray-500 font-medium text-sm px-4">
            Has cometido demasiados errores en esta sesión. Tómate un respiro para repasar tus lecturas y vocabulario Jñatjo antes de volver a intentarlo.
          </p>
        </div>

        {/* Acciones de Recuperación o Retorno */}
        <div className="w-full space-y-3 pt-4">
          <button 
            onClick={onReset}
            className="w-full bg-[#D4641C] text-white font-black py-4 rounded-2xl text-base uppercase tracking-widest shadow-[0_5px_0_0_#8B4513] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} strokeWidth={3} /> Restaurar Corazones
          </button>
          
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gray-50 border-2 border-gray-200 text-gray-600 font-black py-4 rounded-2xl text-sm uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} strokeWidth={2} /> Volver al Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}