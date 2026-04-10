import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Este cliente es el que "habla" con el Middleware a través de cookies
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export const getMediaUrl = (path: string | null, bucket: string = 'resources') => {
  if (!path) return '/images/placeholder.png'; // Imagen por defecto
  
  // Si el path ya es una URL (Cloudinary), la devolvemos tal cual
  if (path.startsWith('http')) return path;

  // Si es un path interno, lo buscamos en Supabase Storage
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};