'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TraductorPage() {
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState('')

  const traducir = async (valor: string) => {
    setTexto(valor)
    if (valor.length < 2) {
      setResultado('')
      return
    }

    // Buscamos en la base de datos (Búsqueda por español)
    const { data } = await supabase
      .from('vocabulary')
      .select('word_mazahua')
      .ilike('word_spanish', `%${valor}%`)
      .single()

    setResultado(data ? data.word_mazahua : '...')
  }

  return (
    <div className="p-8 bg-[#FAF8F5] min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Mini-Traductor</h1>
      <div className="bg-white p-8 rounded-3xl shadow-sm w-full max-w-md space-y-4">
        <input 
          type="text"
          placeholder="Escribe en Español (ej: Casa)"
          className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-orange-500"
          onChange={(e) => traducir(e.target.value)}
        />
        <div className="flex justify-center text-4xl text-orange-600">⇌</div>
        <div className="w-full p-6 rounded-2xl bg-orange-50 border-2 border-orange-100 text-center">
          <p className="text-sm uppercase tracking-widest text-orange-400 font-bold mb-1">Mazahua</p>
          <p className="text-2xl font-bold text-gray-800">{resultado || 'Esperando...'}</p>
        </div>
      </div>
    </div>
  )
}