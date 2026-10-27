import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle'
import { activities } from '../data/content'

export default function ActivitiesSection() {
  return (
    <section className="section activities-section" id="activites">
      <div className="container">
        <SectionTitle
          eyebrow="Ce que nous vivons"
          title="Nos activités"
          text="Des formats complémentaires pour apprendre, contempler et se retrouver."
        />
        <div className="activities-grid">
          {activities.map(([icon, title, text, href]) => (
            <div className="activity-card" key={title}>
              <span className="activity-symbol">{icon}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to={href}>Explorer <ArrowRight size={15} /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
