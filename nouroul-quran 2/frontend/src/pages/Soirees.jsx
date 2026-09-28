import { useMemo, useState } from 'react'
import PageHeaderr from '../components/PageHeaderr'
import FilterBar from '../components/FilterBar'
import SessionCard from '../components/SessionCard'
import { soirees } from '../data/soirees'

const FILTERS = ['Toutes', 'Ordinaire', 'Prépa Ramadan', 'Sur les traces des Sahabas']

export default function Soirees() {
  const [filter, setFilter] = useState('Toutes')
  const sorted = useMemo(() => [...soirees].sort((a, b) => b.dateISO.localeCompare(a.dateISO)), [])
  const filtered = sorted.filter((session) => filter === 'Toutes' || session.period === filter)

  return (
    <main>
      <PageHeaderr
        eyebrow="Bibliothèque des soirées"
        title="Toutes nos soirées"
        text={`${soirees.length} soirées enregistrées dans notre parcours Nouroul Qur'an.`}
      />
      <section className="section">
        <div className="container">
          <FilterBar filters={FILTERS} active={filter} onChange={setFilter} />
          <div className="cards-grid sessions-grid">
            {filtered.map((session) => <SessionCard key={session.slug} session={session} />)}
          </div>
          {filtered.length === 0 && <p className="empty-state">Aucune soirée ne correspond à ce filtre.</p>}
        </div>
      </section>
    </main>
  )
}
