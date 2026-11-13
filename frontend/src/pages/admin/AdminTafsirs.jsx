import AdminCollection from '../../components/admin/AdminCollection'
import { getAdminTafsirs, getSurahs, createTafsir, updateTafsir, deleteTafsir } from '../../services/api'

const fields = [
  { name: 'slug', label: 'Identifiant URL (slug)', required: true, placeholder: 'tafsir-sourate-al-hadid' },
  { name: 'surah_id', label: 'Sourate étudiée', type: 'select', optionsKey: 'surahs', numeric: true, placeholder: 'Choisir une sourate' },
  { name: 'date', label: 'Date de la séance', type: 'date' },
  { name: 'intervenant', label: 'Intervenant' },
  { name: 'organisateur', label: 'Organisateur' },
  { name: 'lieu', label: 'Lieu' },
  { name: 'mosquee', label: 'Mosquée' },
  { name: 'description', label: 'Présentation de la séance', type: 'textarea', fullWidth: true },
  { name: 'contexte_revelation', label: 'Contexte de révélation', type: 'textarea', fullWidth: true },
  { name: 'themes_principaux', label: 'Thèmes principaux', type: 'json', fullWidth: true },
  { name: 'termes_cles', label: 'Termes et passages clés', type: 'json', fullWidth: true },
  { name: 'explication', label: 'Explication', type: 'textarea', fullWidth: true },
  { name: 'lecons_pratiques', label: 'Leçons pratiques', type: 'json', fullWidth: true },
  { name: 'cover_image', label: 'URL d’une image (facultatif)', type: 'url', fullWidth: true },
  { name: 'is_published', label: 'Publier ce Tafsir', type: 'checkbox', defaultValue: true },
]
const loadOptions = async () => ({ surahs: (await getSurahs()).map((item) => ({ value: String(item.id), label: `${item.number}. ${item.name}` })) })
export default function AdminTafsirs() {
  return <AdminCollection title="Tafsirs" description="Gère les séances, les sourates et le contenu pédagogique publié." fields={fields} loadItems={getAdminTafsirs} createItem={createTafsir} updateItem={updateTafsir} deleteItem={deleteTafsir} loadOptions={loadOptions} />
}
