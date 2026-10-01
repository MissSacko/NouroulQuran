import { CalendarDays, Layers3, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getSerieBySlug } from '../data/series'
import { getSoireeBySlug } from '../data/soirees'

export default function SoireeDetail() {
  const { slug } = useParams()
  const session = getSoireeBySlug(slug)

  if (!session) {
    return (
      <main>
        <section className="section"><div className="container">
          <p>Cette soirée n'existe pas.</p>
          <Link to="/soirees" className="button dark">Voir toutes les soirées</Link>
        </div></section>
      </main>
    )
  }

  const serie = session.serieSlug ? getSerieBySlug(session.serieSlug) : null

  return (
    <main>
      <section className="section soiree-detail">
        <div className="container">
          <Link to="/soirees" className="page-back">← Toutes les soirées</Link>

          <div className="soiree-detail-grid">
            <div className="image-frame soiree-detail-image">
              <img src={session.image} alt="" />
            </div>

            <div>
              <div className="eyebrow">{session.number} · {session.category}</div>
              <h1 className="serif">{session.title}</h1>

              <div className="meta-row">
                <span><CalendarDays size={15} /> {session.date}</span>
                <span><UserRound size={15} /> {session.speaker || 'Intervenant à préciser'}</span>
                <span><Layers3 size={15} /> {session.period}</span>
              </div>

              <div className="soiree-summary">
                <div className="eyebrow">Résumé de la soirée</div>
                {session.summary ? (
                  <p>{session.summary}</p>
                ) : (
                  <p className="detail-empty">Le résumé détaillé de cette soirée sera ajouté prochainement.</p>
                )}
              </div>

              {serie && (
                <div className="soiree-detail-serie">
                  Cette soirée fait partie de la série{' '}
                  <Link to={`/series/${serie.slug}`}>{serie.title}</Link>.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
