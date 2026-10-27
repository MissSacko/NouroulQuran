import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, FileText, Layers3, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import StatCard from '../../components/admin/StatCard'
import { getAdminSeries, getAdminSoirees, getAdminTafsirs, getAdminEvents, getAdminContacts } from '../../services/api'

export default function AdminDashboard() {
  const [data, setData] = useState({ series: [], soirees: [], tafsirs: [], events: [], contacts: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    Promise.all([getAdminSeries(), getAdminSoirees(), getAdminTafsirs(), getAdminEvents(), getAdminContacts()])
      .then(([series, soirees, tafsirs, events, contacts]) => { if (active) setData({ series, soirees, tafsirs, events, contacts }) })
      .catch((err) => { if (active) setError(err.message || 'Impossible de charger le tableau de bord.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const upcoming = data.events.filter((event) => event.date && event.date >= new Date().toISOString().slice(0, 10) && event.is_published).sort((a, b) => a.date.localeCompare(b.date))
  return <AdminLayout><div className="page-heading"><span className="admin-overline">VUE D’ENSEMBLE</span><h2>Tableau de bord</h2><p>Bienvenue dans l’espace de gestion de Nouroul Qur’An.</p></div>
    {error && <div className="admin-alert error" role="alert">{error}</div>}
    {loading ? <div className="admin-loading">Chargement des indicateurs…</div> : <>
      <div className="stats-grid"><StatCard label="Soirées" value={data.soirees.length} icon={<Video size={20} />} /><StatCard label="Séries" value={data.series.length} icon={<Layers3 size={20} />} /><StatCard label="Séances de Tafsir" value={data.tafsirs.length} icon={<FileText size={20} />} /><StatCard label="Événements à venir" value={upcoming.length} icon={<CalendarDays size={20} />} /><StatCard label="Messages à traiter" value={data.contacts.filter((item) => !item.is_processed).length} icon={<FileText size={20} />} /></div>
      <div className="dashboard-shortcuts"><Link to="/admin/soirees"><Video size={18} /><span><strong>Gérer les soirées</strong><small>Ajouter les liens Drive</small></span><ArrowRight size={16} /></Link><Link to="/admin/series"><Layers3 size={18} /><span><strong>Gérer les séries</strong><small>Présentations et dossiers Drive</small></span><ArrowRight size={16} /></Link><Link to="/admin/tafsirs"><FileText size={18} /><span><strong>Gérer les Tafsirs</strong><small>Sourates et contenus pédagogiques</small></span><ArrowRight size={16} /></Link><Link to="/admin/events"><CalendarDays size={18} /><span><strong>Gérer les événements</strong><small>Dates, inscriptions et compte à rebours</small></span><ArrowRight size={16} /></Link><Link to="/admin/contacts"><FileText size={18} /><span><strong>Messages reçus</strong><small>Consulter et traiter les demandes</small></span><ArrowRight size={16} /></Link></div>
      <section className="dashboard-panel"><div className="panel-heading"><div><span className="admin-overline">AGENDA</span><h3>Événements à venir</h3></div><Link to="/admin/events" className="panel-link">Tout gérer <ArrowRight size={14} /></Link></div>{upcoming.length === 0 ? <div className="empty-state">Aucun événement à venir publié.</div> : upcoming.map((event) => <div className="dashboard-event" key={event.id}><div className="dashboard-event-date"><strong>{new Date(`${event.date}T12:00:00`).getDate()}</strong><span>{new Date(`${event.date}T12:00:00`).toLocaleDateString('fr-FR', { month: 'short' })}</span></div><div className="dashboard-event-info"><h4>{event.title}</h4><p>{event.location || 'Lieu à préciser'}</p><small>{event.start_time || ''}{event.end_time ? ` — ${event.end_time}` : ''}</small></div>{event.countdown_enabled && <span className="gold-badge">Compte à rebours</span>}</div>)}</section>
    </>}</AdminLayout>
}
