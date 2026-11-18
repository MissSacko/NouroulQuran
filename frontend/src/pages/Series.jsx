import { useEffect, useState } from 'react'
import PageHeaderr from '../components/PageHeaderr'
import SerieCard from '../components/SerieCard'
import { getSeries } from '../services/api'

export default function Series() {
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    getSeries().then((data) => { if (active) setSeries(data) })
      .catch(() => { if (active) setError('Impossible de charger les séries. Vérifie que le serveur est démarré.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  return <main>
    <PageHeaderr eyebrow="Parcours thématiques" title="Nos séries" text="Des parcours thématiques pour approfondir notre compréhension et revivre les rencontres de Nouroul Qur’An." />
    <section className="section"><div className="container">
      {loading && <p className="empty-state">Chargement des séries…</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      {!loading && !error && series.length === 0 && <p className="empty-state">Aucune série publiée pour le moment.</p>}
      {!loading && !error && series.length > 0 && <div className="cards-grid series-grid">{series.map((serie) => <SerieCard key={serie.id || serie.slug} serie={serie} />)}</div>}
    </div></section>
  </main>
}
