import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <div className="brand">NOUROUL QUR'AN</div>
          <p>Méditons sur les versets du Coran. Un espace de savoir, de spiritualité et de communauté.</p>
        </div>
        <div>
          <h4>Explorer</h4>
          <Link to="/#club">Le Club</Link>
          <Link to="/#activites">Activités</Link>
          <Link to="/soirees">Soirées</Link>
        </div>
        <div>
          <h4>Communauté</h4>
          <Link to="/series">Séries</Link>
          <Link to="/tafsir">Tafsir</Link>
          <Link to="/#galerie">Galerie</Link>
          <Link to="/#equipe">Équipe</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:contact@nouroulquran.org">Email</a>
          <Link to="/#contact">WhatsApp</Link>
          <Link to="/#contact">Instagram</Link>
        </div>
      </div>
      <div className="container footer-bottom">© 2026 Nouroul Qur'an — Tous droits réservés.</div>
    </footer>
  )
}
