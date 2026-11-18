# Médias des soirées

Ce dossier accueille vos propres fichiers pour remplacer les visuels
d'exemple (Unsplash) et activer la lecture audio/vidéo sur la page de
détail d'une soirée.

```
public/media/
├── images/soirees/   → vos photos de couverture (jpg/png/webp)
├── audio/soirees/    → vos enregistrements audio (mp3/m4a)
└── video/soirees/    → vos enregistrements vidéo (mp4)
```

## Convention de nommage

Chaque soirée est définie dans `src/data/soirees.js`. Le nom de fichier
attendu correspond au `slug` (ou au numéro) de la soirée, par exemple :

```js
{
  slug: 'preparer-sa-rencontre-avec-allah',
  image: '/media/images/soirees/soiree-05.jpg',
  audioSrc: '/media/audio/soirees/soiree-05.mp3',
}
```

Pour activer un fichier :
1. Déposez-le dans le bon sous-dossier avec le nom exact attendu
   (`soiree-05.mp3`, `soiree-05.jpg`, etc.).
2. Mettez à jour le champ correspondant (`image`, `audioSrc` ou
   `videoSrc`) dans `src/data/soirees.js` si vous changez le nom de
   fichier.

Tant qu'un fichier audio/vidéo n'existe pas encore, la page de détail
affiche quand même le lecteur (avec un indice du chemin de fichier
attendu) — il suffit d'ajouter le fichier plus tard, sans toucher au
code.
