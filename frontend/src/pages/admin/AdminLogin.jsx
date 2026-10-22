import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveAdminKey,
  getAdminKey,
} from "../../services/api";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [key, setKey] = useState(
    getAdminKey() || ""
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");

    if (!key.trim()) {
      setError(
        "Veuillez saisir votre clé administrateur."
      );
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/admin/series",
        {
          headers: {
            "X-Admin-Key": key,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "Clé administrateur incorrecte."
        );
      }

      saveAdminKey(key);

      navigate("/admin/dashboard");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="admin-login">

      <div className="login-decoration">
        <span>☾</span>
      </div>

      <div className="login-card">

        <div className="login-logo">
          NQ
        </div>

        <p className="admin-overline">
          NOUROUL QUR'AN
        </p>

        <h1>
          Espace administration
        </h1>

        <p className="login-description">
          Gérez les contenus et les activités
          de la communauté.
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Clé administrateur
          </label>

          <input
            type="password"
            value={key}
            onChange={(e) =>
              setKey(e.target.value)
            }
            placeholder="Votre clé administrateur"
          />

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Connexion..."
              : "Accéder au dashboard"}
          </button>

        </form>

      </div>

    </div>
  );
}