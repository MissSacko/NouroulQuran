import { Link, useParams } from "react-router-dom";
import { getTafsirBySlug } from "../data/tafsir";
import PageHeaderr from "../components/PageHeaderr";

export default function TafsirDetail() {
  const { slug } = useParams();

  const tafsir = getTafsirBySlug(slug);

  // Si aucun Tafsir ne correspond au slug
  if (!tafsir) {
    return (
      <div className="page">
        <PageHeaderr
          eyebrow="Tafsir"
          title="Séance introuvable"
          description="Cette séance de Tafsir n'existe pas ou n'est plus disponible."
        />

        <section className="section">
          <div className="container">
            <Link to="/tafsir" className="btn btn-primary">
              Voir les séances de Tafsir
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const sourate = tafsir.sourate || {};

  const themes = Array.isArray(tafsir.themesPrincipaux)
    ? tafsir.themesPrincipaux
    : [];

  const termes = Array.isArray(tafsir.termesCles)
    ? tafsir.termesCles
    : [];

  const lecons = Array.isArray(tafsir.leconsPratiques)
    ? tafsir.leconsPratiques
    : [];

  return (
    <div className="page">
      {/* HEADER */}
      <PageHeaderr
        eyebrow="Séance de Tafsir"
        title={sourate.nom || "Tafsir"}
        description={tafsir.description || ""}
      />

      {/* INFORMATIONS PRINCIPALES */}
      <section className="section">
        <div className="container">

          <div className="detail-meta">

            <div className="detail-meta-item">
              <span className="detail-meta-label">
                Intervenant
              </span>

              <span className="detail-meta-value">
                {tafsir.intervenant || "Non renseigné"}
              </span>
            </div>

            <div className="detail-meta-item">
              <span className="detail-meta-label">
                Date
              </span>

              <span className="detail-meta-value">
                {tafsir.date || "Non renseignée"}
              </span>
            </div>

            <div className="detail-meta-item">
              <span className="detail-meta-label">
                Lieu
              </span>

              <span className="detail-meta-value">
                {tafsir.lieu || "Non renseigné"}
              </span>
            </div>

            <div className="detail-meta-item">
              <span className="detail-meta-label">
                Mosquée
              </span>

              <span className="detail-meta-value">
                {tafsir.mosquee || "Non renseignée"}
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* CONTENU DU TAFSIR */}
      <section className="section section-alt">
        <div className="container">

          <div className="detail-content">

            {/* 1. IDENTITÉ DE LA SOURATE */}
            <article className="detail-block">

              <span className="detail-number">
                01
              </span>

              <div>
                <h2>
                  L'identité de la sourate
                </h2>

                <div className="detail-text">

                  <p>
                    <strong>Nom :</strong>{" "}
                    {sourate.nom || "Non renseigné"}
                  </p>

                  <p>
                    <strong>Numéro dans le Coran :</strong>{" "}
                    {sourate.numeroCoran || "Non renseigné"}
                  </p>

                  <p>
                    <strong>Nombre de versets :</strong>{" "}
                    {sourate.nombreVersets || "Non renseigné"}
                  </p>

                  <p>
                    <strong>Raison de l'appellation :</strong>{" "}
                    {sourate.raisonAppellation ||
                      "Cette information sera ajoutée prochainement."}
                  </p>

                  <p>
                    <strong>Ordre de révélation :</strong>{" "}
                    {sourate.ordreRevelation ||
                      "Cette information sera ajoutée prochainement."}
                  </p>

                  <p>
                    <strong>Type :</strong>{" "}
                    {sourate.type ||
                      "Cette information sera ajoutée prochainement."}
                  </p>

                </div>
              </div>

            </article>

            {/* 2. CONTEXTE DE RÉVÉLATION */}
            <article className="detail-block">

              <span className="detail-number">
                02
              </span>

              <div>
                <h2>
                  Le contexte de la révélation
                </h2>

                <div className="detail-text">

                  {tafsir.contexteRevelation ? (
                    <p>{tafsir.contexteRevelation}</p>
                  ) : (
                    <p className="empty-content">
                      Le contexte de révélation de cette sourate
                      sera ajouté prochainement.
                    </p>
                  )}

                </div>
              </div>

            </article>

            {/* 3. THÈMES PRINCIPAUX */}
            <article className="detail-block">

              <span className="detail-number">
                03
              </span>

              <div>
                <h2>
                  Les thèmes principaux
                </h2>

                {themes.length > 0 ? (
                  <ul className="detail-list">
                    {themes.map((theme, index) => (
                      <li key={index}>
                        {theme}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-content">
                    Les principaux thèmes abordés seront ajoutés
                    prochainement.
                  </p>
                )}
              </div>

            </article>

            {/* 4. TERMES ET PASSAGES CLÉS */}
            <article className="detail-block">

              <span className="detail-number">
                04
              </span>

              <div>
                <h2>
                  Explication des termes et passages clés
                </h2>

                {termes.length > 0 ? (
                  <ul className="detail-list">
                    {termes.map((terme, index) => (
                      <li key={index}>
                        {terme}
                      </li>
                    ))}
                  </ul>
                ) : tafsir.explication ? (
                  <p className="detail-text">
                    {tafsir.explication}
                  </p>
                ) : (
                  <p className="empty-content">
                    L'explication des termes et passages clés
                    sera ajoutée prochainement.
                  </p>
                )}
              </div>

            </article>

            {/* 5. LEÇONS PRATIQUES */}
            <article className="detail-block">

              <span className="detail-number">
                05
              </span>

              <div>
                <h2>
                  Les leçons pratiques
                </h2>

                {lecons.length > 0 ? (
                  <ul className="detail-list">
                    {lecons.map((lecon, index) => (
                      <li key={index}>
                        {lecon}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-content">
                    Les leçons pratiques tirées de cette séance
                    seront ajoutées prochainement.
                  </p>
                )}
              </div>

            </article>

          </div>

          {/* RETOUR À LA LISTE DES TAFSIRS */}
          <div className="detail-footer">

            <Link
              to="/tafsir"
              className="btn btn-secondary"
            >
              ← Toutes les séances de Tafsir
            </Link>

          </div>

        </div>
      </section>
    </div>
  );
}