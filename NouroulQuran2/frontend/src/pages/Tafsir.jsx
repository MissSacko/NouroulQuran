
import { useEffect, useState } from 'react'
import PageHeaderr from '../components/PageHeaderr'
import TafsirCard from '../components/TafsirCard'
import { getTafsirs } from '../services/api'

export default function Tafsir() {
  const [tafsirs, setTafsirs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getTafsirs()
      .then((data) => {
        if (active) {
          setTafsirs(
            [...data].sort((a, b) =>
              (b.date || '').localeCompare(a.date || '')
            )
          )
        }
      })
      .catch(() => {
        if (active) setError('Impossible de charger les séances de Tafsir.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main>
      <PageHeaderr
        eyebrow="Tafsir du Coran"
        title="Nos séances de Tafsir"
        text="Retrouvez les séances de Tafsir, leurs intervenants et les enseignements disponibles."
      />

      <section className="section">
        <div className="container">
          {loading && <p>Chargement des séances…</p>}
          {error && <p role="alert">{error}</p>}

          {!loading && !error && tafsirs.length === 0 && (
            <p>Aucune séance publiée pour le moment.</p>
          )}

          {!loading && !error && (
            <div className="cards-grid sessions-grid tafsir-grid">
              {tafsirs.map((tafsir) => (
                <TafsirCard
                  key={tafsir.id || tafsir.slug}
                  tafsir={tafsir}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
