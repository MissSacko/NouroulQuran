import { useState } from 'react'
import { ArrowRight, Check, Instagram, MessageCircle, Youtube } from 'lucide-react'

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div>
          <div className="eyebrow">Un pas vers la communauté</div>
          <h2 className="serif">Et si vous méditiez avec nous ?</h2>
          <p>
            Rejoignez Nouroul Qur'an et grandissez avec nous à travers l'étude, la méditation
            et le partage autour du Coran.
          </p>
          <div className="socials">
            <a href="#contact"><Instagram size={18} /></a>
            <a href="#contact"><Youtube size={18} /></a>
            <a href="#contact"><MessageCircle size={18} /></a>
          </div>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
          <input required placeholder="Votre nom" name="nom" />
          <input required type="email" placeholder="Votre email" name="email" />
          <input placeholder="Sujet" name="sujet" />
          <textarea required placeholder="Votre message" name="message" rows="4" />
          <button className="button gold" type="submit">
            Envoyer le message <ArrowRight size={17} />
          </button>
          {submitted && (
            <div className="success"><Check size={16} /> Merci, votre message a bien été préparé.</div>
          )}
        </form>
      </div>
    </section>
  )
}
