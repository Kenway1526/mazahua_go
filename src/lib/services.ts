import { supabase } from './supabase';

export async function getMapaLecciones() {
  // Traemos los niveles y sus lecciones asociadas
  const { data, error } = await supabase
    .from('levels')
    .select(`
      id,
      nombre,
      orden,
      lessons (
        id,
        titulo,
        tipo_juego,
        orden
      )
    `)
    .order('orden', { ascending: true });

  if (error) {
    console.error("Error cargando mapa:", error);
    return [];
  }
  return data;
}

export async function getContenidoLeccion(id: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function completarLeccion(userId: string, lessonId: string) {
  try {
    // 1. Guardar o actualizar el progreso en user_progress
    // Usamos .upsert para que si ya la completó, solo actualice la fecha
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId, 
        lesson_id: lessonId, 
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id' // Evita duplicados si terminas la misma lección dos veces
      });

    if (progressError) throw progressError;

    // 2. Obtener el XP actual del usuario para incrementarlo
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // 3. Sumar +15 XP por lección completada (puedes ajustar el valor)
    const nuevoXp = (profile?.xp || 0) + 15;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        xp: nuevoXp,
        last_login: new Date().toISOString() // Aprovechamos para marcar actividad
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { success: true, xpGanado: 15 };
    
  } catch (error) {
    console.error("Error en completarLeccion:", error);
    throw error;
  }
}

export async function getMapaConProgreso(userId: string) {
  const { data: niveles } = await supabase
    .from('levels')
    .select(`*, lessons(*)`)
    .order('orden');

  const { data: progreso } = await supabase
    .from('user_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('completed', true);

  const idsCompletados = progreso?.map(p => p.lesson_id) || [];

  return niveles?.map(nivel => ({
    ...nivel,
    lessons: nivel.lessons.map((l: any) => ({
      ...l,
      estado: idsCompletados.includes(l.id) ? 'completada' : 'disponible'
    }))
  }));
}

