
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  UserRound,
} from "lucide-react";
import { getTafsirBySlug } from "../services/api";
import PageHeaderr from "../components/PageHeaderr";

function formatDate(value) {
  if (!value) return "Non renseignée";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function DetailBlock({ number, title, children }) {
  return (
    <article className="detail-block">
      <span className="detail-number">{number}</span>
      <div className="detail-block-content">
        <h2>{title}</h2>
        <div className="detail-text">{children}</div>
      </div>
    </article>
  );
}

function EmptyContent({ children }) {
  return <p className="empty-content">{children}</p>;
}

export default function TafsirDetail() {
  const { slug } = useParams();

  const [tafsir, setTafsir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTafsir() {
      setLoading(true);
      setError("");

      try {
        const data = await getTafsirBySlug(slug);

        if (active) {
          setTafsir(data);
        }
      } catch (err) {
        if (active) {
          setError(
            "Impossible de charger cette séance. Vérifie ta connexion au serveur."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTafsir();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="page">
        <PageHeaderr
          eyebrow="Nouroul Qur’An"
          title="Chargement du Tafsir"
          text="Nous préparons le contenu de cette séance."
        />
        <section className="section">
          <div className="container">
            <p className="empty-content">Chargement en cours…</p>
          </div>
        </section>
      </div>
    );
  }

  if (error || !tafsir) {
    return (
      <div className="page">
        <PageHeaderr
          eyebrow="Tafsir"
          title="Séance introuvable"
          text={
            error ||
            "Cette séance n'existe pas ou n'est plus disponible."
          }
        />
        <section className="section">
          <div className="container">
            <Link to="/tafsir" className="btn btn-primary">
              <ArrowLeft size={16} />
              Toutes les séances de Tafsir
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const sourate = tafsir.surah || {};

  const themes = Array.isArray(tafsir.themes_principaux)
    ? tafsir.themes_principaux
    : Array.isArray(tafsir.themesPrincipaux)
      ? tafsir.themesPrincipaux
      : [];

  const termes = Array.isArray(tafsir.termes_cles)
    ? tafsir.termes_cles
    : Array.isArray(tafsir.termesCles)
      ? tafsir.termesCles
      : [];

  const lecons = Array.isArray(tafsir.lecons_pratiques)
    ? tafsir.lecons_pratiques
    : Array.isArray(tafsir.leconsPratiques)
      ? tafsir.leconsPratiques
      : [];

  const lieu = [tafsir.lieu, tafsir.mosquee]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="page tafsir-detail-page">
      <PageHeaderr
        eyebrow="Nouroul Qur’An · Séance de Tafsir"
        title={sourate.name || "Étude du Coran"}
        text={
          tafsir.description ||
          "Méditons sur les versets du Coran et approfondissons leur compréhension."
        }
      />

      <section className="section">
        <div className="container">
          <div className="detail-meta">
            <div className="detail-meta-item">
              <UserRound size={19} />
              <span>
                <span className="detail-meta-label">Intervenant</span>
                <span className="detail-meta-value">
                  {tafsir.intervenant || "Non renseigné"}
                </span>
              </span>
            </div>

            <div className="detail-meta-item">
              <CalendarDays size={19} />
              <span>
                <span className="detail-meta-label">Date de la séance</span>
                <span className="detail-meta-value">
                  {formatDate(tafsir.date)}
                </span>
              </span>
            </div>

            <div className="detail-meta-item">
              <MapPin size={19} />
              <span>
                <span className="detail-meta-label">Lieu</span>
                <span className="detail-meta-value">
                  {lieu || "Non renseigné"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="detail-content">
            <DetailBlock number="01" title="L’identité de la sourate">
              <p>
                <strong>Nom :</strong>{" "}
                {sourate.name || "Non renseigné"}
              </p>

              <p>
                <strong>Numéro dans le Coran :</strong>{" "}
                {sourate.number ?? "Non renseigné"}
              </p>

              <p>
                <strong>Nombre de versets :</strong>{" "}
                {sourate.verse_count ??
                  "Non renseigné"}
              </p>

              <p>
                <strong>Raison de l’appellation :</strong>{" "}
                {sourate.appellation_reason ||
                  "Cette information sera ajoutée prochainement."}
              </p>

              <p>
                <strong>Ordre de révélation :</strong>{" "}
                {sourate.revelation_order ??
                  "Cette information sera ajoutée prochainement."}
              </p>

              <p>
                <strong>Type :</strong>{" "}
                {sourate.revelation_type ||
                  "Cette information sera ajoutée prochainement."}
              </p>
            </DetailBlock>

            <DetailBlock number="02" title="Le contexte de la révélation">
              {tafsir.contexte_revelation ||
              tafsir.contexteRevelation ? (
                <p>
                  {tafsir.contexte_revelation ||
                    tafsir.contexteRevelation}
                </p>
              ) : (
                <EmptyContent>
                  Le contexte de révélation sera ajouté prochainement.
                </EmptyContent>
              )}
            </DetailBlock>

            <DetailBlock number="03" title="Les thèmes principaux">
              {themes.length > 0 ? (
                <ul className="detail-list">
                  {themes.map((theme, index) => (
                    <li key={index}>{theme}</li>
                  ))}
                </ul>
              ) : (
                <EmptyContent>
                  Les principaux thèmes abordés seront ajoutés
                  prochainement.
                </EmptyContent>
              )}
            </DetailBlock>

            <DetailBlock
              number="04"
              title="Explication des termes et passages clés"
            >
              {termes.length > 0 ? (
                <ul className="detail-list">
                  {termes.map((terme, index) => (
                    <li key={index}>{terme}</li>
                  ))}
                </ul>
              ) : tafsir.explication ? (
                <p>{tafsir.explication}</p>
              ) : (
                <EmptyContent>
                  L’explication des termes et passages clés sera ajoutée
                  prochainement.
                </EmptyContent>
              )}
            </DetailBlock>

            <DetailBlock number="05" title="Les leçons pratiques">
              {lecons.length > 0 ? (
                <ul className="detail-list">
                  {lecons.map((lecon, index) => (
                    <li key={index}>{lecon}</li>
                  ))}
                </ul>
              ) : (
                <EmptyContent>
                  Les leçons pratiques tirées de cette séance seront
                  ajoutées prochainement.
                </EmptyContent>
              )}
            </DetailBlock>
          </div>

          <div className="detail-footer">
            <Link to="/tafsir" className="btn btn-secondary">
              <ArrowLeft size={16} />
              Toutes les séances de Tafsir
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
