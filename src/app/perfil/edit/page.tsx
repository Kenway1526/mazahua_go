"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Camera, Save, ArrowLeft, Loader2, Lock, User } from "lucide-react";

export default function EditPerfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/login");
      setUser(session.user);
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (profile) {
        setNombre(profile.username || "");
        setAvatarUrl(profile.avatar_url || null);
      }
    }
    loadUser();
  }, [router]);

  const uploadAvatar = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars') // <--- Asegúrate que diga 'avatars' en minúsculas
        .upload(fileName, file);

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(publicUrl);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error: profileError } = await supabase.from('profiles').update({ username: nombre, avatar_url: avatarUrl }).eq('id', user.id);
      if (profileError) throw profileError;
      if (password) await supabase.auth.updateUser({ password });
      router.push("/perfil");
      router.refresh();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] p-6 font-nunito">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/perfil')} className="p-2 bg-white rounded-full shadow-sm"><ArrowLeft size={20} /></button>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-fredoka)' }}>Editar Perfil</h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <div className="w-full h-full rounded-full bg-orange-100 overflow-hidden border-4 border-white shadow-md flex items-center justify-center">
              {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" /> : <User size={60} className="text-[#8B4513]" />}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-[#D4641C] text-white rounded-full cursor-pointer shadow-lg">
              {uploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
              <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} />
            </label>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-500 uppercase ml-2">
              Nombre de usuario
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full h-14 pl-12 pr-4 bg-orange-50/50 rounded-2xl border-2 border-transparent focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-500 uppercase ml-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-orange-50/50 rounded-2xl border-2 border-transparent focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={loading || uploading} className="w-full bg-[#D4641C] text-white py-5 rounded-[2rem] font-black shadow-[0_5px_0_0_#8B4513]">
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </main>
  );
}