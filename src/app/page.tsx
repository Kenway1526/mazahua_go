'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Definimos una interfaz básica para la lección (Scalability Tip)
interface Leccion {
  id: string
  titulo: string
  nivel: string
}

export default function Home() {
  const [lecciones, setLecciones] = useState<Leccion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        setLoading(true)
        
        // Intentamos pedir datos de la tabla 'lecciones'
        const { data, error: supabaseError } = await supabase
          .from('lecciones')
          .select('*')

        if (supabaseError) throw supabaseError

        setLecciones(data || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error conectando a Supabase:', err)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Proyecto Lengua Mazahua 🇲🇽</h1>
      <hr />

      <section style={{ marginTop: '1rem' }}>
        <h2>Estado de la Conexión:</h2>
        
        {loading && <p>⌛ Verificando conexión con Supabase...</p>}

        {error && (
          <div style={{ color: 'red', border: '1px solid red', padding: '1rem' }}>
            <p>❌ Error de conexión:</p>
            <code>{error}</code>
            <p><small>Tip: Revisa que tus llaves en .env.local no tengan comillas y hayas reiniciado la terminal.</small></p>
          </div>
        )}

        {!loading && !error && (
          <div style={{ color: 'green', border: '1px solid green', padding: '1rem' }}>
            <p>✅ ¡Conexión establecida con éxito!</p>
            <p>Se encontraron {lecciones.length} lecciones en la base de datos.</p>
          </div>
        )}
      </section>

      {lecciones.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h3>Lecciones Disponibles:</h3>
          <ul>
            {lecciones.map((item) => (
              <li key={item.id}>
                <strong>{item.titulo}</strong> - Nivel: {item.nivel}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}