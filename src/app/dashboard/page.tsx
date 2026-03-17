import { Star } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-16 pb-12 bg-[#F58427]">
      {/* 1. Sección Desafío (Mejoramos padding y alineación) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white p-10 rounded-3xl shadow-sm">
        <div className="text-center md:text-left space-y-5">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#2D2D2D] leading-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>
            Intenta completar un nuevo desafío
          </h1>
          <p className="text-lg text-gray-600 font-medium">Aprender Mazahua nunca fue tan divertido</p>
          <button className="px-10 py-3 bg-[#8B4513] text-white rounded-full font-bold shadow-lg hover:bg-[#5D2B12] transition-all">
            Conocer más
          </button>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="w-72 h-72 bg-[#D4641C]/10 rounded-full flex items-center justify-center text-[160px] shadow-inner">
            🦊 {/* Tu ilustración del zorro aquí */}
          </div>
        </div>
      </section>

      {/* 2. Vocabulario (Ajuste CRÍTICO: Mayor altura y padding en tarjetas) */}
      <section className="space-y-10 text-center">
        <h2 className="text-4xl font-bold text-[#2D2D2D]" style={{ fontFamily: 'var(--font-fredoka)' }}>Vocabulario</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { t: "Frutas y verduras", i: "🫐" },
            { t: "Colores", i: "🖍️" },
            { t: "Números", i: "🎱" },
            { t: "Saludos", i: "☀️" }
          ].map((item) => (
            // AJUSTE: h-auto con min-h-[220px] y py-10 para darles aire
            <div key={item.t} className="bg-white p-8 rounded-3xl shadow-sm hover:translate-y-[-8px] transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]">
              <div className="text-7xl mb-5">{item.i}</div>
              <p className="font-bold text-gray-800 text-lg leading-snug">{item.t}</p>
            </div>
          ))}
        </div>
        <button className="px-12 py-3 bg-gradient-to-r from-[#D4641C] to-[#8B4513] text-white rounded-full font-bold shadow-md hover:opacity-95 transition-opacity">
          Ver más
        </button>
      </section>

      {/* 3. Sección Recursos (Ajuste CRÍTICO: Altura para los iconos y textos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Historia - Mayor padding y espaciado vertical */}
        <div className="bg-white p-12 rounded-3xl shadow-sm flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl font-bold text-[#2D2D2D]" style={{ fontFamily: 'var(--font-fredoka)' }}>Historia de la lengua Mazahua</h2>
          <div className="text-9xl py-6">🪆</div>
          <p className="font-medium text-lg text-gray-600 max-w-sm">Descubre su historia, ubicación y datos curiosos!</p>
          <button className="px-10 py-3 bg-[#8B4513] text-white rounded-full font-bold shadow-md">Ver más</button>
        </div>

        {/* Recursos - Ajuste de altura para que el texto de abajo no se corte */}
        <div className="bg-white p-12 rounded-3xl shadow-sm flex flex-col items-center gap-8">
          <h2 className="text-3xl font-bold text-[#2D2D2D]" style={{ fontFamily: 'var(--font-fredoka)' }}>Lecturas, videos y más ...</h2>
          <div className="grid grid-cols-3 gap-6 w-full">
            {['Lecturas', 'Videos', 'Traductor'].map(v => (
              <div key={v} className="flex flex-col items-center gap-4">
                {/* AJUSTE: w-full h-auto min-h-[140px] para que el icono tenga espacio */}
                <div className="w-full min-h-[140px] bg-[#F3F4F6] rounded-2xl flex items-center justify-center text-6xl shadow-inner border border-gray-100">
                  📖
                </div>
                {/* Texto bien espaciado */}
                <span className="text-sm font-bold uppercase tracking-widest text-gray-800">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}