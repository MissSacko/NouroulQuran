import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getSoirees,
  getSeries,
  createSoiree,
  updateSoiree,
  deleteSoiree,
} from "../../services/api";

const emptyForm = {
  number: "",
  title: "",
  slug: "",
  subtitle: "",
  date: "",
  speaker: "",
  category: "",
  summary: "",
  description: "",
  cover_image: "",
  series_id: "",
  is_published: true,
};

export default function AdminSoirees() {

  const [items, setItems] = useState([]);
  const [series, setSeries] = useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editing, setEditing] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  async function load() {

    setLoading(true);

    try {

      const [soirees, seriesData] =
        await Promise.all([
          getSoirees(),
          getSeries(),
        ]);

      setItems(soirees);
      setSeries(seriesData);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleChange(e) {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  }

  function openCreate() {

    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);

  }

  function openEdit(item) {

    setEditing(item);

    setForm({
      number: item.number || "",
      title: item.title || "",
      slug: item.slug || "",
      subtitle: item.subtitle || "",
      date: item.date || "",
      speaker: item.speaker || "",
      category: item.category || "",
      summary: item.summary || "",
      description: item.description || "",
      cover_image: item.cover_image || "",
      series_id: item.series_id || "",
      is_published: item.is_published,
    });

    setShowForm(true);
  }

  async function handleSubmit(e) {

    e.preventDefault();

    const payload = {
      ...form,
      number: form.number
        ? Number(form.number)
        : null,
      series_id: form.series_id
        ? Number(form.series_id)
        : null,
    };

    try {

      if (editing) {

        await updateSoiree(
          editing.id,
          payload
        );

      } else {

        await createSoiree(payload);

      }

      setShowForm(false);
      setForm(emptyForm);

      await load();

    } catch (error) {

      alert(error.message);

    }
  }

  async function handleDelete(id) {

    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer cette soirée ?"
      )
    ) {
      return;
    }

    try {

      await deleteSoiree(id);

      await load();

    } catch (error) {

      alert(error.message);

    }
  }

  const filtered = items.filter(
    (item) =>
      item.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  return (
    <AdminLayout>

      <div className="page-heading page-heading-row">

        <div>
          <span className="admin-overline">
            CONTENU
          </span>

          <h2>
            Soirées
          </h2>

          <p>
            Gérez les soirées Nouroul Qur'An.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreate}
        >
          + Nouvelle soirée
        </button>

      </div>

      <div className="toolbar">

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Rechercher une soirée..."
        />

      </div>

      {showForm && (

        <div className="admin-form-panel">

          <div className="panel-heading">

            <h3>
              {editing
                ? "Modifier la soirée"
                : "Nouvelle soirée"}
            </h3>

            <button
              className="close-button"
              onClick={() =>
                setShowForm(false)
              }
            >
              ×
            </button>

          </div>

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="form-grid">

              <div>
                <label>N°</label>
                <input
                  name="number"
                  type="number"
                  value={form.number}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Titre *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Slug *</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Intervenant</label>
                <input
                  name="speaker"
                  value={form.speaker}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Catégorie</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Série</label>

                <select
                  name="series_id"
                  value={form.series_id}
                  onChange={handleChange}
                >

                  <option value="">
                    Aucune série
                  </option>

                  {series.map((serie) => (
                    <option
                      key={serie.id}
                      value={serie.id}
                    >
                      {serie.title}
                    </option>
                  ))}

                </select>

              </div>

              <div>
                <label>Image de couverture</label>
                <input
                  name="cover_image"
                  value={form.cover_image}
                  onChange={handleChange}
                  placeholder="URL de l'image"
                />
              </div>

            </div>

            <div>
              <label>Sous-titre</label>
              <input
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Résumé</label>
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <label className="checkbox-label">

              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={handleChange}
              />

              Publier cette soirée

            </label>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Annuler
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                {editing
                  ? "Enregistrer les modifications"
                  : "Créer la soirée"}
              </button>

            </div>

          </form>

        </div>
      )}

      <div className="admin-table-wrapper">

        {loading ? (
          <div className="admin-loading">
            Chargement...
          </div>
        ) : (

          <table className="admin-table">

            <thead>
              <tr>
                <th>N°</th>
                <th>Soirée</th>
                <th>Série</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((item) => (

                <tr key={item.id}>

                  <td>
                    {item.number
                      ? `#${item.number}`
                      : "—"}
                  </td>

                  <td>
                    <strong>
                      {item.title}
                    </strong>

                    <small>
                      {item.speaker || "—"}
                    </small>
                  </td>

                  <td>
                    {item.series?.title || "Ordinaire"}
                  </td>

                  <td>
                    {item.date
                      ? new Date(
                          item.date
                        ).toLocaleDateString(
                          "fr-FR"
                        )
                      : "—"}
                  </td>

                  <td>
                    <span
                      className={
                        item.is_published
                          ? "status published"
                          : "status draft"
                      }
                    >
                      {item.is_published
                        ? "Publié"
                        : "Brouillon"}
                    </span>
                  </td>

                  <td>

                    <div className="table-actions">

                      <button
                        onClick={() =>
                          openEdit(item)
                        }
                      >
                        Modifier
                      </button>

                      <button
                        className="danger-button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        Supprimer
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </AdminLayout>
  );
}