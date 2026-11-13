import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Soirees from './pages/Soirees'
import SoireeDetail from './pages/SoireeDetail'
import Series from './pages/Series'
import SerieDetail from './pages/SerieDetail'
import Tafsir from './pages/Tafsir'
import TafsirDetail from './pages/TafsirDetail'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminSoirees from './pages/admin/AdminSoirees'
import AdminSeries from './pages/admin/AdminSeries'
import AdminTafsirs from './pages/admin/AdminTafsirs'
import AdminEvents from './pages/admin/AdminEvents'
import AdminContacts from './pages/admin/AdminContacts'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function PublicShell() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  return <>
    {!isAdmin && <Navbar />}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/soirees" element={<Soirees />} />
      <Route path="/soirees/:slug" element={<SoireeDetail />} />
      <Route path="/series" element={<Series />} />
      <Route path="/series/:slug" element={<SerieDetail />} />
      <Route path="/tafsir" element={<Tafsir />} />
      <Route path="/tafsir/:slug" element={<TafsirDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/soirees" element={<AdminSoirees />} />
      <Route path="/admin/series" element={<AdminSeries />} />
      <Route path="/admin/tafsirs" element={<AdminTafsirs />} />
      <Route path="/admin/events" element={<AdminEvents />} />
      <Route path="/admin/contacts" element={<AdminContacts />} />
      <Route path="*" element={<main className="section"><div className="container"><h1>Page introuvable</h1><p>Cette page n’existe pas.</p></div></main>} />
    </Routes>
    {!isAdmin && <Footer />}
  </>
}

export default function App() {
  return <><ScrollManager /><PublicShell /></>
}
