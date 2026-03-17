import Image from 'next/image'

export default function AuthHero() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-64 h-32 mb-8">
        {/* Aquí iría tu logo jnatrjo */}
        <h1 className="text-4xl font-serif text-purple-900 text-center">
          mazahuaGo! <br/>
          <span className="text-sm font-sans text-orange-400">jnatrjo</span>
        </h1>
      </div>
      <div className="relative w-80 h-80">
        {/* Reemplaza con la ruta real de tu imagen del venado */}
        <img 
          src="/images/venado-mazahua.png" 
          alt="Mazahua Mascot" 
          className="object-contain"
        />
      </div>
    </div>
  )
}