"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LecturasPage() {
  const [recursos, setRecursos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLecturas = async () => {
      const { data } = await supabase
        .from('recursos')
        .select('*')
        .eq('tipo', 'lectura');
      if (data) setRecursos(data);
    };
    fetchLecturas();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 font-nunito">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-500 font-bold">
        <ArrowLeft size={20} /> Volver
      </button>
      <h1 className="text-3xl font-black text-gray-800 mb-8" style={{ fontFamily: 'var(--font-fredoka)' }}>Lecturas en Jñatjo</h1>
      <div className="grid gap-4">
        {recursos.map((pdf) => (
          <div key={pdf.id} className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center justify-between border-2 border-transparent hover:border-orange-100 transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><FileText /></div>
              <div>
                <h3 className="font-black text-gray-800">{pdf.titulo}</h3>
                <p className="text-sm text-gray-500">{pdf.descripcion}</p>
              </div>
            </div>
            <a href={pdf.url} target="_blank" className="p-3 bg-gray-100 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
              <Download size={20} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}