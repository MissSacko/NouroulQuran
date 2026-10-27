import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, ExternalLink, Layers3, MapPin, PlayCircle, UserRound, Video } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getSoireeBySlug } from '../services/api'

function formatDate(value) {
  if (!value) return 'Date à préciser'
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export default function SoireeDetail() {
  const { slug } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    getSoireeBySlug(slug).then((data) => { if (active) setSession(data) })
      .catch(() => { if (active) setError('Cette soirée est introuvable ou le serveur est indisponible.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])
  if (loading) return <main className="section"><div className="container">Chargement de la soirée…</div></main>
  if (!session) return <main className="section"><div className="container"><h1>{error ? 'Impossible de charger la soirée' : 'Soirée introuvable'}</h1><p>{error || 'Cette soirée n’existe pas ou n’est plus publiée.'}</p><Link to="/soirees" className="button dark"><ArrowLeft size={16} /> Toutes les soirées</Link></div></main>
  const hasRecording = Boolean(session.recording_available && session.recording_url)
  return <main className="soiree-detail-page">
    <section className="section soiree-detail"><div className="container">
      <Link to="/soirees" className="page-back"><ArrowLeft size={16} /> Toutes les soirées</Link>
      <div className="soiree-detail-grid">
        <div className={`soiree-detail-art ${session.cover_image ? 'has-image' : ''}`}>
          {session.cover_image ? <img src={session.cover_image} alt="" /> : <div className="session-placeholder-art"><span>NQ</span><small>Nouroul Qur’An</small></div>}
          <div className="soiree-art-label">{session.number ? `SOIRÉE ${String(session.number).padStart(2, '0')}` : 'RENCONTRE NOUROUL QUR’AN'}</div>
        </div>
        <div className="soiree-detail-copy">
          <div className="eyebrow">{session.series?.title || 'Rencontre Nouroul Qur’An'}</div>
          <h1 className="serif">{session.title}</h1>
          {session.subtitle && <p className="detail-subtitle">{session.subtitle}</p>}
          <div className="meta-row detail-meta-row">
            <span><CalendarDays size={15} /> {formatDate(session.date)}</span>
            {session.speaker && <span><UserRound size={15} /> {session.speaker}</span>}
            {session.series?.title && <span><Layers3 size={15} /> {session.series.title}</span>}
          </div>
          {(session.summary || session.description) && <div className="soiree-summary"><div className="eyebrow">À propos de cette soirée</div><p>{session.summary || session.description}</p>{session.summary && session.description && session.summary !== session.description && <p>{session.description}</p>}</div>}
          {hasRecording ? <div className="recording-panel available"><div className="recording-panel-icon"><Video size={22} /></div><div><strong>Enregistrement disponible</strong><p>Retrouvez la rediffusion de cette rencontre sur Google Drive.</p></div><a href={session.recording_url} target="_blank" rel="noreferrer" className="button gold">Regarder <ExternalLink size={15} /></a></div> : <div className="recording-panel"><div className="recording-panel-icon"><PlayCircle size={22} /></div><div><strong>Enregistrement non disponible pour le moment</strong><p>L’enregistrement sera ajouté ici dès qu’il sera prêt.</p></div></div>}
          {session.series?.slug && <p className="soiree-detail-serie">Cette soirée fait partie de la série <Link to={`/series/${session.series.slug}`}>{session.series.title}</Link>.</p>}
        </div>
      </div>
    </div></section>
  </main>
}
