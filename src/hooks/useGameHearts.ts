import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useGameHearts(maxHearts = 5) {
  const [hearts, setHearts] = useState<number>(maxHearts);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Cargar las vidas actuales desde el perfil de Supabase
  useEffect(() => {
    async function loadHearts() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('hearts')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile && profile.hearts !== undefined) {
          setHearts(profile.hearts);
          if (profile.hearts <= 0) {
            setIsGameOver(true);
          }
        }
      } catch (err) {
        console.error("Error al recuperar el estado de vidas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHearts();
  }, []);

  // 2. Lógica de consumo ante un fallo en las respuestas
  const consumeHeart = async () => {
    if (hearts <= 0) return;

    const newHearts = hearts - 1;
    setHearts(newHearts);

    if (newHearts <= 0) {
      setIsGameOver(true);
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Sincronizar inmediatamente con la base de datos
      await supabase
        .from('profiles')
        .update({ hearts: newHearts })
        .eq('id', user.id);
    } catch (err) {
      console.error("Error al persistir el descuento de vida:", err);
    }
  };

  // 3. Recarga/Restauración de vidas (por ejemplo, al consumir XP o pasar el día)
  const resetHearts = async () => {
    setHearts(maxHearts);
    setIsGameOver(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({ hearts: maxHearts })
        .eq('id', user.id);
    } catch (err) {
      console.error("Error al restaurar vidas en la BD:", err);
    }
  };

  return {
    hearts,
    isGameOver,
    consumeHeart,
    resetHearts,
    loading
  };
}