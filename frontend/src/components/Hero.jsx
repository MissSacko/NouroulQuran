import { ArrowRight } from 'lucide-react'
import FadeIn from './FadeIn'

export default function Hero() {
  return (
    <header className="hero" id="accueil">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <FadeIn>
          <div className="eyebrow">Un cercle de savoir & de spiritualité</div>
          <h1 className="serif">Méditons sur les versets du Coran</h1>
          <p>Un espace pour apprendre, méditer, échanger et grandir ensemble à travers la Parole d'Allah.</p>
          <div className="hero-actions">
            <a className="button gold" href="#club">Découvrir le club <ArrowRight size={17} /></a>
            <a className="button outline" href="#soirees">Explorer nos séances</a>
          </div>
          <div className="hero-note"><span /> Nouroul Qur'an · Abidjan</div>
        </FadeIn>
      </div>
    </header>
  )
}
