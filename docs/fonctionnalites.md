# Guide des fonctionnalités

Documentation complète de toutes les fonctionnalités du navigateur.

## 📑 Gestion des onglets

### Créer un nouvel onglet

**Méthode 1 : Bouton "+"**
- Cliquer sur le bouton `+` dans la barre d'onglets
- Un nouvel onglet s'ouvre avec la page d'accueil

**Méthode 2 : Liens**
- Les liens externes s'ouvrent dans l'onglet actuel
- Maintenir `Ctrl` (Windows) ou `Cmd` (Mac) pour ouvrir dans un nouvel onglet

### Naviguer entre les onglets

**Par clic** :
- Cliquer sur l'onglet désiré dans la barre d'onglets
- L'onglet actif est mis en surbrillance

**Au clavier** (à implémenter) :
- `Ctrl+Tab` : Onglet suivant
- `Ctrl+Shift+Tab` : Onglet précédent
- `Ctrl+1-8` : Aller à l'onglet N
- `Ctrl+9` : Dernier onglet

### Fermer un onglet

**Par clic** :
- Cliquer sur le `X` à droite de l'onglet
- Si c'était le dernier onglet, un nouvel onglet s'ouvre automatiquement

**Au clavier** (à implémenter) :
- `Ctrl+W` : Fermer l'onglet actif

### États d'un onglet

| État | Indicateur | Description |
|------|-----------|-------------|
| Actif | Fond blanc, ombre | Onglet actuellement affiché |
| Inactif | Fond gris clair | Onglet en arrière-plan |
| Chargement | Spinner | Page en cours de chargement |
| Erreur | Icône par défaut | Échec du chargement |

---

## 🧭 Navigation

### Barre d'adresse (URL Bar)

**Entrer une URL** :
1. Cliquer dans la barre d'adresse
2. Taper l'URL ou terme de recherche
3. Appuyer sur `Enter`

**Comportements intelligents** :
- `google.com` → `https://google.com`
- `github repo code` → Recherche Google
- `https://example.com/page` → Navigation directe

### Boutons de navigation

**← Retour** :
- Revient à la page précédente
- Désactivé si pas d'historique précédent
- Raccourci : `Alt+←` (à implémenter)

**→ Avant** :
- Avance à la page suivante dans l'historique
- Désactivé si pas d'historique suivant
- Raccourci : `Alt+→` (à implémenter)

**⟳ Recharger** :
- Recharge la page actuelle
- Force le rechargement du cache
- Raccourci : `F5` ou `Ctrl+R` (à implémenter)

**⌂ Accueil** :
- Retourne à la page d'accueil personnalisée
- Même comportement qu'un nouvel onglet

### Historique de navigation

L'historique est géré par onglet :
- Chaque onglet a son propre historique
- L'historique persiste tant que l'onglet est ouvert
- Fermer un onglet efface son historique

---

## ⭐ Système de favoris

### Ajouter un favori

**Méthode 1 : Bouton étoile**
1. Naviguer vers la page à sauvegarder
2. Cliquer sur l'icône étoile (★) dans la barre de navigation
3. Le favori est ajouté instantanément

**Indicateurs** :
- Étoile vide (☆) : Page non dans les favoris
- Étoile pleine (★) : Page dans les favoris

### Barre de favoris

**Affichage** :
- Située sous la barre de navigation
- Affiche tous les favoris enregistrés
- Défilement horizontal si trop de favoris

**Utilisation** :
- Cliquer sur un favori pour naviguer vers le site
- Survol affiche l'URL complète en tooltip

**Personnalisation** :
- Les favoris affichent l'icône Globe
- Titres tronqués à 20 caractères max
- Ordre d'ajout (du plus ancien au plus récent)

### Supprimer un favori

1. Naviguer vers la page en favoris
2. Cliquer sur l'étoile pleine dans la barre de navigation
3. Le favori est retiré de la barre

### Persistance

Les favoris sont sauvegardés automatiquement :
- **Fichier** : `userData/bookmarks.json`
- **Format** : JSON avec id, title, url
- **Chargement** : Au démarrage de l'application
- **Sauvegarde** : À chaque ajout/suppression

