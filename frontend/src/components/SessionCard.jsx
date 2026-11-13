import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CirclePlay, Video } from 'lucide-react'
import { Link } from 'react-router-dom'

function formatDate(value) {
  if (!value) return 'Date à préciser'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export default function SessionCard({ session }) {
  const hasRecording = Boolean(session.recording_available && session.recording_url)
  return (
    <motion.article className="session-card session-card-clean" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link to={`/soirees/${session.slug}`} className={`session-image ${session.cover_image ? '' : 'session-image-placeholder'}`}>
        {session.cover_image ? <img src={session.cover_image} alt="" loading="lazy" /> : <div className="session-placeholder-art"><span>NQ</span><small>Nouroul Qur’An</small></div>}
        <span className="session-number">{session.number ? `SOIRÉE ${String(session.number).padStart(2, '0')}` : 'SOIRÉE'}</span>
      </Link>
      <div className="session-body">
        {session.series?.title && <div className="eyebrow">{session.series.title}</div>}
        <h3><Link to={`/soirees/${session.slug}`}>{session.title}</Link></h3>
        <p className="session-speaker">{session.speaker || 'Intervenant à préciser'}</p>
        {session.summary && <p className="session-summary">{session.summary}</p>}
        <div className="session-foot">
          <span><CalendarDays size={14} /> {formatDate(session.date)}</span>
          <Link to={`/soirees/${session.slug}`} className="card-detail-link">Détails <ArrowRight size={14} /></Link>
        </div>
        <div className={`recording-status ${hasRecording ? 'is-available' : ''}`}>
          {hasRecording ? <><Video size={15} /> Enregistrement disponible</> : <><CirclePlay size={15} /> Enregistrement non disponible pour le moment</>}
        </div>
      </div>
    </motion.article>
  )
}
