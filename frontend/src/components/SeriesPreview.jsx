import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle'
import SerieCard from './SerieCard'
import { getSeries } from '../services/api'

export default function SeriesPreview() {
  const [series, setSeries] = useState([])
  useEffect(() => { let active = true; getSeries().then((items) => { if (active) setSeries(items.slice(0, 3)) }).catch(() => {}); return () => { active = false } }, [])
  return <section className="section" id="series"><div className="container"><SectionTitle eyebrow="Parcours thématiques" title="Nos séries" text="Des collections pensées pour cheminer épisode après épisode." action={<Link className="button outline-dark" to="/series">Voir toutes les séries <ArrowRight size={16} /></Link>} />
    {series.length ? <div className="cards-grid series-grid">{series.map((serie) => <SerieCard key={serie.id || serie.slug} serie={serie} />)}</div> : <p className="empty-state">Les séries publiées apparaîtront ici.</p>}
  </div></section>
}
