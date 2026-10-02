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

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        // Laisse le temps à la page de se monter avant de scroller.
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <Routes>
        {/* Accueil */}
        <Route path="/" element={<Home />} />

         {/* Soirées */}
        <Route path="/soirees" element={<Soirees />} />
        <Route path="/soirees/:slug" element={<SoireeDetail />} />


        {/* Séries */}
        <Route path="/series" element={<Series />} />
        <Route path="/series/:slug" element={<SerieDetail />} />

        {/* Tafsir */}
        <Route path="/tafsir" element={<Tafsir />} />
        <Route path="/tafsir/:slug" element={<TafsirDetail />} />

        
      </Routes>
      <Footer />
    </>
  )
}
