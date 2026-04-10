"use client"

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// Definimos la interfaz exacta según tu captura de Supabase
export interface Vocablo {
  id: string;
  word_mazahua: string;
  word_spanish: string;
  category: string;
  audio_url?: string;
  image_url?: string;
  level_id?: number;
}

export function useVocabulario() {
  const [vocabulario, setVocabulario] = useState<Vocablo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .order('id', { ascending: true }); // Opcional: para mantener un orden
      
      if (!error && data) {
        setVocabulario(data as Vocablo[]);
      } else {
        console.error("Error cargando vocabulario:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return { vocabulario, loading };
}