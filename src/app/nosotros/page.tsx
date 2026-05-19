"use client";

import { ArrowLeft, Heart, Users, ShieldCheck, Globe, Target, Facebook, Instagram, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NosotrosPage() {
  const router = useRouter();

  const equipo = [
    {
      nombre: "Jonathan Esquivel Flores",
      rol: "Lead Systems Engineer & Full-Stack Developer",
      bio: "Especializado en la creación de arquitecturas de datos seguras en Supabase, automatización analítica de procesos y entornos educativos de alto rendimiento con Next.js.",
      fb: "https://facebook.com",
      ig: "https://instagram.com"
    },
    {
      nombre: "Mascota Jñatjo (Zorro)",
      rol: "UX/UI Gamification Guide",
      bio: "Elemento de acompañamiento interactivo y retención lúdica. Responsable de incentivar las rachas diarias y gestionar el ciclo operacional de vidas.",
      fb: "https://facebook.com",
      ig: "https://instagram.com"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-24 font-nunito">
      {/* Header con Navegación Consistente */}
      <div className="bg-white p-6 shadow-sm flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-full transition-all cursor-pointer">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'var(--font-fredoka)' }}>Sobre Mazahua Go!</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* Sección 1: Quiénes somos */}
        <section className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full border border-orange-100">
              <Award size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">InnovaTec 2026</span>
            </div>
            <h2 className="text-4xl font-black text-gray-800 leading-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>
              Tecnología al servicio de la <span className="text-[#D4641C]">Cultura Jñatjo</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Mazahua Go! nace de la necesidad de rescatar y difundir una de las lenguas más ricas del centro de México. No somos solo una app de idiomas; somos un puente digital que conecta a las nuevas generaciones con la sabiduría de sus ancestros.
            </p>
          </div>
          <div className="w-full md:w-85 h-85 bg-orange-100 rounded-[3rem] overflow-hidden shadow-sm flex items-center justify-center p-6 border-4 border-white">
             <img src="/images/muneca.png" alt="Cultura" className="w-full h-full object-contain p-2" />
          </div>
        </section>

        {/* Sección 2: Misión y Objetivo General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-8 border-green-100 space-y-4">
            <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center text-green-600">
              <Heart size={24} fill="currentColor" />
            </div>
            <h3 className="font-black text-gray-800 text-xl" style={{ fontFamily: 'var(--font-fredoka)' }}>Nuestra Misión</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Preservar, difundir y revitalizar la lengua y cultura Mazahua (Jñatjo) a través de herramientas tecnológicas interactivas y accesibles, conectando a las nuevas generaciones con sus raíces lingüísticas de forma pedagógica y gamificada.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-8 border-blue-100 space-y-4">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600">
              <Target size={24} />
            </div>
            <h3 className="font-black text-gray-800 text-xl" style={{ fontFamily: 'var(--font-fredoka)' }}>Objetivo General</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Desarrollar una plataforma digital educativa integral que permita la enseñanza y evaluación de las variantes Oriental y Occidental del idioma Mazahua mediante módulos analíticos de rendimiento y gamificación.
            </p>
          </div>
        </div>

        {/* Sección 3: El Equipo / Perfiles del Proyecto */}
        <section className="space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2 justify-center md:justify-start" style={{ fontFamily: 'var(--font-fredoka)' }}>
              <Users className="text-[#D4641C]" /> Integrantes Fundadores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipo.map((miembro, index) => (
              <div key={index} className="bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-sm flex flex-col justify-between space-y-6 hover:border-orange-200 transition-all group">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xl font-black text-gray-800 group-hover:text-[#D4641C] transition-colors">{miembro.nombre}</h4>
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-wider mt-0.5">{miembro.rol}</p>
                  </div>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{miembro.bio}</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <a href={miembro.fb} target="_blank" rel="noreferrer" className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Facebook size={18} fill="currentColor" />
                  </a>
                  <a href={miembro.ig} target="_blank" rel="noreferrer" className="p-2.5 bg-gray-50 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all">
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}