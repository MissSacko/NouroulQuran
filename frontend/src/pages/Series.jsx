import PageHeaderr from '../components/PageHeaderr'
import SerieCard from '../components/SerieCard'
import { series } from '../data/series'

export default function Series() {
  return (
    <main>
      <PageHeaderr
        eyebrow="Parcours thématiques"
        title="Nos séries"
        text="Retrouvez les soirées regroupées par parcours thématique. Cliquez sur une série pour voir les rencontres qui la composent."
      />
      <section className="section">
        <div className="container">
          <div className="cards-grid series-grid">
            {series.map((serie) => <SerieCard key={serie.slug} serie={serie} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
