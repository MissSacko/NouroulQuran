import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SessionCard({ session }) {
  return (
    <motion.article className="session-card" whileHover={{ y: -7 }} transition={{ duration: 0.25 }}>
      <Link to={`/soirees/${session.slug}`} className="session-image">
        <img src={session.image} alt="" />
        <span className="session-number">{session.number}</span>
      </Link>
      <div className="session-body">
        <div className="eyebrow">{session.category}</div>
        <h3><Link to={`/soirees/${session.slug}`}>{session.title}</Link></h3>
        <p>{session.speaker || 'Intervenant à préciser'}</p>
        <div className="session-foot">
          <span><CalendarDays size={14} /> {session.date}</span>
          <Link to={`/soirees/${session.slug}`} className="card-detail-link">Détails <ArrowRight size={14} /></Link>
        </div>
      </div>
    </motion.article>
  )
}
