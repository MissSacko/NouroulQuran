
import { useState } from 'react'
import {
  ArrowRight,
  Check,
  Instagram,
  MessageCircle,
  Youtube,
} from 'lucide-react'
import { submitContact } from '../services/api'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

export default function ContactSection() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: '',
  })

  function change(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setStatus({ loading: true, error: '', success: '' })

    try {
      const result = await submitContact(form)

      setStatus({
        loading: false,
        error: '',
        success: result.message || 'Votre message a bien été envoyé.',
      })

      setForm(INITIAL_FORM)
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || 'Échec de l’envoi. Veuillez réessayer.',
        success: '',
      })
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div>
          <div className="eyebrow">Un pas vers la communauté</div>

          <h2 className="serif">Et si vous méditiez avec nous ?</h2>

          <p>
            Rejoignez Nouroul Qur’An et grandissez avec nous à travers
            l’étude, la méditation et le partage autour du Coran.
          </p>

          <p>
            <strong>Adresse e-mail :</strong>{' '}
            <a href="mailto:nouroulquran225@gmail.com">
              nouroulquran225@gmail.com
            </a>
          </p>

          <div className="socials">
            <a href="#contact" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#contact" aria-label="YouTube">
              <Youtube size={18} />
            </a>
            <a href="#contact" aria-label="WhatsApp">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="contact-name">Nom complet *</label>
          <input
            id="contact-name"
            required
            name="name"
            value={form.name}
            onChange={change}
            placeholder="Votre nom complet"
            autoComplete="name"
          />

          <label htmlFor="contact-email">Adresse e-mail *</label>
          <input
            id="contact-email"
            required
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            placeholder="vous@exemple.com"
            autoComplete="email"
          />

          <label htmlFor="contact-phone">Téléphone *</label>
          <input
            id="contact-phone"
            required
            name="phone"
            type="tel"
            value={form.phone}
            onChange={change}
            placeholder="Ex. : +225 07 00 00 00 00"
            autoComplete="tel"
          />

          <label htmlFor="contact-message">Votre message *</label>
          <textarea
            id="contact-message"
            required
            name="message"
            value={form.message}
            onChange={change}
            placeholder="Écrivez votre message..."
            rows={4}
          />

          {status.error && (
            <div className="contact-error" role="alert">
              {status.error}
            </div>
          )}

          <button
            className="button gold"
            type="submit"
            disabled={status.loading}
          >
            {status.loading ? 'Envoi en cours…' : 'Envoyer le message'}
            <ArrowRight size={17} />
          </button>

          {status.success && (
            <div className="success" role="status">
              <Check size={16} />
              {status.success}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
