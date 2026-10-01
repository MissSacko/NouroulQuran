import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle'
import SerieCard from './SerieCard'
import { series } from '../data/series'

export default function SeriesPreview() {
  return (
    <section className="section" id="series">
      <div className="container">
        <SectionTitle
          eyebrow="Parcours thématiques"
          title="Nos séries"
          text="Des collections pensées pour cheminer épisode après épisode."
          action={
            <Link className="button outline-dark" to="/series">
              Voir toutes les séries <ArrowRight size={16} />
            </Link>
          }
        />
        <div className="cards-grid series-grid">
          {series.map((serie) => <SerieCard key={serie.slug} serie={serie} />)}
        </div>
      </div>
    </section>
  )
}
