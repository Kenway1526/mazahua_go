"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Headphones, Play, Pause, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AudiosPage() {
  const [audios, setAudios] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAudios = async () => {
      const { data } = await supabase.from('recursos').select('*').eq('tipo', 'audio');
      if (data) setAudios(data);
    };
    fetchAudios();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 font-nunito">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-500 font-bold"><ArrowLeft size={20} /> Volver</button>
      <h1 className="text-3xl font-black text-gray-800 mb-8" style={{ fontFamily: 'var(--font-fredoka)' }}>Audios de Práctica</h1>
      <div className="space-y-4">
        {audios.map((aud) => (
          <div key={aud.id} className="bg-white p-5 rounded-[2rem] shadow-sm flex items-center gap-4">
            <button className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all">
              <Play size={20} fill="currentColor" />
            </button>
            <div>
              <p className="font-black text-gray-800">{aud.titulo}</p>
              <p className="text-xs text-gray-400 font-bold uppercase">Mazahua Pronunciation</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}