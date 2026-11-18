
import { ArrowRight, CalendarDays, MapPin, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

function formatDate(value) {
  if (!value) return 'Date à préciser'

  const date = new Date(`${value}T12:00:00`)

  if (Number.isNaN(date.getTime())) return 'Date à préciser'

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default function TafsirCard({ tafsir }) {
  const sourate = tafsir.surah || {}
  const lieu = [tafsir.lieu, tafsir.mosquee].filter(Boolean).join(' · ')

  return (
    <article className="tafsir-card">
      <div className="tafsir-card-top">
        <span className="tafsir-number">
          <BookOpen size={14} />
          SÉANCE DE TAFSIR
        </span>

        {sourate.name && (
          <span className="tag">{sourate.name}</span>
        )}
      </div>

      <h3 className="serif">
        {sourate.name
          ? `Tafsir — ${sourate.name}`
          : tafsir.description || 'Séance de Tafsir'}
      </h3>

      <p className="tafsir-speaker">
        {tafsir.intervenant || 'Intervenant à préciser'}
      </p>

      <div className="tafsir-meta">
        <span>
          <CalendarDays size={14} />
          {formatDate(tafsir.date)}
        </span>

        {lieu && (
          <span>
            <MapPin size={14} />
            {lieu}
          </span>
        )}
      </div>

      <Link
        to={`/tafsir/${tafsir.slug}`}
        className="tafsir-link"
      >
        Voir le Tafsir <ArrowRight size={15} />
      </Link>
    </article>
  )
}
