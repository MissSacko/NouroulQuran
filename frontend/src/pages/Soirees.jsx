import { useEffect, useMemo, useState } from 'react'
import PageHeaderr from '../components/PageHeaderr'
import FilterBar from '../components/FilterBar'
import SessionCard from '../components/SessionCard'
import { getSoirees, getSeries } from '../services/api'

export default function Soirees() {
  const [soirees, setSoirees] = useState([])
  const [series, setSeries] = useState([])
  const [filter, setFilter] = useState('Toutes')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [soireesData, seriesData] = await Promise.all([
          getSoirees(),
          getSeries(),
        ])

        setSoirees(soireesData)
        setSeries(seriesData)
      } catch (err) {
        console.error(err)
        setError('Impossible de charger les soirées.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Construction dynamique des filtres
  const filters = useMemo(() => {
    return [
      'Toutes',
      'Ordinaire',
      ...series.map((serie) => serie.title),
    ]
  }, [series])

  // Tri par date
  const sorted = useMemo(() => {
    return [...soirees].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  }, [soirees])

  // Filtrage
  const filtered = useMemo(() => {
    if (filter === 'Toutes') {
      return sorted
    }

    if (filter === 'Ordinaire') {
      return sorted.filter((session) => !session.series)
    }

    return sorted.filter(
      (session) => session.series?.title === filter
    )
  }, [sorted, filter])

  if (loading) {
    return (
      <main>
        <PageHeaderr
          eyebrow="Bibliothèque des soirées"
          title="Toutes nos soirées"
          text="Chargement des soirées..."
        />

        <section className="section">
          <div className="container">
            <p className="empty-state">Chargement...</p>
          </div>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <PageHeaderr
          eyebrow="Bibliothèque des soirées"
          title="Toutes nos soirées"
          text="Une erreur est survenue."
        />

        <section className="section">
          <div className="container">
            <p className="empty-state">{error}</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <PageHeaderr
        eyebrow="Bibliothèque des soirées"
        title="Toutes nos soirées"
        text={`${soirees.length} soirées enregistrées dans notre parcours Nouroul Qur'an.`}
      />

      <section className="section">
        <div className="container">

          <FilterBar
            filters={filters}
            active={filter}
            onChange={setFilter}
          />

          <div className="cards-grid sessions-grid">
            {filtered.map((session) => (
              <SessionCard
                key={session.slug}
                session={session}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="empty-state">
              Aucune soirée ne correspond à ce filtre.
            </p>
          )}

        </div>
      </section>
    </main>
  )
}