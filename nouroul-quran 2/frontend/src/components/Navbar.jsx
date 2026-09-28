import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [
    ['Le Club', '/#club'],
    ['Activités', '/#activites'],
    ['Soirées', '/soirees'],
    ['Séries', '/series'],
    ['Tafsir', '/tafsir'],
    ['Galerie', '/#galerie'],
    ['Équipe', '/#equipe'],
  ]

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link className="brand" to="/">NOUROUL QUR'AN</Link>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([label, href]) => (
            <Link key={href} to={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link className="mobile-contact" to="/#contact" onClick={() => setOpen(false)}>Contact</Link>
        </div>
        <Link className="nav-cta" to="/#contact">Rejoindre le club</Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  )
}
