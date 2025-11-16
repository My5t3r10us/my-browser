# Résumé de la documentation

Guide de navigation rapide de toute la documentation du navigateur.

## 📚 Documentation disponible

### Pour les utilisateurs

| Document | Description | Niveau |
|----------|-------------|--------|
| [Fonctionnalités](./fonctionnalites.md) | Guide complet des fonctionnalités | 🟢 Débutant |
| [Installation](./installation.md) | Installation et premiers pas | 🟢 Débutant |

### Pour les développeurs

| Document | Description | Niveau |
|----------|-------------|--------|
| [Architecture](./architecture.md) | Vue d'ensemble du système | 🟡 Intermédiaire |
| [Composants](./composants.md) | Documentation des composants React | 🟡 Intermédiaire |
| [Store](./store.md) | Gestion d'état avec Zustand | 🟡 Intermédiaire |
| [Electron](./electron.md) | Processus principal Electron | 🔴 Avancé |
| [API Reference](./API.md) | Référence complète des APIs | 🔴 Avancé |

### Pour les contributeurs

| Document | Description |
|----------|-------------|
| [Contributing](./CONTRIBUTING.md) | Guide de contribution |

---

## 🎯 Parcours recommandés

### Je veux utiliser le navigateur

1. [Installation](./installation.md) - Installer et lancer
2. [Fonctionnalités](./fonctionnalites.md) - Découvrir les fonctionnalités

### Je veux comprendre comment ça marche

1. [Architecture](./architecture.md) - Vue d'ensemble
2. [Electron](./electron.md) - Processus principal
3. [Composants](./composants.md) - Interface React
4. [Store](./store.md) - Gestion d'état

### Je veux contribuer au projet

1. [Contributing](./CONTRIBUTING.md) - Standards et processus
2. [Architecture](./architecture.md) - Comprendre la structure
3. [API Reference](./API.md) - Référence des APIs
4. Choisir un fichier spécifique selon la tâche

### Je veux ajouter une fonctionnalité

1. [Architecture](./architecture.md) - Comprendre le système
2. [Store](./store.md) - Ajouter des actions
3. [Composants](./composants.md) - Créer/modifier l'UI
4. [Electron](./electron.md) - Ajouter des IPC handlers
5. [Contributing](./CONTRIBUTING.md) - Standards de code

---

## 📖 Contenu par fichier

### [README.md](./README.md)
- Table des matières
- Vue d'ensemble rapide
- Navigation de la documentation

### [architecture.md](./architecture.md)
- Diagramme d'architecture
- Structure des dossiers
- Flux de données
- Sécurité et isolation
- Technologies utilisées

**Concepts clés** :
- Main Process vs Renderer Process
- BrowserView
- IPC Communication
- Context Isolation

### [electron.md](./electron.md)
- Configuration du processus principal
- Gestion des BrowserViews
- Handlers IPC complets
- Persistance des données
- Contrôles de fenêtre

**APIs couvertes** :
- `createBrowserView()`
- `ipcMain.handle()`
- `BrowserView` events
- File system operations

### [composants.md](./composants.md)
- App.js - Composant racine
- TitleBar - Barre de titre
- TabBar - Gestion des onglets
- TabGroupMenu - Menu des groupes
- NavigationBar - Navigation
- BookmarksBar - Favoris
- HomePage - Page d'accueil

**Pour chaque composant** :
- Rôle et responsabilités
- État local
- Props
- Événements
- Code clé

### [store.md](./store.md)
- Structure de l'état
- Types TypeScript
- Actions détaillées
- Flux de données
- Hooks d'utilisation
- Bonnes pratiques

**Actions documentées** :
- Gestion des onglets (10 méthodes)
- Navigation (4 méthodes)
- Favoris (4 méthodes)
- Groupes d'onglets (6 méthodes)

### [fonctionnalites.md](./fonctionnalites.md)
- Guide utilisateur complet
- Gestion des onglets
- Navigation
- Système de favoris
- Groupes d'onglets
- Page d'accueil
- Contrôles de fenêtre
- Fonctionnalités à implémenter

**Cas d'usage** :
- Créer/fermer des onglets
- Organiser avec des groupes
- Sauvegarder des favoris
- Naviguer efficacement

### [installation.md](./installation.md)
- Prérequis système
- Installation pas à pas
- Mode développement
- Build de production
- Configuration
- Distribution
- Dépannage

**Commandes principales** :
```bash
npm install    # Installation
npm start      # Développement
npm run build  # Build React
npm run dist   # Créer l'exécutable
```

### [CONTRIBUTING.md](./CONTRIBUTING.md)
- Comment contribuer
- Standards de code
- Conventions de nommage
- Messages de commit
- Pull requests
- Tests
- Rapport de bugs

**Formats** :
- Conventional Commits
- Structure des composants
- Style CSS
- Tests unitaires et E2E

### [API.md](./API.md)
- Store API complète
- Electron IPC API
- Components API
- Types TypeScript
- Constantes
- Exemples d'utilisation
- Codes d'erreur

