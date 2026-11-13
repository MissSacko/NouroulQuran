
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getUpcomingEvents } from '../services/api'

const posterSlides = [
  {
    label: 'Cérémonie officielle',
    title: 'Nouroul Qur’An',
    subtitle: 'Une lumière pour les cœurs',
    detail: '19 DÉCEMBRE',
    symbol: '۞',
    style: 'poster-main',
  },
  {
    label: 'Grande conférence',
    title: 'Comprendre le Coran',
    subtitle: 'Les bienfaits de sa compréhension dans la vie du croyant',
    detail: 'CONFÉRENCE',
    symbol: '☾',
    style: 'poster-conference',
  },
  {
    label: 'Tafsir & méditation',
    title: 'Un cœur vivant par le Coran',
    subtitle: 'Méditons sur les versets du Coran',
    detail: 'TAFSIR',
    symbol: '۩',
    style: 'poster-tafsir',
  },
  {
    label: 'Concours Al-Ilm',
    title: 'Le savoir nous élève',
    subtitle: 'Apprendre, comprendre et transmettre',
    detail: 'CONCOURS AL-ILM',
    symbol: '✦',
    style: 'poster-contest',
  },
]

function getRemaining(date, time) {
  const target = new Date(`${date}T${time || '00:00'}:00`)
  const distance = Math.max(0, target.getTime() - Date.now())

  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000),
  }
}

function formatDate(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

export default function FeaturedSession() {
  const [event, setEvent] = useState(null)
  const [remaining, setRemaining] = useState(null)
  const [activePoster, setActivePoster] = useState(0)

  useEffect(() => {
    let active = true

    getUpcomingEvents()
      .then((events) => {
        const next =
          events.find((item) => item.countdown_enabled) || events[0]

        if (active && next) {
          setEvent(next)
          setRemaining(getRemaining(next.date, next.start_time))
        }
      })
      .catch((error) => {
        console.error('Impossible de charger le prochain événement :', error)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!event) return undefined

    const timer = window.setInterval(() => {
      setRemaining(getRemaining(event.date, event.start_time))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [event])

  // Défilement automatique des affiches, indépendamment du compte à rebours.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePoster((current) => (current + 1) % posterSlides.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [])

  if (!event) return null

  const poster = posterSlides[activePoster]

  return (
    <section className="featured-section event-featured" id="evenement">
      <div className="container featured-grid">

        {/* GAUCHE : vitrine animée des affiches */}
        <div className="event-featured-art" aria-label="Affiches de la cérémonie">
          <div className="poster-glow" />

          <div className="poster-stack" key={poster.style}>
            <div className="poster-card poster-card-back" />
            <div className="poster-card poster-card-middle" />

            <article className={`poster-card poster-card-front ${poster.style}`}>
              <span className="poster-topline">
                <Sparkles size={13} />
                {poster.label}
              </span>

              <div className="poster-emblem" aria-hidden="true">
                {poster.symbol}
              </div>

              <div className="poster-copy">
                <span className="poster-mini-brand">CLUB NOUROUL QUR’AN</span>
                <h3>{poster.title}</h3>
                <p>{poster.subtitle}</p>
              </div>

              <div className="poster-bottom">
                <span>{poster.detail}</span>
                <span className="poster-bottom-line" />
                <span>2026</span>
              </div>
            </article>
          </div>

          <div className="poster-pagination" aria-label="Affiche affichée">
            {posterSlides.map((item, index) => (
              <span
                key={item.style}
                className={`poster-pagination-dot ${
                  index === activePoster ? 'is-active' : ''
                }`}
              />
            ))}
          </div>

          <span className="poster-caption">
            Méditons sur les versets du Coran
          </span>
        </div>

        {/* DROITE : informations réelles de l'événement */}
        <div className="event-featured-info">
          <div className="eyebrow">
            Prochain rendez-vous Nouroul Qur’An
          </div>

          <h2 className="serif">{event.title}</h2>
          <p>{event.description}</p>

          <div className="meta-row">
            <span>
              <CalendarDays size={15} />
              {formatDate(event.date)}
            </span>

            {event.location && (
              <span>
                <MapPin size={15} />
                {event.location}
              </span>
            )}

            {event.start_time && (
              <span>
                <Clock3 size={15} />
                {event.start_time}
              </span>
            )}
          </div>

          {event.countdown_enabled && remaining && (
            <div className="event-countdown" aria-label="Compte à rebours">
              <div>
                <strong>{remaining.days}</strong>
                <span>jours</span>
              </div>
              <div>
                <strong>{String(remaining.hours).padStart(2, '0')}</strong>
                <span>heures</span>
              </div>
              <div>
                <strong>{String(remaining.minutes).padStart(2, '0')}</strong>
                <span>minutes</span>
              </div>
              <div>
                <strong>{String(remaining.seconds).padStart(2, '0')}</strong>
                <span>secondes</span>
              </div>
            </div>
          )}

          <div className="event-actions">
            {event.registration_enabled && (
              <a
                className="button gold"
                href={event.registration_url || '/#contact'}
                target={event.registration_url ? '_blank' : undefined}
                rel={event.registration_url ? 'noreferrer' : undefined}
              >
                S’inscrire <ExternalLink size={15} />
              </a>
            )}

            <Link className="button outline" to="/soirees">
              Explorer les soirées <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
