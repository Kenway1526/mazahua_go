export interface Perfil {
  id: string;
  username: string;
  avatar_url?: string;
  xp: number;
  streak: number;
}

export interface Vocablo {
  id: string;
  mazahua: string;
  espanol: string;
  categoria: 'frutas' | 'colores' | 'animales' | 'saludos' | 'naturaleza';
  audio_url?: string;
  image_url?: string;
}

export interface Leccion {
  id: string;
  nivel: number;
  titulo: string;
  completada: boolean;
  bloqueada: boolean;
}