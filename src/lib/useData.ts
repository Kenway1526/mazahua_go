import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Vocablo } from '@/types';

export function useVocabulario() {
  const [vocabulario, setVocabulario] = useState<Vocablo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*');
      
      if (!error && data) {
        setVocabulario(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return { vocabulario, loading };
}