**Référence rapide** :
- Toutes les signatures de méthodes
- Types de retour
- Paramètres
- Événements

---

## 🔍 Index des sujets

### A
- **API Reference** → [API.md](./API.md)
- **Architecture** → [architecture.md](./architecture.md)
- **Auto-update** → [installation.md](./installation.md#distribution)

### B
- **Bookmarks** → [fonctionnalites.md](./fonctionnalites.md#système-de-favoris)
- **BrowserView** → [electron.md](./electron.md#gestion-des-browserviews)
- **Build** → [installation.md](./installation.md#build-de-production)

### C
- **Components** → [composants.md](./composants.md)
- **Context Isolation** → [architecture.md](./architecture.md#sécurité)
- **Contribution** → [CONTRIBUTING.md](./CONTRIBUTING.md)

### D
- **Développement** → [installation.md](./installation.md#développement)
- **Distribution** → [installation.md](./installation.md#distribution)

### E
- **Electron** → [electron.md](./electron.md)
- **Events** → [API.md](./API.md#event-listeners)

### F
- **Favoris** → [fonctionnalites.md](./fonctionnalites.md#système-de-favoris)
- **Fonctionnalités** → [fonctionnalites.md](./fonctionnalites.md)

### G
- **Groupes d'onglets** → [fonctionnalites.md](./fonctionnalites.md#groupes-donglets)

### H
- **HomePage** → [composants.md](./composants.md#homepage)

### I
- **Installation** → [installation.md](./installation.md)
- **IPC** → [electron.md](./electron.md#handlers-ipc)

### N
- **Navigation** → [fonctionnalites.md](./fonctionnalites.md#navigation)

### P
- **Persistance** → [electron.md](./electron.md#persistance-des-données)
- **Pull Request** → [CONTRIBUTING.md](./CONTRIBUTING.md#pull-request)

### R
- **React** → [composants.md](./composants.md)

### S
- **Store** → [store.md](./store.md)
- **Security** → [architecture.md](./architecture.md#sécurité)

### T
- **Tabs** → [fonctionnalites.md](./fonctionnalites.md#gestion-des-onglets)
- **Tests** → [CONTRIBUTING.md](./CONTRIBUTING.md#tests)
- **Types** → [API.md](./API.md#types)

### Z
- **Zustand** → [store.md](./store.md)

---

## 💡 Questions fréquentes

### Comment ajouter une nouvelle fonctionnalité ?

1. Lire [Architecture](./architecture.md) pour comprendre le flux
2. Ajouter l'action dans [Store](./store.md)
3. Créer/modifier le composant dans [Composants](./composants.md)
4. Ajouter le handler IPC dans [Electron](./electron.md)
5. Suivre les standards de [Contributing](./CONTRIBUTING.md)

### Comment déboguer un problème ?

1. Consulter [Installation - Dépannage](./installation.md#dépannage)
2. Vérifier les logs console (Main et Renderer)
3. Ouvrir les DevTools Electron
4. Chercher dans les issues GitHub

### Comment les données sont sauvegardées ?

1. Voir [Electron - Persistance](./electron.md#persistance-des-données)
2. Fichiers JSON dans `userData`
3. Sauvegarde automatique à chaque modification

### Quelle est la différence entre Main et Renderer ?

1. Lire [Architecture - Vue d'ensemble](./architecture.md#vue-densemble)
2. Main = Node.js, accès système
3. Renderer = React, interface utilisateur
4. Communication via IPC

---

## 📝 Glossaire

| Terme | Définition | Documentation |
|-------|------------|---------------|
| **BrowserView** | Composant Electron pour afficher des pages web | [electron.md](./electron.md) |
| **IPC** | Inter-Process Communication | [architecture.md](./architecture.md) |
| **Store** | Gestion d'état centralisée (Zustand) | [store.md](./store.md) |
| **Tab Group** | Groupe d'onglets avec nom et couleur | [fonctionnalites.md](./fonctionnalites.md) |
| **Main Process** | Processus principal Electron (Node.js) | [electron.md](./electron.md) |
| **Renderer Process** | Processus de rendu (React) | [composants.md](./composants.md) |
| **Preload Script** | Script de sécurité entre Main et Renderer | [electron.md](./electron.md) |
| **Context Isolation** | Isolation de sécurité entre processus | [architecture.md](./architecture.md) |

---

## 🚀 Prochaines étapes

Après avoir lu la documentation :

1. **Utilisateurs** : Tester toutes les fonctionnalités
2. **Développeurs** : Cloner et expérimenter
3. **Contributeurs** : Choisir une issue et contribuer

---

## 📞 Support

- 📖 **Documentation** : Ce dossier `docs/`
- 🐛 **Bugs** : GitHub Issues
- 💬 **Questions** : GitHub Discussions
- 🤝 **Contribution** : [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Dernière mise à jour** : Novembre 2024  
**Version** : 1.0.0
