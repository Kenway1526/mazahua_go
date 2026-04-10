"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Video, PlayCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase.from('recursos').select('*').eq('tipo', 'video');
      if (data) setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 font-nunito">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-500 font-bold"><ArrowLeft size={20} /> Volver</button>
      <h1 className="text-3xl font-black text-gray-800 mb-8" style={{ fontFamily: 'var(--font-fredoka)' }}>Videos y Documentales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className="bg-white overflow-hidden rounded-[2.5rem] shadow-sm group border-2 border-transparent hover:border-blue-100 transition-all">
            <div className="aspect-video bg-gray-200 flex items-center justify-center relative">
              <PlayCircle className="text-white opacity-80 group-hover:scale-110 transition-transform" size={48} />
            </div>
            <div className="p-6">
              <h3 className="font-black text-gray-800 text-xl mb-2">{vid.titulo}</h3>
              <a href={vid.url} target="_blank" className="text-blue-500 font-bold text-sm">Ver en YouTube →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}