import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";

import {
  getSeries,
  getSoirees,
  getTafsirs,
  getUpcomingEvents,
} from "../../services/api";

export default function AdminDashboard() {

  const [data, setData] = useState({
    series: [],
    soirees: [],
    tafsirs: [],
    events: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      try {

        const [
          series,
          soirees,
          tafsirs,
          events,
        ] = await Promise.all([
          getSeries(),
          getSoirees(),
          getTafsirs(),
          getUpcomingEvents(),
        ]);

        setData({
          series,
          soirees,
          tafsirs,
          events,
        });

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    }

    load();

  }, []);

  return (
    <AdminLayout>

      <div className="page-heading">

        <div>
          <span className="admin-overline">
            VUE D'ENSEMBLE
          </span>

          <h2>
            Tableau de bord
          </h2>

          <p>
            Bienvenue dans l'espace
            d'administration de Nouroul Qur'An.
          </p>
        </div>

      </div>

      {loading ? (

        <div className="admin-loading">
          Chargement...
        </div>

      ) : (

        <>
          <div className="stats-grid">

            <StatCard
              label="Soirées"
              value={data.soirees.length}
              icon="◉"
            />

            <StatCard
              label="Séries"
              value={data.series.length}
              icon="◈"
            />

            <StatCard
              label="Tafsirs"
              value={data.tafsirs.length}
              icon="☾"
            />

            <StatCard
              label="Événements à venir"
              value={data.events.length}
              icon="◆"
            />

          </div>

          <section className="dashboard-panel">

            <div className="panel-heading">
              <div>
                <span className="admin-overline">
                  AGENDA
                </span>

                <h3>
                  Événements à venir
                </h3>
              </div>
            </div>

            {data.events.length === 0 ? (

              <div className="empty-state">
                Aucun événement à venir.
              </div>

            ) : (

              data.events.map((event) => (

                <div
                  className="dashboard-event"
                  key={event.id}
                >

                  <div className="dashboard-event-date">
                    <strong>
                      {new Date(
                        event.date
                      ).getDate()}
                    </strong>

                    <span>
                      {new Date(
                        event.date
                      ).toLocaleDateString(
                        "fr-FR",
                        { month: "short" }
                      )}
                    </span>
                  </div>

                  <div className="dashboard-event-info">

                    <h4>
                      {event.title}
                    </h4>

                    <p>
                      {event.location}
                    </p>

                    <small>
                      {event.start_time}
                      {" — "}
                      {event.end_time}
                    </small>

                  </div>

                  {event.countdown_enabled && (
                    <span className="gold-badge">
                      Compte à rebours
                    </span>
                  )}

                </div>

              ))

            )}

          </section>
        </>
      )}

    </AdminLayout>
  );
}