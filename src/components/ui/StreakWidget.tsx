"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Flame, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StreakWidget() {
  const [streak, setStreak] = useState<number | null>(null);
  const [streakStatus, setStreakStatus] = useState<'active' | 'at_risk' | 'broken'>('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function evaluateStreak() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Recuperar datos de control temporal del perfil del estudiante
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('streak, last_active_date')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          const currentStreak = profile.streak || 0;
          
          if (!profile.last_active_date) {
            // Caso nuevo usuario: racha inicializada en cero
            setStreak(currentStreak);
            setStreakStatus('broken');
            setLoading(false);
            return;
          }

          // Parseo y cálculo de diferencias en el huso horario local
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          
          const ultimaFechaActiva = new Date(profile.last_active_date);
          ultimaFechaActiva.setHours(0, 0, 0, 0);

          const diferenciaTiempo = hoy.getTime() - ultimaFechaActiva.getTime();
          const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

          if (diferenciaDias === 0) {
            // El usuario ya ingresó o hizo actividades hoy
            setStreak(currentStreak);
            setStreakStatus('active');
          } else if (diferenciaDias === 1) {
            // Racha en riesgo: entró ayer pero aún no valida actividad hoy
            setStreak(currentStreak);
            setStreakStatus('at_risk');
          } else {
            // La racha se rompió: pasaron 2 días o más sin ingresos
            setStreak(0);
            setStreakStatus('broken');
            
            // Sincronización asíncrona automática con la base de datos
            await supabase
              .from('profiles')
              .update({ streak: 0 })
              .eq('id', user.id);
          }
        }
      } catch (err) {
        console.error("Error en el motor analítico de racha diaria:", err);
      } finally {
        setLoading(false);
      }
    }

    evaluateStreak();
  }, []);

  if (loading) {
    return (
      <div className="h-12 w-36 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-b-4 transition-all shadow-sm ${
        streakStatus === 'active' 
          ? 'bg-orange-100 border-orange-200 text-orange-700' 
          : streakStatus === 'at_risk'
          ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`}
    >
      <div className="relative">
        <Flame 
          size={22} 
          className={streakStatus === 'active' ? 'text-orange-600 drop-shadow-[0_2px_8px_rgba(234,88,12,0.4)]' : ''} 
          fill={streakStatus !== 'broken' ? 'currentColor' : 'none'} 
        />
        {streakStatus === 'at_risk' && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </div>

      <div className="flex flex-col select-none">
        <span className="font-black text-sm tracking-tight leading-none">
          {streak === 0 ? "¡Inicia racha!" : `${streak} ${streak === 1 ? 'Día' : 'Días'}`}
        </span>
        <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5 opacity-80">
          {streakStatus === 'active' && "¡Racha activa!"}
          {streakStatus === 'at_risk' && "¡Completa una lección!"}
          {streakStatus === 'broken' && "Sin racha"}
        </span>
      </div>
    </motion.div>
  );
}