**Emplacement du fichier** :
- Windows : `%APPDATA%/browser-app/bookmarks.json`
- macOS : `~/Library/Application Support/browser-app/bookmarks.json`
- Linux : `~/.config/browser-app/bookmarks.json`

---

## 👥 Groupes d'onglets

### Créer un groupe

1. Cliquer sur l'icône **Layers** (⧉) dans la barre d'onglets
2. Cliquer sur **"New Group"**
3. Entrer un nom pour le groupe
4. Choisir une couleur parmi les 15 disponibles
5. Cliquer sur **"Create"**

**Palette de couleurs** :
- Rouge, Orange, Jaune, Lime
- Vert, Émeraude, Sarcelle, Cyan
- Bleu, Indigo, Violet, Violet foncé
- Rose, Rose vif, Gris

### Ajouter des onglets à un groupe

**Méthode Drag & Drop** :
1. Cliquer et maintenir sur un onglet
2. Glisser vers un groupe existant
3. Relâcher pour ajouter l'onglet au groupe

**Indicateurs visuels** :
- Zone du groupe se colore au survol
- Bande de couleur sur le groupe
- Fond légèrement teinté de la couleur du groupe

### Organisation des onglets

**Affichage groupé** :
```
┌─ Groupe Travail (Bleu) ─────────┐
│ [Gmail]  [Drive]  [Calendar]    │
└─────────────────────────────────┘

┌─ Groupe Projet (Vert) ──────────┐
│ [GitHub]  [Docs]  [Figma]       │
└─────────────────────────────────┘

[YouTube]  [Reddit]  (onglets sans groupe)
```

### Réduire/Développer un groupe

**Réduire** :
1. Cliquer sur l'en-tête du groupe
2. Les onglets sont masqués
3. L'en-tête affiche le nombre d'onglets : `Travail (3)`
4. Icône chevron → vers la droite

**Développer** :
1. Cliquer sur l'en-tête du groupe réduit
2. Les onglets réapparaissent
3. Icône chevron ↓ vers le bas

**Avantages** :
- Économise de l'espace dans la barre d'onglets
- Garde les onglets actifs en arrière-plan
- Navigation rapide vers les groupes

### Retirer un onglet d'un groupe

1. Glisser l'onglet hors du groupe
2. Le déposer dans la zone des onglets sans groupe
3. L'onglet redevient indépendant

### Supprimer un groupe

1. Ouvrir le menu des groupes (icône Layers)
2. Cliquer sur le `X` à côté du nom du groupe
3. Le groupe est supprimé
4. Les onglets restent ouverts et deviennent indépendants

### Renommer/Modifier un groupe

**Nom** :
- Actuellement : Nom fixe à la création
- À implémenter : Double-clic sur le nom pour éditer

**Couleur** :
- Actuellement : Couleur fixe à la création
- À implémenter : Menu contextuel pour changer la couleur

### Persistance

Les groupes sont sauvegardés automatiquement :
- **Fichier** : `userData/groups.json`
- **Format** : JSON avec id, name, color, isCollapsed, tabs[]
- **Synchronisation** : Les onglets gardent leur `groupId`

---

## 🏠 Page d'accueil

### Affichage

La page d'accueil s'affiche :
- Lors du premier lancement
- En créant un nouvel onglet
- En cliquant sur le bouton Accueil (⌂)

### Barre de recherche

**Fonctionnalités** :
- Barre centrée, grand format (48px de hauteur)
- Focus automatique à l'ouverture
- Recherche Google par défaut

**Utilisation** :
1. Taper votre recherche
2. Appuyer sur `Enter`
3. Redirige vers Google avec les résultats

### Liens rapides

**Sites prédéfinis** :
- Google
- YouTube
- GitHub
- Twitter
- Gmail
- Amazon
- Wikipedia
- Reddit

**Interaction** :
- Cliquer pour naviguer vers le site
- Effet d'élévation au survol
- Icônes modernes de Lucide React

**Personnalisation** (à implémenter) :
- Ajouter des liens personnalisés
- Retirer des liens
- Réorganiser par drag & drop
- Changer les icônes

