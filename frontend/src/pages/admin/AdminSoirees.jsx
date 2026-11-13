import AdminCollection from '../../components/admin/AdminCollection'
import { getAdminSoirees, getSeries, createSoiree, updateSoiree, deleteSoiree } from '../../services/api'

const fields = [
  { name: 'number', label: 'Numéro de soirée', type: 'number', min: 1 },
  { name: 'title', label: 'Titre', required: true },
  { name: 'slug', label: 'Identifiant URL (slug)', required: true, placeholder: 'titre-de-la-soiree' },
  { name: 'subtitle', label: 'Sous-titre', fullWidth: true },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'speaker', label: 'Intervenant' },
  { name: 'series_id', label: 'Série associée', type: 'select', optionsKey: 'series', numeric: true, placeholder: 'Soirée indépendante' },
  { name: 'summary', label: 'Résumé affiché sur les cartes', type: 'textarea', fullWidth: true },
  { name: 'description', label: 'Description complémentaire (facultatif)', type: 'textarea', fullWidth: true },
  { name: 'recording_url', label: 'Lien de l’enregistrement Google Drive', type: 'url', fullWidth: true, placeholder: 'https://drive.google.com/file/d/…' },
  { name: 'recording_available', label: 'Enregistrement disponible', type: 'checkbox', defaultValue: false },
  { name: 'cover_image', label: 'URL d’une affiche (facultatif)', type: 'url', fullWidth: true },
  { name: 'is_published', label: 'Publier cette soirée', type: 'checkbox', defaultValue: true },
]
const loadOptions = async () => ({ series: (await getSeries()).map((item) => ({ value: String(item.id), label: item.title })) })
export default function AdminSoirees() {
  return <AdminCollection title="Soirées" description="Gère les rencontres, rattache-les à une série et ajoute les liens Google Drive des enregistrements." fields={fields} loadItems={getAdminSoirees} createItem={createSoiree} updateItem={updateSoiree} deleteItem={deleteSoiree} loadOptions={loadOptions} />
}
