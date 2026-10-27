import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2, X, ExternalLink } from 'lucide-react'
import AdminLayout from './AdminLayout'

const EMPTY_OPTIONS = {}

function initialValues(fields) {
  return Object.fromEntries(fields.map((field) => [field.name, field.type === 'checkbox' ? (field.defaultValue ?? true) : field.type === 'json' ? '' : (field.defaultValue ?? '')]))
}
function toFormValues(item, fields) {
  return Object.fromEntries(fields.map((field) => {
    const value = item?.[field.name]
    if (field.type === 'json') return [field.name, Array.isArray(value) ? value.join('\n') : '']
    if (field.type === 'checkbox') return [field.name, Boolean(value)]
    if (field.type === 'select') return [field.name, value == null ? '' : String(value)]
    return [field.name, value ?? '']
  }))
}
function makePayload(values, fields) {
  const result = {}
  fields.forEach((field) => {
    let value = values[field.name]
    if (field.type === 'json') value = String(value || '').split('\n').map((line) => line.trim()).filter(Boolean)
    if (field.type === 'number') value = value === '' ? null : Number(value)
    if (field.type === 'select' && field.numeric) value = value === '' ? null : Number(value)
    if (field.type !== 'checkbox' && typeof value === 'string') value = value.trim() || null
    result[field.name] = value
  })
  return result
}

export default function AdminCollection({ title, eyebrow = 'CONTENU', description, fields, loadItems, createItem, updateItem, deleteItem, getItemTitle, extraOptions = EMPTY_OPTIONS, loadOptions }) {
  const [items, setItems] = useState([])
  const [values, setValues] = useState(() => initialValues(fields))
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loadedOptions, setLoadedOptions] = useState(extraOptions)

  useEffect(() => {
    let active = true
    if (loadOptions) loadOptions().then((options) => { if (active) setLoadedOptions({ ...extraOptions, ...options }) }).catch(() => {})
    else setLoadedOptions(extraOptions)
    return () => { active = false }
  }, [loadOptions, extraOptions])

  const load = useCallback(async () => {
    setLoading(true)
    try { setItems(await loadItems()); setError('') }
    catch (err) { setError(err.message || 'Impossible de charger les données.') }
    finally { setLoading(false) }
  }, [loadItems])
  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => items.filter((item) => {
    const query = search.toLocaleLowerCase('fr')
    return [item.title, item.slug, item.intervenant, item.speaker, item.location].some((value) => String(value || '').toLocaleLowerCase('fr').includes(query))
  }), [items, search])

  function openCreate() { setEditing(null); setValues(initialValues(fields)); setNotice(''); setModalOpen(true) }
  function openEdit(item) { setEditing(item); setValues(toFormValues(item, fields)); setNotice(''); setModalOpen(true) }
  function change(name, value) { setValues((current) => ({ ...current, [name]: value })) }

  async function submit(event) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('')
    try {
      const payload = makePayload(values, fields)
      if (editing) await updateItem(editing.id, payload)
      else await createItem(payload)
      setModalOpen(false); setEditing(null); setValues(initialValues(fields)); setNotice('Modifications enregistrées.')
      await load()
    } catch (err) { setError(err.message || 'Enregistrement impossible.') }
    finally { setSaving(false) }
  }
  async function remove(item) {
    const name = getItemTitle?.(item) || item.title || item.slug || 'cet élément'
    if (!window.confirm(`Supprimer « ${name} » ? Cette action est définitive.`)) return
    try { await deleteItem(item.id); setNotice('Élément supprimé.'); await load() }
    catch (err) { setError(err.message || 'Suppression impossible.') }
  }

  return <AdminLayout>
    <div className="page-heading page-heading-row"><div><span className="admin-overline">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div><button className="primary-button" onClick={openCreate}><Plus size={16} /> Ajouter</button></div>
    {error && !modalOpen && <div className="admin-alert error" role="alert">{error}</div>}
    {notice && <div className="admin-alert success" role="status">{notice}</div>}
    <div className="toolbar admin-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Rechercher ${title.toLowerCase()}…`} /></div>
    {loading ? <div className="admin-loading">Chargement…</div> : filtered.length === 0 ? <div className="admin-empty-panel"><strong>Aucun résultat</strong><p>{search ? 'Essaie une autre recherche.' : `Ajoute ton premier élément dans « ${title} ».`}</p></div> : <div className="admin-table-wrapper"><table className="admin-table"><thead><tr><th>Contenu</th><th>Informations</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{getItemTitle?.(item) || item.title || item.slug || 'Sans titre'}</strong><small>{item.slug || ''}</small></td><td>{item.date || item.subtitle || item.intervenant || item.speaker || '—'}{item.recording_available && <small className="recording-mini">Enregistrement Drive disponible</small>}</td><td><span className={`status ${item.is_published ? 'published' : 'draft'}`}>{item.is_published ? 'Publié' : 'Brouillon'}</span></td><td><div className="table-actions"><button type="button" onClick={() => openEdit(item)} aria-label="Modifier"><Pencil size={15} /> Modifier</button><button type="button" className="danger-button" onClick={() => remove(item)} aria-label="Supprimer"><Trash2 size={15} /> Supprimer</button>{item.recording_url && <a href={item.recording_url} target="_blank" rel="noreferrer" aria-label="Ouvrir Drive"><ExternalLink size={15} /></a>}</div></td></tr>)}</tbody></table></div>}

    {modalOpen && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false) }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title"><div className="panel-heading"><div><span className="admin-overline">{editing ? 'MODIFICATION' : 'NOUVEAU CONTENU'}</span><h3 id="admin-modal-title">{editing ? 'Modifier' : 'Ajouter'} — {title}</h3></div><button className="close-button" onClick={() => setModalOpen(false)} type="button" aria-label="Fermer"><X size={20} /></button></div><form className="admin-form" onSubmit={submit}><div className="form-grid">{fields.map((field) => <div key={field.name} className={`admin-field ${field.fullWidth || ['textarea','json','checkbox'].includes(field.type) ? 'full-width' : ''}`}>{field.type === 'checkbox' ? <label className="checkbox-label"><input type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => change(field.name, event.target.checked)} />{field.label}</label> : <><label htmlFor={`field-${field.name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>{field.type === 'textarea' || field.type === 'json' ? <><textarea id={`field-${field.name}`} rows={field.type === 'json' ? 4 : 3} required={field.required} value={values[field.name] ?? ''} placeholder={field.placeholder || (field.type === 'json' ? 'Une entrée par ligne' : '')} onChange={(event) => change(field.name, event.target.value)} />{field.type === 'json' && <small className="field-help">Une valeur par ligne.</small>}</> : field.type === 'select' ? <select id={`field-${field.name}`} required={field.required} value={values[field.name] ?? ''} onChange={(event) => change(field.name, event.target.value)}><option value="">{field.placeholder || 'Choisir…'}</option>{(loadedOptions[field.optionsKey] || field.options || []).map((option) => typeof option === 'string' ? <option key={option} value={option}>{option}</option> : <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input id={`field-${field.name}`} type={field.type || 'text'} required={field.required} min={field.min} max={field.max} value={values[field.name] ?? ''} placeholder={field.placeholder || ''} onChange={(event) => change(field.name, event.target.value)} />}</>}</div>)}</div>{error && <div className="admin-alert error" role="alert">{error}</div>}<div className="form-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Annuler</button><button type="submit" className="primary-button" disabled={saving}>{saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer'}</button></div></form></section></div>}
  </AdminLayout>
}
