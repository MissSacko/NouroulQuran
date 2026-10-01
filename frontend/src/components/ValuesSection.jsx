import { ArrowRight, BookOpen, Check, Heart, Sparkles, Users } from 'lucide-react'
import FadeIn from './FadeIn'
import SectionTitle from './SectionTitle'
import { values } from '../data/content'

const ICONS = { Sparkles, BookOpen, Heart, ArrowRight, Users, Check }

export default function ValuesSection() {
  return (
    <section className="section values-section">
      <div className="container">
        <SectionTitle
          eyebrow="Notre boussole"
          title="Des valeurs qui donnent du sens"
          text="Chaque rencontre est une invitation à transformer la connaissance en présence, puis la présence en action."
        />
        <div className="cards-grid">
          {values.map(([title, text, iconName], index) => {
            const Icon = ICONS[iconName]
            return (
              <FadeIn key={title} delay={index * 0.05}>
                <div className="value-card">
                  <div className="value-icon"><Icon size={18} /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
