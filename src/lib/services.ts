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

export const completarLeccion = async (userId: string, lessonId: string) => {
  try {
    // 1. Registrar el progreso de la lección
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId, 
        lesson_id: lessonId, 
        completed: true,
        updated_at: new Date().toISOString()
      });

    if (progressError) throw progressError;

    // 2. Llamar a la función SQL de racha y sumar XP (ej: +10 XP)
    // Usamos .rpc() para llamar a funciones personalizadas de Postgres
    const { error: rpcError } = await supabase.rpc('actualizar_racha_usuario', {
      user_id_param: userId
    });

    if (rpcError) throw rpcError;

    // 3. Sumar XP al perfil
    const { error: xpError } = await supabase
      .rpc('incrementar_xp', { user_id_param: userId, cantidad: 10 });

    return { success: true };
  } catch (error) {
    console.error("Error al guardar progreso:", error);
    throw error;
  }
};

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

