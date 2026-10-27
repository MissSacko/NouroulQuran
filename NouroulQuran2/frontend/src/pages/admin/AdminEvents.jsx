import AdminCollection from '../../components/admin/AdminCollection'
import { getAdminEvents, createEvent, updateEvent, deleteEvent } from '../../services/api'

const fields = [
  { name: 'title', label: 'Nom de l’événement', required: true },
  { name: 'slug', label: 'Identifiant URL (slug)', required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'start_time', label: 'Heure de début', type: 'time' },
  { name: 'end_time', label: 'Heure de fin', type: 'time' },
  { name: 'location', label: 'Lieu', fullWidth: true },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  { name: 'cover_image', label: 'URL de l’affiche (facultatif)', type: 'url', fullWidth: true },
  { name: 'registration_url', label: 'Lien d’inscription', type: 'url', fullWidth: true },
  { name: 'registration_enabled', label: 'Activer le bouton d’inscription', type: 'checkbox', defaultValue: false },
  { name: 'countdown_enabled', label: 'Afficher le compte à rebours', type: 'checkbox', defaultValue: false },
  { name: 'is_published', label: 'Publier cet événement', type: 'checkbox', defaultValue: true },
]
export default function AdminEvents() {
  return <AdminCollection title="Événements" description="Gère les événements du club, les inscriptions et le compte à rebours de la page d’accueil." fields={fields} loadItems={getAdminEvents} createItem={createEvent} updateItem={updateEvent} deleteItem={deleteEvent} />
}
