# Minimalist Browser

Un navigateur web minimaliste et fonctionnel construit avec Electron et React.

## Fonctionnalités

- ✨ **Gestion des onglets** - Créer, fermer et naviguer entre plusieurs onglets
- 🔄 **Navigation** - Boutons retour, avant et rafraîchir
- ⭐ **Système de favoris** - Ajouter et gérer vos sites favoris avec une barre de favoris
- 🏠 **Page d'accueil personnalisée** - Avec barre de recherche et liens rapides
- 👥 **Groupes d'onglets** - Organiser les onglets en groupes avec nom et couleur
- 🎨 **Design minimaliste** - Interface épurée en tons neutres

## Installation

1. Cloner le repository
```bash
git clone [votre-repo]
cd browser
```

2. Installer les dépendances
```bash
npm install
```

## Démarrage

Pour lancer le navigateur en mode développement :
```bash
npm start
```

## Build

Pour créer une version executable :
```bash
npm run electron-build
```

## Technologies utilisées

- **Electron** - Pour créer l'application desktop avec Chromium
- **React** - Pour l'interface utilisateur
- **Zustand** - Pour la gestion d'état
- **Lucide React** - Pour les icônes
- **BrowserView** - Module Electron pour afficher les pages web
