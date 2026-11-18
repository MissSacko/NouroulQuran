import { useEffect, useState } from 'react'
import { ArrowLeft, ExternalLink, FolderOpen } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageHeaderr from '../components/PageHeaderr'
import SessionCard from '../components/SessionCard'
import { getSerieBySlug, getSoirees } from '../services/api'

export default function SerieDetail() {
  const { slug } = useParams()
  const [serie, setSerie] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    Promise.all([getSerieBySlug(slug), getSoirees({ series: slug })])
      .then(([serieData, soireesData]) => { if (active) { setSerie(serieData); setEpisodes(soireesData) } })
      .catch(() => { if (active) setError('Cette série est introuvable ou le serveur est indisponible.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])
  if (loading) return <main><PageHeaderr eyebrow="Parcours thématique" title="Chargement…" text="Nous préparons le contenu de la série." /><section className="section"><div className="container">Chargement…</div></section></main>
  if (error || !serie) return <main><PageHeaderr eyebrow="Parcours thématique" title="Série introuvable" text={error || 'Cette série n’existe pas ou n’est plus publiée.'} /><section className="section"><div className="container"><Link to="/series" className="button dark"><ArrowLeft size={16} /> Toutes les séries</Link></div></section></main>
  const objectives = Array.isArray(serie.objectives) ? serie.objectives : []
  return <main className="serie-detail-page">
    <header className="serie-header" style={serie.cover_image ? { backgroundImage: `url(${serie.cover_image})` } : undefined}>
      <div className="serie-header-overlay" />
      <div className="container serie-header-content">
        <Link to="/series" className="detail-back"><ArrowLeft size={15} /> Toutes les séries</Link>
        <div className="eyebrow">{episodes.length} soirée{episodes.length !== 1 ? 's' : ''}</div>
        <h1 className="serif">{serie.title}</h1>
        {serie.subtitle && <p className="serie-subtitle">{serie.subtitle}</p>}
        <p>{serie.introduction || serie.description}</p>
        {serie.drive_folder_url && <a className="button gold" href={serie.drive_folder_url} target="_blank" rel="noreferrer"><FolderOpen size={17} /> Ouvrir les enregistrements <ExternalLink size={14} /></a>}
      </div>
    </header>
    {objectives.length > 0 && <section className="section series-objectives"><div className="container"><div className="section-head"><div><div className="eyebrow">Notre intention</div><h2 className="serif">Objectifs de la série</h2></div></div><ul className="detail-list">{objectives.map((item, index) => <li key={index}>{item}</li>)}</ul></div></section>}
    <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Bibliothèque de la série</div><h2 className="serif">Les soirées de ce parcours</h2></div></div>
      {episodes.length ? <div className="cards-grid sessions-grid">{episodes.map((item) => <SessionCard key={item.id || item.slug} session={item} />)}</div> : <p className="empty-state">Aucune soirée publiée dans cette série pour le moment.</p>}
    </div></section>
  </main>
}
