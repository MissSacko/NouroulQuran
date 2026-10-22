import { NavLink, useNavigate } from "react-router-dom";
import { removeAdminKey } from "../../services/api";

const items = [
  ["Tableau de bord", "/admin/dashboard", "⌂"],
  ["Soirées", "/admin/soirees", "◉"],
  ["Séries", "/admin/series", "◈"],
  ["Tafsirs", "/admin/tafsirs", "☾"],
  ["Événements", "/admin/events", "◆"],
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  function logout() {
    removeAdminKey();
    navigate("/admin/login");
  }

  return (
    <aside className="admin-sidebar">

      <div className="admin-brand">

        <div className="admin-logo">
          NQ
        </div>

        <div>
          <strong>Nouroul Qur'An</strong>
          <span>Administration</span>
        </div>

      </div>

      <nav className="admin-nav">

        {items.map(([label, path, icon]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}

      </nav>

      <div className="admin-sidebar-bottom">

        <div className="admin-slogan">
          Méditons sur les versets du Coran.
        </div>

        <button
          className="admin-logout"
          onClick={logout}
        >
          ↪ Déconnexion
        </button>

      </div>

    </aside>
  );
}