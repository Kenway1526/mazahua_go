"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Flame, Trophy, Star, LogOut, Loader2, Edit3, Mail } from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [actividadSemanal, setActividadSemanal] = useState<number[]>([]);

  useEffect(() => {
    async function cargarPerfilCompleto() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return router.push("/login");

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        const sieteDiasAtras = new Date();
        sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

        const { data: progreso } = await supabase
          .from("user_progress")
          .select("created_at")
          .eq("user_id", session.user.id)
          .eq("completed", true)
          .gte("created_at", sieteDiasAtras.toISOString());

        const diasActivos = progreso?.map(p => new Date(p.created_at).getDay()) || [];
        setUser({ ...session.user, ...profile });
        setActividadSemanal([...new Set(diasActivos)]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarPerfilCompleto();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <Loader2 className="w-10 h-10 animate-spin text-[#D4641C]" />
    </div>
  );

  const diasSemana = [
    { label: 'D', id: 0 }, { label: 'L', id: 1 }, { label: 'M', id: 2 },
    { label: 'Mi', id: 3 }, { label: 'J', id: 4 }, { label: 'V', id: 5 }, { label: 'S', id: 6 }
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-24 font-nunito">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Identidad */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm flex flex-col items-center text-center space-y-5 border border-gray-100">
          <div className="w-28 h-28 bg-[#F3E5D8] rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#8B4513] text-4xl font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>
              {user?.username || "Usuario"}
            </h1>
            <p className="text-gray-400 font-medium flex items-center justify-center gap-2">
              <Mail size={14} /> {user?.email}
            </p>
          </div>
          <Link href="/perfil/edit" className="flex items-center gap-2 px-8 py-2.5 border-2 border-gray-100 rounded-2xl text-gray-600 font-extrabold text-sm hover:bg-gray-50 transition-all">
            <Edit3 size={16} /> Editar Perfil
          </Link>
        </section>

        {/* Racha */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm space-y-8 border border-gray-100 text-center">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-xl justify-center">
            <Flame className="text-orange-500 fill-orange-500" size={24} />
            <h2 style={{ fontFamily: 'var(--font-fredoka)' }}>Racha de estudio</h2>
          </div>
          <div className="flex justify-between items-center max-w-md mx-auto">
            {diasSemana.map((dia) => (
              <div key={dia.id} className="flex flex-col items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${actividadSemanal.includes(dia.id) ? 'bg-orange-500 text-white shadow-[0_4px_0_0_#C2410C]' : 'bg-gray-100 text-gray-300'}`}>
                  <Flame size={22} className={actividadSemanal.includes(dia.id) ? 'fill-white' : ''} />
                </div>
                <span className="text-xs font-black">{dia.label}</span>
              </div>
            ))}
          </div>
          <p className="text-2xl font-black text-[#D4641C]">¡{user?.streak || 0} días seguidos! 🎊</p>
        </section>

        <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="w-full bg-red-50 text-red-500 py-5 rounded-[2rem] font-black border-2 border-red-100">
          Cerrar Sesión
        </button>
      </div>
    </main>
  );
}
// Sub-componente para los Logros
function LogroCard({ icon, title, desc, unlocked }: { icon: any, title: string, desc: string, unlocked: boolean }) {
  return (
    <div className={`flex items-center gap-5 p-5 rounded-3xl border-2 transition-all ${unlocked ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50/50 border-gray-50 opacity-40 grayscale'}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${unlocked ? 'bg-orange-50' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-black text-gray-800 text-lg leading-tight">{title}</span>
        <span className="text-sm text-gray-500 font-medium">{desc}</span>
      </div>
    </div>
  );
}