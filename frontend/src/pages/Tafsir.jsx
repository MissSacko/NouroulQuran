import PageHeaderr from '../components/PageHeaderr'
import TafsirCard from '../components/TafsirCard'
import { tafsirs } from '../data/tafsir'

export default function Tafsir() {
  const sorted = [...tafsirs].sort((a, b) => b.dateISO.localeCompare(a.dateISO))

  return (
    <main>
      <PageHeaderr
        eyebrow="Tafsir du Coran"
        title="Nos séances de Tafsir"
        text={`${tafsirs.length} séances renseignées, avec les informations disponibles sur chaque rencontre.`}
      />
      <section className="section">
        <div className="container">
          <div className="cards-grid sessions-grid tafsir-grid">
            {sorted.map((tafsir) => <TafsirCard key={tafsir.slug} tafsir={tafsir} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
