import AdminCollection from '../../components/admin/AdminCollection'
import { getAdminSeries, createSeries, updateSeries, deleteSeries } from '../../services/api'

const fields = [
  { name: 'title', label: 'Nom de la série', required: true },
  { name: 'slug', label: 'Identifiant URL (slug)', required: true, placeholder: 'sur-les-traces-des-sahabas' },
  { name: 'subtitle', label: 'Sous-titre', fullWidth: true },
  { name: 'description', label: 'Résumé de la série', type: 'textarea', fullWidth: true },
  { name: 'introduction', label: 'Présentation détaillée', type: 'textarea', fullWidth: true },
  { name: 'objectives', label: 'Objectifs de la série', type: 'json', fullWidth: true, placeholder: 'Un objectif par ligne' },
  { name: 'drive_folder_url', label: 'Lien du dossier Google Drive', type: 'url', fullWidth: true, placeholder: 'https://drive.google.com/drive/folders/…' },
  { name: 'cover_image', label: 'URL de l’image (facultatif)', type: 'url', fullWidth: true },
  { name: 'is_published', label: 'Publier cette série', type: 'checkbox', defaultValue: true },
]

export default function AdminSeries() {
  return <AdminCollection title="Séries" description="Présente les parcours thématiques et relie leur dossier d’enregistrements Google Drive." fields={fields} loadItems={getAdminSeries} createItem={createSeries} updateItem={updateSeries} deleteItem={deleteSeries} />
}
