"use client";

import { ArrowLeft, BookOpen, MapPin, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoriaPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-20 font-nunito">
      {/* Hero Section con Imagen */}
      <div className="relative h-64 bg-[#8B4513] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('/images/pattern-mazahua.png')] bg-repeat"></div>
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="relative text-4xl md:text-5xl font-black text-white text-center px-6" style={{ fontFamily: 'var(--font-fredoka)' }}>
          El Pueblo Jñatjo
        </h1>
      </div>

      <div className="max-w-3xl mx-auto -mt-10 relative px-6 space-y-8">
        {/* Card Introductoria */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border-b-8 border-orange-100">
          <div className="flex items-center gap-3 text-orange-600 font-black uppercase text-sm mb-4 tracking-widest">
            <Sparkles size={18} />
            <span>Orígenes</span>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            Los Mazahuas se autodenominan <span className="text-[#D4641C] font-black">Jñatjo</span>, que significa "los que hablan la lengua propia". Son el pueblo indígena más numeroso del Estado de México y Michoacán.
          </p>
        </section>

        {/* Grid de Datos Curiosos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-8 rounded-[2rem] border-2 border-blue-100 space-y-3">
            <MapPin className="text-blue-500" size={28} />
            <h3 className="text-xl font-black text-gray-800">Ubicación</h3>
            <p className="text-gray-600 font-medium">Habitan principalmente en la zona noroeste del Estado de México, en municipios como San Felipe del Progreso e Ixtlahuaca.</p>
          </div>

          <div className="bg-purple-50 p-8 rounded-[2rem] border-2 border-purple-100 space-y-3">
            <BookOpen className="text-purple-500" size={28} />
            <h3 className="text-xl font-black text-gray-800">Cosmovisión</h3>
            <p className="text-gray-600 font-medium">Su cultura está íntimamente ligada a la tierra, el respeto por los ancianos y la preservación de su lengua milenaria.</p>
          </div>
        </div>

        {/* Sección de Texto Largo */}
        <section className="space-y-6 text-gray-600 leading-relaxed text-lg">
          <h2 className="text-3xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>Identidad y Resistencia</h2>
          <p>
            A lo largo de los siglos, el pueblo Mazahua ha mantenido viva su identidad a través de sus textiles, su organización comunitaria y, sobre todo, su lengua. El Jñatjo pertenece a la familia lingüística oto-mangue.
          </p>
          <img 
            src="/images/mazahua-crafts.jpg" 
            alt="Artesanías Mazahuas" 
            className="w-full h-64 object-cover rounded-[2.5rem] shadow-md border-4 border-white"
          />
          <p>
            Esta aplicación, <span className="font-bold text-[#D4641C]">Mazahua Go!</span>, nace como un esfuerzo tecnológico para que las nuevas generaciones conecten con este legado y aseguren que el sonido del Jñatjo siga resonando en las montañas del centro de México.
          </p>
        </section>
      </div>
    </main>
  );
}