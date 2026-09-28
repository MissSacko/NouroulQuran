import { ArrowRight, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle'
import SessionCard from './SessionCard'
import { getLatestSoirees } from '../data/soirees'

export default function SoireesPreview() {
  const latest = getLatestSoirees(3)

  return (
    <>
      <section className="section" id="soirees">
        <div className="container">
          <SectionTitle
            eyebrow="Bibliothèque audio & vidéo"
            title="Revivez nos soirées"
            text="Retrouvez nos rencontres, nos réflexions et nos échanges."
            action={
              <Link className="button outline-dark" to="/soirees">
                Voir toutes les soirées <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="cards-grid sessions-grid">
            {latest.map((session) => <SessionCard key={session.slug} session={session} />)}
          </div>
        </div>
      </section>

      <section className="quote-section">
        <Quote size={28} />
        <blockquote className="serif">« Certes, c'est par l'évocation d'Allah que les cœurs se tranquillisent. »</blockquote>
        <cite>Sourate Ar-Ra'd — 13:28</cite>
      </section>
    </>
  )
}