### Design

- Fond dégradé gris clair (`#f5f5f5` → `#e8e8e8`)
- Logo Globe centré (64px)
- Grille responsive (min 120px par lien)
- Ombre douce sur les cartes

---

## 🪟 Contrôles de fenêtre

### Barre de titre personnalisée

Le navigateur n'utilise pas la barre de titre native :
- Barre personnalisée en haut
- Style minimaliste macOS-like
- Hauteur : 32px
- Zone draggable pour déplacer la fenêtre

### Boutons

**● Fermer (Rouge)** :
- Ferme complètement l'application
- Sauvegarde automatique des données
- Tous les onglets sont fermés

**● Maximiser (Vert)** :
- Maximise la fenêtre en plein écran
- Clic à nouveau : Restaure la taille précédente
- S'adapte à la taille de l'écran

**● Minimiser (Jaune)** :
- Réduit la fenêtre dans la barre des tâches
- L'application reste en cours d'exécution
- Les pages continuent de charger en arrière-plan

---

## 🎨 Personnalisation

### Thème

**Actuel** : Thème clair minimaliste
- Tons neutres : blancs et gris
- Pas de couleurs vives dans l'UI
- Accent sur le contenu

**À implémenter** :
- Thème sombre
- Personnalisation des couleurs
- Transparence/Blur effects

### Interface

**Espacement** :
- Barre de titre : 32px
- Barre d'onglets : 36px min
- Navigation : 40px
- Favoris : 32px
- **Total UI** : 140px
- **Contenu** : Reste de la fenêtre

### Raccourcis clavier

**À implémenter** :

| Action | Raccourci |
|--------|-----------|
| Nouvel onglet | `Ctrl+T` |
| Fermer onglet | `Ctrl+W` |
| Onglet suivant | `Ctrl+Tab` |
| Onglet précédent | `Ctrl+Shift+Tab` |
| Actualiser | `F5`, `Ctrl+R` |
| Rechercher dans page | `Ctrl+F` |
| Ouvrir favoris | `Ctrl+B` |
| Historique | `Ctrl+H` |
| Zoom + | `Ctrl++` |
| Zoom - | `Ctrl+-` |
| Zoom reset | `Ctrl+0` |

---

## 🔍 Fonctionnalités avancées (à implémenter)

### Recherche dans la page
- `Ctrl+F` : Ouvrir la barre de recherche
- Surlignage des résultats
- Navigation résultat suivant/précédent

### Historique de navigation
- Page dédiée à l'historique
- Recherche dans l'historique
- Suppression d'entrées
- Nettoyage complet

### Téléchargements
- Gestionnaire de téléchargements
- Barre de progression
- Ouvrir le dossier de téléchargements
- Annuler un téléchargement

### Paramètres
- Page de configuration
- Moteur de recherche par défaut
- Page d'accueil personnalisée
- Gestion du cache
- Cookies et données de navigation

### Extensions
- Support des extensions Chrome
- Gestionnaire d'extensions
- Permissions

### Mode lecture
- Extraction du contenu principal
- Suppression des distractions
- Typographie optimisée

### Capture d'écran
- Capture de la zone visible
- Capture de la page entière
- Annotation d'image

### DevTools
- Ouvrir les outils de développement
- Console JavaScript
- Inspecteur d'éléments
- Network monitor

---

## 📊 Performance

### Gestion de la mémoire

**BrowserView** :
- Chaque onglet = processus isolé
- Fermer un onglet libère la mémoire
- Pas de limite du nombre d'onglets

**Optimisations** :
- Onglets inactifs : bounds à 0 (masqués)
- Pas de rendu si non visible
- Cache navigateur standard

### Vitesse

- **Démarrage** : < 2 secondes
- **Nouvel onglet** : Instantané
- **Navigation** : Dépend de la connexion
- **Switch onglets** : < 100ms

### Espace disque

- **Application** : ~200 MB (avec Electron/Chromium)
- **Données utilisateur** : < 1 MB
  - bookmarks.json : Quelques KB
  - groups.json : Quelques KB
  - Cache : Géré par Chromium
