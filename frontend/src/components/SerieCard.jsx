import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getSoireesBySerie } from '../data/soirees'

export default function SerieCard({ serie }) {
  const count = getSoireesBySerie(serie.slug).length

  return (
    <div className="series-card">
      <div className="eyebrow">{count} épisode{count > 1 ? 's' : ''}</div>
      <h3>{serie.title}</h3>
      <p>{serie.short}</p>
      <Link to={`/series/${serie.slug}`}>Voir la série <ArrowRight size={15} /></Link>
    </div>
  )
}
