import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TafsirCard({ tafsir }) {
  return (
    <article className="tafsir-card">
      <div className="tafsir-card-top">
        <span className="tafsir-number">SÉANCE #{String(tafsir.number).padStart(2, '0')}</span>
        {tafsir.sourate.nom && <span className="tag">{tafsir.sourate.nom}</span>}
      </div>
      <h3 className="serif">Tafsir {tafsir.sourate.nom || '—'}</h3>
      <p className="tafsir-speaker">{tafsir.speaker || 'Intervenant à préciser'}</p>
      <div className="tafsir-meta">
        <span><CalendarDays size={14} /> {tafsir.date}</span>
        <span><MapPin size={14} /> {tafsir.location}</span>
      </div>
      <Link to={`/tafsir/${tafsir.slug}`} className="tafsir-link">
        Voir le Tafsir <ArrowRight size={15} />
      </Link>
    </article>
  )
}
