# Nouroul Qur'an — React + Flask

Reproduction du site en React (frontend) avec une API Flask (backend) qui gère
le formulaire de contact/adhésion : chaque soumission est **enregistrée en
base de données** (SQLite par défaut) et déclenche un **e-mail de
notification**.

## Structure

```
nouroul-quran/
├── frontend/   → application React (Vite)
└── backend/    → API Flask
```

## 1. Lancer le backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # puis renseigner vos identifiants SMTP
python app.py
```

L'API démarre sur `http://localhost:5000`.

- `POST /api/contact` — reçoit `{ nom, email, telephone, sujet, message }`,
  valide les champs, enregistre en base et envoie l'e-mail de notification.
- `GET /api/contact` — liste les soumissions (protégé par le header
  `X-Admin-Key`, valeur définie par `ADMIN_API_KEY` dans `.env`).
- `GET /api/health` — vérification rapide que l'API tourne.

**Configurer l'envoi d'e-mail** : dans `.env`, renseignez `SMTP_HOST`,
`SMTP_USER`, `SMTP_PASSWORD` et `NOTIFY_EMAIL`. Avec Gmail, utilisez un
[mot de passe d'application](https://myaccount.google.com/apppasswords)
plutôt que le mot de passe du compte. Si le SMTP n'est pas configuré,
l'enregistrement en base fonctionne quand même — seul l'e-mail est ignoré
(avec un avertissement dans les logs).

## 2. Lancer le frontend

```bash
cd frontend
npm install
cp .env.example .env            # VITE_API_URL=http://localhost:5000/api
npm run dev
```

Le site est disponible sur `http://localhost:5173`. En dev, `vite.config.js`
proxifie déjà `/api` vers `http://localhost:5000`, donc `.env` est surtout
utile pour la mise en production.

## 3. Déploiement

- **Frontend** : `npm run build` génère `frontend/dist/`, à héberger sur
  Netlify, Vercel, ou un simple serveur statique. Pensez à définir
  `VITE_API_URL` avec l'URL publique de votre API.
- **Backend** : déployable sur Render, Railway, ou un VPS avec Gunicorn
  (`gunicorn app:create_app()`). Remplacez SQLite par PostgreSQL en
  production via `DATABASE_URL`, et définissez `FRONTEND_ORIGIN` avec le
  domaine réel du frontend pour le CORS.

## Structure du frontend

```
frontend/src/
├── data/         → contenu (soirées, séries, valeurs, équipe, galerie)
├── components/   → briques réutilisables (Navbar, cartes, sections d'accueil…)
├── pages/        → Home, Soirees, SoireeDetail, Series, SerieDetail, Tafsir
└── styles.css    → une seule feuille de style globale
```

Pages disponibles :
- `/` — accueil (aperçu de 3 soirées et 3 séries, avec boutons « voir tout »)
- `/soirees` — liste complète des soirées, avec filtres
- `/soirees/:slug` — détail d’une soirée et accès à son enregistrement Google Drive si disponible
- `/series` — liste de toutes les séries thématiques
- `/series/:slug` — détail d'une série + liste des soirées qui la composent
- `/tafsir` — liste complète des séances de Tafsir
- `/tafsir/:slug` — détail d’une séance de Tafsir
- `/admin/login` — connexion administrateur
- `/admin/dashboard` — tableau de bord
- `/admin/soirees`, `/admin/series`, `/admin/tafsirs`, `/admin/events` — gestion des contenus
- `/admin/contacts` — messages reçus depuis le formulaire de contact

## Personnalisation

- Contenus administrables : les séries, soirées, Tafsirs et événements sont lus depuis l’API Flask et gérés dans le dashboard. Les sections éditoriales fixes de la page d’accueil (valeurs et activités) restent dans `frontend/src/data/content.js`.
- Couleurs / typographies : variables CSS en haut de
  `frontend/src/styles.css` (`--deep`, `--gold`, `--ivory`, etc.).
- Les enregistrements des soirées sont hébergés sur Google Drive. Le site stocke uniquement les liens de partage dans la base de données ; aucune vidéo n’est téléversée dans le projet.


## Mise en route locale — version finalisée

### Backend Flask

1. Ouvrir un terminal dans `backend/`.
2. Créer et activer un environnement virtuel, puis installer `requirements.txt`.
3. Copier `.env.example` vers `.env` et remplacer `ADMIN_API_KEY` par une clé longue et aléatoire. Ne partagez jamais ce fichier.
4. Lancer `python migrate_drive_fields.py`. Ce script crée les tables absentes et ajoute les colonnes Drive manquantes sans supprimer les contenus existants.
5. Lancer `python run.py`. L’API locale est disponible sur `http://localhost:5000/api`.

Le script `seed.py` n’efface plus la base. Il s’arrête s’il détecte déjà des contenus, pour éviter de dupliquer ou supprimer des données.

### Frontend React

1. Ouvrir un autre terminal dans `frontend/`.
2. Lancer `npm ci`.
3. Copier `.env.example` vers `.env` si l’API n’est pas à l’adresse locale par défaut, puis définir `VITE_API_URL`.
4. Lancer `npm run dev`.

### Administration

Ouvrir `/admin/login` et saisir la valeur de `ADMIN_API_KEY` définie dans le `.env` du backend. Le dashboard permet de gérer les séries, soirées, Tafsirs et événements. Les pages d’administration vérifient la clé auprès du serveur avant d’afficher les contenus.

### Google Drive

- Dans **Séries**, renseigner le lien du dossier Google Drive contenant les enregistrements de la série.
- Dans **Soirées**, renseigner le lien individuel de l’enregistrement et cocher « Enregistrement disponible ». Le site n’affiche le bouton de lecture que si la case est cochée et qu’un lien existe.
- Les liens doivent être partagés avec les droits adaptés (par exemple « Toute personne disposant du lien » si la diffusion publique est voulue). Les fichiers vidéo restent hébergés sur Google Drive, pas dans la base de données.

### Vérifications avant mise en production

- Remplacer `ADMIN_API_KEY` par une clé forte et garder le fichier `.env` hors du dépôt.
- Configurer `FRONTEND_ORIGIN` et `VITE_API_URL` avec les domaines de déploiement réels.
- Vérifier que la base a été migrée avant de démarrer l’application.
- Vérifier les autorisations de partage des liens Google Drive et tester chaque page sur mobile.
