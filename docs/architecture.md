# Architecture de l'application

## 🏗️ Vue d'ensemble

Le navigateur suit une architecture **Electron + React** avec une séparation claire entre le processus principal et le processus de rendu.

```
┌─────────────────────────────────────────┐
│         Application Electron             │
├─────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────┐     │
│  │   Main Process (Node.js)       │     │
│  │                                 │     │
│  │  - main.js                      │     │
│  │  - Gestion BrowserView          │     │
│  │  - IPC Handlers                 │     │
│  │  - Sauvegarde données           │     │
│  └────────────┬───────────────────┘     │
│               │ IPC                      │
│               │ Communication            │
│  ┌────────────▼───────────────────┐     │
│  │   Renderer Process (React)      │     │
│  │                                 │     │
│  │  - Components UI                │     │
│  │  - Zustand Store                │     │
│  │  - Event Handlers               │     │
│  └────────────┬───────────────────┘     │
│               │                          │
│  ┌────────────▼───────────────────┐     │
│  │   BrowserView (Chromium)        │     │
│  │                                 │     │
│  │  - Pages web chargées           │     │
│  │  - Navigation                   │     │
│  └─────────────────────────────────┘     │
│                                          │
└─────────────────────────────────────────┘
```

## 📁 Structure des dossiers

```
browser/
├── electron/                 # Processus principal Electron
│   ├── main.js              # Point d'entrée Electron
│   └── preload.js           # Script de préchargement sécurisé
│
├── src/                     # Code React
│   ├── components/          # Composants UI
│   │   ├── TitleBar.js     # Barre de titre
│   │   ├── TabBar.js       # Barre d'onglets
│   │   ├── TabGroupMenu.js # Menu des groupes
│   │   ├── NavigationBar.js # Barre de navigation
│   │   ├── BookmarksBar.js # Barre de favoris
│   │   └── HomePage.js     # Page d'accueil
│   │
│   ├── store/              # Gestion d'état
│   │   └── browserStore.js # Store Zustand
│   │
│   ├── App.js              # Composant principal
│   ├── App.css             # Styles principaux
│   ├── index.js            # Point d'entrée React
│   └── index.css           # Styles globaux
│
├── public/                 # Ressources statiques
│   └── index.html          # HTML de base
│
├── docs/                   # Documentation
└── package.json            # Dépendances et scripts
```

## 🔄 Flux de données

### 1. Action utilisateur
L'utilisateur interagit avec un composant React (ex: clic sur un bouton)

### 2. Update du Store
Le composant appelle une fonction du store Zustand

### 3. Communication IPC
Le store envoie un message au processus principal via `window.electronAPI`

### 4. Traitement Electron
Le processus principal traite la demande :
- Manipulation des BrowserViews
- Sauvegarde des données
- Gestion des fenêtres

### 5. Réponse
Le processus principal répond ou émet un événement

### 6. Mise à jour UI
Le store met à jour son état, déclenchant le re-render des composants React

## 🔐 Sécurité

### Context Isolation
- `contextIsolation: true` dans les BrowserWindows
- Communication uniquement via IPC sécurisé
- Pas d'accès direct à Node.js depuis le renderer

### Preload Script
Le fichier `preload.js` expose une API limitée et sécurisée via `contextBridge` :
```javascript
window.electronAPI = {
  createTab, switchTab, closeTab,
  navigate, goBack, goForward,
  addBookmark, removeBookmark,
  // ... autres méthodes sécurisées
}
```

## 🎨 Gestion de l'état

### Zustand Store
Un store centralisé gère tout l'état de l'application :
- Liste des onglets
- Onglet actif
- Favoris
- Groupes d'onglets

### Synchronisation
Les données persistantes (favoris, groupes) sont :
1. Stockées dans le store React
2. Sauvegardées sur disque par Electron
3. Rechargées au démarrage

## 🖥️ BrowserView

Chaque onglet est représenté par un `BrowserView` Electron :
- Intégration native de Chromium
- Isolation des processus
- Performance optimale
- Contrôle total de la navigation

### Cycle de vie d'un BrowserView
1. **Création** : `createBrowserView(id, url)`
2. **Affichage** : Positionnement avec `setBounds()`
3. **Masquage** : Bounds à zéro pour l'onglet inactif
4. **Destruction** : `removeBrowserView()` à la fermeture

## 📡 Communication IPC

### Channels principaux

**Renderer → Main** (invoke/handle)
- `create-tab` : Créer un nouvel onglet
- `switch-tab` : Changer d'onglet actif
- `close-tab` : Fermer un onglet
- `navigate` : Naviguer vers une URL
- `go-back` / `go-forward` : Navigation historique
- `add-bookmark` / `remove-bookmark` : Gestion favoris
- `create-group` / `update-group` / `delete-group` : Gestion groupes

**Main → Renderer** (send/on)
- `navigation-updated` : URL et état de navigation changés
- `title-updated` : Titre de la page changé
- `favicon-updated` : Favicon de la page chargé
- `bookmarks-updated` : Liste des favoris modifiée
- `groups-updated` : Groupes d'onglets modifiés

## 🔧 Technologies utilisées

### Frontend
- **React 18** : Interface utilisateur
- **Zustand** : Gestion d'état simple et performante
- **Lucide React** : Bibliothèque d'icônes moderne
- **CSS** : Styles personnalisés sans framework lourd

### Backend
- **Electron 27** : Framework desktop
- **Node.js** : Runtime serveur
- **File System** : Persistance des données

### Build & Dev
- **react-scripts** : Configuration Webpack
- **concurrently** : Lancement simultané React + Electron
- **wait-on** : Attendre que le serveur React soit prêt
- **electron-builder** : Création des exécutables
