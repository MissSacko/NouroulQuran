import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react'
import { getUpcomingEvents } from '../services/api'

const PROGRAMME = [
  'Présentation du club Nouroul Qur’An',
  'Tafsir et méditation',
  'Conférence',
  'Concours Al-Ilm',
]

function getRemaining(date, time) {
  if (!date) return null

  const target = new Date(`${date}T${time || '00:00'}:00`)
  if (Number.isNaN(target.getTime())) return null

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

function getDateParts(value) {
  if (!value) return { day: '—', month: '', year: '' }

  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return { day: '—', month: '', year: '' }

  return {
    day: new Intl.DateTimeFormat('fr-FR', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date),
    year: new Intl.DateTimeFormat('fr-FR', { year: 'numeric' }).format(date),
  }
}

export default function FeaturedSession() {
  const [event, setEvent] = useState(null)
  const [remaining, setRemaining] = useState(null)
  const [programmeOpen, setProgrammeOpen] = useState(false)

  useEffect(() => {
    let active = true

    getUpcomingEvents()
      .then((events) => {
        const next = events.find((item) => item.countdown_enabled) || events[0]

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

  if (!event) return null

  const dateParts = getDateParts(event.date)

  return (
    <section className="featured-section event-editorial" id="evenement">
      <div className="container event-editorial-inner">
        <div className="event-editorial-heading">
          <span className="event-editorial-kicker">
            <span />
            À inscrire dans vos agendas
          </span>
          <span className="event-editorial-index">NOURoul QUR’AN · ÉVÉNEMENT</span>
        </div>

        <div className="event-editorial-grid">
          <aside className="event-date-art" aria-label={`Date : ${formatDate(event.date)}`}>
            <div className="event-date-art-top">
              <Sparkles size={15} />
              <span>Une rencontre, une intention</span>
            </div>

            <div className="event-date-art-main">
              <span className="event-date-month">{dateParts.month}</span>
              <strong>{dateParts.day}</strong>
              <span className="event-date-year">{dateParts.year}</span>
            </div>

            <div className="event-date-art-bottom">
              <span className="event-date-ornament">۞</span>
              <span>Méditons sur les versets du Coran</span>
            </div>
          </aside>

          <div className="event-editorial-content">
            <span className="eyebrow">Prochain rendez-vous Nouroul Qur’An</span>
            <h2 className="serif">{event.title}</h2>
            {event.description && <p className="event-editorial-description">{event.description}</p>}

            <div className="event-editorial-meta">
              <div>
                <CalendarDays size={17} />
                <span>{formatDate(event.date)}</span>
              </div>
              {event.start_time && (
                <div>
                  <Clock3 size={17} />
                  <span>{event.start_time}</span>
                </div>
              )}
              {event.location && (
                <div className="event-editorial-location">
                  <MapPin size={17} />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {event.countdown_enabled && remaining && (
              <div className="event-editorial-countdown" aria-label="Compte à rebours">
                <div className="event-countdown-label">Le rendez-vous approche</div>
                <div className="event-countdown-units">
                  {[
                    ['jours', remaining.days],
                    ['heures', remaining.hours],
                    ['minutes', remaining.minutes],
                    ['secondes', remaining.seconds],
                  ].map(([label, value]) => (
                    <div className="event-countdown-unit" key={label}>
                      <strong>{String(value).padStart(2, '0')}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="event-editorial-actions">
              <button
                type="button"
                className="event-programme-button"
                onClick={() => setProgrammeOpen((open) => !open)}
                aria-expanded={programmeOpen}
              >
                {programmeOpen ? 'Masquer le programme' : 'Découvrir le programme'}
                {programmeOpen ? <X size={17} /> : <ArrowDownRight size={17} />}
              </button>

              {event.registration_enabled && (
                <a
                  className="event-registration-link"
                  href={event.registration_url || '/#contact'}
                  target={event.registration_url ? '_blank' : undefined}
                  rel={event.registration_url ? 'noreferrer' : undefined}
                >
                  S’inscrire <ExternalLink size={15} />
                </a>
              )}
            </div>

            {programmeOpen && (
              <div className="event-programme-panel">
                <div className="event-programme-panel-heading">
                  <span>Au programme</span>
                  <span>01 — 04</span>
                </div>
                <ol>
                  {PROGRAMME.map((item) => (
                    <li key={item}>
                      <Check size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        <div className="event-editorial-footer">
          <span>Club Nouroul Qur’An</span>
          <span>Un moment de savoir et de spiritualité</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </section>
  )
}
