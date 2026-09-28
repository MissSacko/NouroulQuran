import SectionTitle from './SectionTitle'
import { team } from '../data/content'

export default function TeamSection() {
  return (
    <section className="section" id="equipe">
      <div className="container">
        <SectionTitle
          eyebrow="Celles & ceux qui servent"
          title="Notre équipe"
          text="Une équipe de bénévoles, mentors et intervenants réunis par la même intention."
        />
        <div className="cards-grid team-grid">
          {team.map(([role, name, bio]) => (
            <div className="team-card" key={name}>
              <div className="avatar">{name.charAt(0)}</div>
              <div className="eyebrow">{role}</div>
              <h3>{name}</h3>
              <p>{bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
