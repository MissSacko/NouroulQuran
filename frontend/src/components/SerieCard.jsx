import { ArrowRight, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SerieCard({ serie }) {
  const count = serie.soiree_count ?? serie.soirees?.length ?? 0
  return (
    <article className="series-card series-card-dynamic">
      <div className="series-card-symbol"><FolderOpen size={23} /></div>
      <div className="eyebrow">{count} soirée{count > 1 ? 's' : ''}</div>
      <h3>{serie.title}</h3>
      {serie.subtitle && <h4>{serie.subtitle}</h4>}
      <p>{serie.description || serie.introduction || 'Un parcours de réflexion et de méditation autour des enseignements de l’Islam.'}</p>
      <Link to={`/series/${serie.slug}`}>Découvrir la série <ArrowRight size={15} /></Link>
    </article>
  )
}
