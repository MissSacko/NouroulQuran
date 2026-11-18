import { useCallback, useEffect, useState } from 'react'
import { Check, Mail, Trash2 } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAdminContacts, updateAdminContact, deleteAdminContact } from '../../services/api'

export default function AdminContacts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => { setLoading(true); try { setItems(await getAdminContacts()); setError('') } catch (err) { setError(err.message || 'Impossible de charger les messages.') } finally { setLoading(false) } }, [])
  useEffect(() => { load() }, [load])
  async function toggle(item) { try { await updateAdminContact(item.id, { is_processed: !item.is_processed }); await load() } catch (err) { setError(err.message) } }
  async function remove(item) { if (!window.confirm('Supprimer définitivement ce message ?')) return; try { await deleteAdminContact(item.id); await load() } catch (err) { setError(err.message) } }
  return <AdminLayout><div className="page-heading"><span className="admin-overline">COMMUNICATION</span><h2>Messages reçus</h2><p>Consulte les messages envoyés depuis le formulaire de contact.</p></div>{error && <div className="admin-alert error" role="alert">{error}</div>}{loading ? <div className="admin-loading">Chargement…</div> : items.length === 0 ? <div className="admin-empty-panel"><Mail size={28} /><strong>Aucun message pour le moment</strong><p>Les messages du formulaire de contact apparaîtront ici.</p></div> : <div className="admin-contact-list">{items.map((item) => <article className={`admin-contact-card ${item.is_processed ? 'processed' : ''}`} key={item.id}><div className="admin-contact-card-head"><div><span className={`status ${item.is_processed ? 'published' : 'draft'}`}>{item.is_processed ? 'Traité' : 'À traiter'}</span><h3>{item.name}</h3><p>{item.email || 'E-mail non renseigné'}{item.phone ? ` · ${item.phone}` : ''}</p></div><div className="table-actions"><button type="button" onClick={() => toggle(item)}><Check size={15} /> {item.is_processed ? 'Marquer à traiter' : 'Marquer traité'}</button><button type="button" className="danger-button" onClick={() => remove(item)}><Trash2 size={15} /> Supprimer</button></div></div><p className="admin-contact-message">{item.message}</p></article>)}</div>}</AdminLayout>
}
