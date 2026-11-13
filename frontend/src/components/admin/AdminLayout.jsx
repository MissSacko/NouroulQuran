import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { getAdminKey, removeAdminKey, verifyAdminKey } from '../../services/api'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [valid, setValid] = useState(false)
  useEffect(() => {
    let active = true
    verifyAdminKey(getAdminKey()).then(() => { if (active) setValid(true) })
      .catch(() => { removeAdminKey(); if (active) navigate('/admin/login', { replace: true }) })
      .finally(() => { if (active) setChecking(false) })
    return () => { active = false }
  }, [navigate])
  if (checking || !valid) return <div className="admin-guard-loading">Vérification de l’accès administrateur…</div>
  return <div className="admin-layout"><AdminSidebar /><main className="admin-main"><AdminHeader /><div className="admin-content">{children}</div></main></div>
}
