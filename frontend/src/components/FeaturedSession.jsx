import { ArrowRight, CalendarDays, Clock3, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getSoireeBySlug } from '../data/soirees'

export default function FeaturedSession() {
  const session = getSoireeBySlug('preparer-sa-rencontre-avec-allah')
  if (!session) return null

  return (
    <section className="featured-section" id="soiree">
      <div className="container featured-grid">
        <div>
          <div className="eyebrow">À l'affiche · prochaine rencontre</div>
          <h2 className="serif">{session.title}</h2>
          <p>{session.description}</p>
          <div className="meta-row">
            <span><CalendarDays size={15} /> {session.date}</span>
            <span><Clock3 size={15} /> {session.duration}</span>
            <span><Users size={15} /> {session.speaker}</span>
          </div>
          <Link className="button gold" to={`/soirees/${session.slug}`}>
            Découvrir la soirée <ArrowRight size={17} />
          </Link>
        </div>
        <img src={session.image} alt={session.title} />
      </div>
    </section>
  )
}
