"use client";

import { ArrowLeft, Heart, Users, ShieldCheck, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NosotrosPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-20 font-nunito">
      {/* Header con navegación */}
      <div className="bg-white p-6 shadow-sm flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>Sobre Mazahua Go!</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* Sección 1: Quiénes somos */}
        <section className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-1 bg-orange-100 text-[#D4641C] rounded-full text-xs font-black uppercase tracking-widest">
              Nuestra Esencia
            </div>
            <h2 className="text-4xl font-black text-gray-800 leading-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>
              Tecnología al servicio de la <span className="text-[#D4641C]">Cultura Jñatjo</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Mazahua Go! nace de la necesidad de rescatar y difundir una de las lenguas más ricas del centro de México. No somos solo una app de idiomas; somos un puente digital que conecta a las nuevas generaciones con la sabiduría de sus ancestros.
            </p>
          </div>
          <div className="w-full md:w-80 h-80 bg-orange-200 rounded-[3rem] overflow-hidden shadow-xl rotate-3">
             <img src="/images/doll-mazahua.png" alt="Cultura" className="w-full h-full object-contain p-8" />
          </div>
        </section>

        {/* Sección 2: Pilares (Valores) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PilarCard 
            icon={<Heart className="text-red-500" />} 
            title="Pasión" 
            desc="Amamos nuestras raíces y creemos en el poder de la identidad." 
          />
          <PilarCard 
            icon={<Globe className="text-blue-500" />} 
            title="Inclusión" 
            desc="Integramos las variantes Oriental y Occidental para unir al pueblo." 
          />
          <PilarCard 
            icon={<ShieldCheck className="text-green-500" />} 
            title="Rescate" 
            desc="Usamos tecnología de vanguardia para que el Mazahua nunca muera." 
          />
        </div>

        {/* Sección 3: El Equipo */}
        <section className="bg-[#D4641C] rounded-[3rem] p-10 md:p-16 text-white text-center space-y-6 shadow-2xl">
          <Users size={48} className="mx-auto opacity-80" />
          <h2 className="text-3xl font-black" style={{ fontFamily: 'var(--font-fredoka)' }}>Unidos por la Lengua</h2>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo está conformado por desarrolladores apasionados y hablantes nativos que trabajan día a día para validar cada palabra, audio y lección.
          </p>
          <div className="pt-6 flex justify-center gap-4">
             <div className="w-12 h-12 bg-white/20 rounded-full"></div>
             <div className="w-12 h-12 bg-white/20 rounded-full"></div>
             <div className="w-12 h-12 bg-white/20 rounded-full"></div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PilarCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:scale-105 transition-all text-center space-y-3">
      <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">{icon}</div>
      <h3 className="font-black text-gray-800 text-xl">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}