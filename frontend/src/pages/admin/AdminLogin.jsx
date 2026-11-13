import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { saveAdminKey, verifyAdminKey } from '../../services/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(event) {
    event.preventDefault(); setError('')
    if (!key.trim()) { setError('Saisis la clé administrateur.'); return }
    setLoading(true)
    try {
      await verifyAdminKey(key.trim())
      saveAdminKey(key.trim())
      navigate('/admin/dashboard', { replace: true })
    } catch (err) { setError(err.message || 'Clé administrateur incorrecte.') }
    finally { setLoading(false) }
  }
  return <main className="admin-login"><div className="login-decoration"><span>☾</span></div><section className="login-card"><div className="login-logo"><ShieldCheck size={27} /></div><p className="admin-overline">NOUROUL QUR’AN</p><h1>Espace administration</h1><p className="login-description">Gère les séries, les soirées, les Tafsirs et les événements du club.</p><form onSubmit={handleSubmit}><label htmlFor="admin-key">Clé administrateur</label><input id="admin-key" type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="Saisis ta clé sécurisée" autoComplete="current-password" required />{error && <div className="form-error" role="alert">{error}</div>}<button type="submit" disabled={loading}>{loading ? 'Vérification…' : 'Accéder au tableau de bord'}</button></form><p className="login-footnote">L’accès est réservé aux personnes autorisées par l’administrateur du site.</p></section></main>
}
