import { Link, useParams } from 'react-router-dom'
import SessionCard from '../components/SessionCard'
import { getSerieBySlug } from '../data/series'
import { getSoireesBySerie } from '../data/soirees'

export default function SerieDetail() {
  const { slug } = useParams()
  const serie = getSerieBySlug(slug)

  if (!serie) {
    return (
      <main>
        <section className="section">
          <div className="container">
            <p>Cette série n'existe pas.</p>
            <Link to="/series" className="button dark">Voir toutes les séries</Link>
          </div>
        </section>
      </main>
    )
  }

  const episodes = getSoireesBySerie(serie.slug)

  return (
    <main>
      <header className="serie-header" style={{ backgroundImage: `url(${serie.image})` }}>
        <div className="serie-header-overlay" />
        <div className="container serie-header-content">
          <div className="eyebrow">{episodes.length} épisode{episodes.length > 1 ? 's' : ''}</div>
          <h1 className="serif">{serie.title}</h1>
          <p>{serie.description}</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Les soirées de cette série</div>
              <h2 className="serif">Écouter ou revoir chaque épisode</h2>
            </div>
          </div>
          {episodes.length > 0 ? (
            <div className="cards-grid sessions-grid">
              {episodes.map((session) => <SessionCard key={session.slug} session={session} />)}
            </div>
          ) : (
            <p className="empty-state">Aucune soirée n'a encore été publiée pour cette série.</p>
          )}
        </div>
      </section>
    </main>
  )
}
