import { ArrowRight } from 'lucide-react'
import FadeIn from './FadeIn'

export default function AboutSection() {
  return (
    <section className="section" id="club">
      <div className="container split">
        <FadeIn>
          <div className="image-frame">
            <img
              src="https://cdn.pixabay.com/photo/2022/08/19/16/55/quran-7397296_1280.jpg"
              alt="Étude du Coran"
            />
          </div>
        </FadeIn>
        <FadeIn delay={0.12}>
          <div className="copy">
            <div className="eyebrow">À propos du club</div>
            <h2 className="serif">Un espace pour méditer, apprendre et grandir</h2>
            <div className="gold-rule" />
            <p>
              Nouroul Qur'an rassemble celles et ceux qui souhaitent approfondir leur relation
              au Coran, faire dialoguer le savoir et la spiritualité, et avancer ensemble dans
              une atmosphère fraternelle.
            </p>
            <a className="button dark" href="#contact">En savoir plus <ArrowRight size={17} /></a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
