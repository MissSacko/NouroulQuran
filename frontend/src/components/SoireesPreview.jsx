import { useEffect, useState } from 'react'
import { ArrowRight, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle'
import SessionCard from './SessionCard'
import { getSoirees } from '../services/api'

export default function SoireesPreview() {
  const [latest, setLatest] = useState([])
  useEffect(() => { let active = true; getSoirees().then((items) => { if (active) setLatest([...items].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 3)) }).catch(() => {}); return () => { active = false } }, [])
  return <>
    <section className="section" id="soirees"><div className="container"><SectionTitle eyebrow="Bibliothèque des soirées" title="Revivez nos soirées" text="Retrouvez nos rencontres, nos réflexions et nos échanges. Les enregistrements disponibles sont accessibles depuis Google Drive." action={<Link className="button outline-dark" to="/soirees">Voir toutes les soirées <ArrowRight size={16} /></Link>} />
      {latest.length ? <div className="cards-grid sessions-grid">{latest.map((session) => <SessionCard key={session.id || session.slug} session={session} />)}</div> : <p className="empty-state">Les soirées publiées apparaîtront ici.</p>}
    </div></section>
    <section className="quote-section"><Quote size={28} /><blockquote className="serif">« Certes, c'est par l'évocation d'Allah que les cœurs se tranquillisent. »</blockquote><cite>Sourate Ar-Ra'd — 13:28</cite></section>
  </>
}
