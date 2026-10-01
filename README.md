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
- `/soirees/:slug` — détail d'une soirée (lecteur audio ou vidéo)
- `/series` — liste de toutes les séries thématiques
- `/series/:slug` — détail d'une série + liste des soirées qui la composent
- `/tafsir` — liste complète des séances de tafsir

## Personnalisation

- Contenu : `frontend/src/data/*.js` — chaque soirée, série, valeur, etc.
  est un objet simple à éditer.
- Couleurs / typographies : variables CSS en haut de
  `frontend/src/styles.css` (`--deep`, `--gold`, `--ivory`, etc.).
- Images/audio/vidéo des soirées : `frontend/public/media/` — voir le
  `README.md` de ce dossier pour la convention de nommage des fichiers.
